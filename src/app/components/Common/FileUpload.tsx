import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, Flex, IconButton, Progress, Button } from '@radix-ui/themes';
import { UploadIcon, Cross2Icon, ImageIcon, CheckCircledIcon, ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';
import { useCurrentUser, useImageUpload, useImageValidation } from '../../hooks/useUser';

export interface FileWithPreview extends File {
  preview: string;
  type: string;
}

interface UploadableFile {
  file: FileWithPreview;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  variant?: 'post' | 'banner' | 'avatar';
  multiple?: boolean;
  userId?: string;
}

export function FileUpload({ 
  onUploadComplete,
  variant = 'post',
  multiple = false,
  userId,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  
  const { user: currentUser } = useCurrentUser();
  const { uploadUserAvatar, uploadUserBanner, isUploading: globalIsUploading } = useImageUpload();
  const { validateImageFile } = useImageValidation();
  
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validatedFiles: UploadableFile[] = [];

    acceptedFiles.forEach(file => {
      if (variant !== 'post') {
        const validation = validateImageFile(file, {
          maxSize: variant === 'banner' ? 10 : 5,
          acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
        });

        if (!validation.isValid) {
          validatedFiles.push({
            file: Object.assign(file, {
              preview: URL.createObjectURL(file),
            }) as FileWithPreview,
            status: 'error',
            progress: 0,
            error: validation.errors.join(', ')
          });
          return;
        }
      }

      validatedFiles.push({
        file: Object.assign(file, {
          preview: URL.createObjectURL(file),
        }) as FileWithPreview,
        status: 'pending',
        progress: 0,
      });
    });

    setFiles(prevFiles => multiple ? [...prevFiles, ...validatedFiles] : validatedFiles);
  }, [multiple, variant, validateImageFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': variant === 'post' ? ['.mp4', '.webm', '.ogg'] : [],
    },
    multiple: variant === 'post' ? multiple : false,
  });

  const handleUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    
    setFiles(prev => prev.map(f => 
      f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
    ));

    try {
      const uploadPromises = pendingFiles.map(async (uploadableFile) => {
        try {
          let result;
          const targetUserId = userId || currentUser?.id;
          
          if (!targetUserId) {
            throw new Error('Usuário não identificado');
          }

          setFiles(prev => prev.map(f => 
            f.file === uploadableFile.file ? { ...f, progress: 10 } : f
          ));

          if (variant === 'avatar') {
            result = await uploadUserAvatar(targetUserId, uploadableFile.file);
          } else if (variant === 'banner') {
            result = await uploadUserBanner(targetUserId, uploadableFile.file);
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockUrl = `https://picsum.photos/seed/${encodeURIComponent(uploadableFile.file.name)}/800/600`;
            onUploadComplete(mockUrl);
            return { ...uploadableFile, status: 'success' as const, progress: 100 };
          }

          setFiles(prev => prev.map(f => 
            f.file === uploadableFile.file ? { ...f, progress: 100 } : f
          ));

          const imageUrl = variant === 'avatar' ? result.avatarUrl : result.bannerUrl;
          if (imageUrl) {
            onUploadComplete(imageUrl);
          }

          return { ...uploadableFile, status: 'success' as const };
        } catch (error: any) {
          console.error(`Erro no upload de ${uploadableFile.file.name}:`, error);
          return { 
            ...uploadableFile, 
            status: 'error' as const, 
            error: error.message || 'Erro no upload'
          };
        }
      });

      const results = await Promise.all(uploadPromises);
      
      setFiles(prev => prev.map(f => {
        const result = results.find(r => r.file === f.file);
        return result || f;
      }));

    } catch (error) {
      console.error('Erro geral no upload:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles(prevFiles => prevFiles.filter(f => f.file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };

  const retryUpload = (uploadableFile: UploadableFile) => {
    setFiles(prev => prev.map(f => 
      f.file === uploadableFile.file 
        ? { ...f, status: 'pending', progress: 0, error: undefined }
        : f
    ));
  };

  useEffect(() => {
    return () => files.forEach(f => URL.revokeObjectURL(f.file.preview));
  }, [files]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'avatar':
        return {
          container: { width: '140px', height: '140px' },
          dropzone: { 
            borderRadius: '50%',
            minHeight: '140px',
          },
          thumb: { 
            width: '140px', 
            height: '140px', 
            borderRadius: '50%',
          },
        };
      case 'banner':
        return {
          container: { width: '100%', maxWidth: '600px' },
          dropzone: { 
            borderRadius: '12px',
            minHeight: '180px',
          },
          thumb: { 
            width: '100%', 
            height: '180px',
            borderRadius: '12px',
          },
        };
      case 'post':
      default:
        return {
          container: { width: '100%' },
          dropzone: { 
            borderRadius: '12px',
            minHeight: '160px',
          },
          thumb: { 
            width: '120px', 
            height: '120px',
            borderRadius: '8px',
          },
        };
    }
  };

  const styles = getVariantStyles();
  const uploading = isUploading || globalIsUploading;
  const hasPendingFiles = files.some(f => f.status === 'pending');
  const hasErrorFiles = files.some(f => f.status === 'error');
  const hasFiles = files.length > 0;

  const renderStatusOverlay = (uploadableFile: UploadableFile) => {
    const { status, progress, error } = uploadableFile;
    
    if (status === 'uploading') {
      return (
        <Flex 
          align="center" 
          justify="center"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 'inherit',
          }}
        >
          <Box style={{ width: '60%', textAlign: 'center' }}>
            <Progress 
              value={progress} 
              style={{ 
                width: '100%',
                height: '4px',
                marginBottom: '8px'
              }} 
            />
            <Text size="1" style={{ color: 'white', fontWeight: '500' }}>
              {progress}%
            </Text>
          </Box>
        </Flex>
      );
    }
    
    if (status === 'success') {
      return (
        <Flex 
          align="center" 
          justify="center"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '24px',
            height: '24px',
            background: 'var(--green-9)',
            borderRadius: '50%',
          }}
        >
          <CheckCircledIcon style={{ width: '14px', height: '14px', color: 'white' }} />
        </Flex>
      );
    }
    
    if (status === 'error') {
      return (
        <Flex 
          align="center" 
          justify="center"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(239, 68, 68, 0.9)',
            borderRadius: 'inherit',
            flexDirection: 'column',
            gap: '8px',
            padding: '16px'
          }}
        >
          <ExclamationTriangleIcon style={{ width: '20px', height: '20px', color: 'white' }} />
          {error && (
            <Text size="1" style={{ color: 'white', textAlign: 'center', lineHeight: '1.3' }}>
              {error}
            </Text>
          )}
          <Button 
            size="1" 
            variant="solid"
            color='red'
            onClick={() => retryUpload(uploadableFile)}
          >
            <ReloadIcon style={{ width: '12px', height: '12px' }} />
            Tentar novamente
          </Button>
        </Flex>
      );
    }
    
    return null;
  };

  const renderThumb = (uploadableFile: UploadableFile) => {
    const { file } = uploadableFile;
    
    return (
      <Box 
        key={file.name} 
        style={{ 
          position: 'relative',
          ...styles.thumb,
          overflow: 'hidden',
          border: '1px solid var(--gray-a6)',
        }}
      >
        {file.type.startsWith('image/') ? (
          <img 
            src={file.preview} 
            alt={`Preview`}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
            }} 
          />
        ) : (
          <Flex 
            align="center" 
            justify="center" 
            style={{ 
              width: '100%', 
              height: '100%', 
              background: 'var(--gray-a3)' 
            }}
          >
            <ImageIcon style={{ width: '24px', height: '24px', color: 'var(--gray-a9)' }} />
          </Flex>
        )}
        
        {renderStatusOverlay(uploadableFile)}
        
        {/* Botão de remover */}
        <IconButton 
          size="1" 
          variant="solid" 
          color="gray"
          highContrast
          onClick={() => removeFile(file)} 
          style={{ 
            position: 'absolute', 
            top: '6px', 
            right: '6px',
            width: '24px',
            height: '24px',
            background: 'rgba(0, 0, 0, 0.6)',
            border: 'none',
            cursor: 'pointer',
            opacity: uploadableFile.status === 'uploading' ? 0.5 : 1,
            pointerEvents: uploadableFile.status === 'uploading' ? 'none' : 'auto'
          }} 
        >
          <Cross2Icon style={{ width: '12px', height: '12px' }} />
        </IconButton>
      </Box>
    );
  };

  const renderDropzone = () => (
    <Box
      {...getRootProps()}
      style={{
        ...styles.dropzone,
        border: isDragActive 
          ? '2px solid var(--blue-8)' 
          : hasFiles && variant !== 'post' 
            ? 'none' 
            : '2px dashed var(--gray-a7)',
        background: isDragActive 
          ? 'var(--blue-a2)' 
          : hasFiles && variant !== 'post' 
            ? 'transparent' 
            : 'var(--gray-a1)',
        cursor: uploading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        opacity: uploading ? 0.6 : 1,
        pointerEvents: uploading ? 'none' : 'auto',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      <input {...getInputProps()} />
      
      {!hasFiles || variant === 'post' ? (
        <Flex direction="column" align="center" gap="3">
          <Box
            style={{
              padding: '12px',
              background: 'var(--gray-a3)',
              borderRadius: '50%',
            }}
          >
            <UploadIcon style={{ width: '20px', height: '20px', color: 'var(--gray-11)' }} />
          </Box>
          
          <Flex direction="column" align="center" gap="1">
            <Text size="2" weight="medium" style={{ color: 'var(--gray-12)' }}>
              {isDragActive ? 'Solte aqui' : 'Escolher arquivo'}
            </Text>
            <Text size="1" style={{ color: 'var(--gray-11)' }}>
              {variant === 'avatar' && 'Imagem do perfil'}
              {variant === 'banner' && 'Imagem do Banner'}
              {variant === 'post' && 'Imagens ou vídeos'}
            </Text>
          </Flex>
          
          {variant !== 'avatar' && (
            <Text size="1" style={{ color: 'var(--gray-9)' }}>
              {variant === 'banner' ? 'Até 10MB' : 'Até 5MB'} • JPG, PNG, WEBP
            </Text>
          )}
        </Flex>
      ) : null}
      
      {hasFiles && variant !== 'post' && renderThumb(files[0])}
    </Box>
  );

  return (
    <Flex direction="column" gap="4" style={styles.container}>
      {renderDropzone()}

      {hasFiles && variant === 'post' && (
        <Flex wrap="wrap" gap="3">
          {files.map(renderThumb)}
        </Flex>
      )}

      {hasFiles && hasPendingFiles && (
        <Button 
          onClick={handleUpload} 
          disabled={uploading}
          color='tomato'
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            fontWeight: '500',
            height: '40px',
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? (
            <Flex align="center" gap="2">
              <ReloadIcon style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              Enviando...
            </Flex>
          ) : (
            `Enviar ${files.filter(f => f.status === 'pending').length > 1 ? 'arquivos' : 'arquivo'}`
          )}
        </Button>
      )}

      {hasErrorFiles && (
        <Flex 
          align="center" 
          gap="2" 
          p="3" 
          style={{
            background: 'var(--red-a2)',
            border: '1px solid var(--red-a6)',
            borderRadius: '8px',
          }}
        >
          <ExclamationTriangleIcon style={{ width: '16px', height: '16px', color: 'var(--red-11)' }} />
          <Text size="2" style={{ color: 'var(--red-11)' }}>
            Alguns arquivos falharam. Clique em "Tentar novamente" ou remova-os.
          </Text>
        </Flex>
      )}
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Flex>
  );
}