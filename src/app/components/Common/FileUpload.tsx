import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, Flex, IconButton, AspectRatio, Progress, Button } from '@radix-ui/themes';
import { UploadIcon, Cross2Icon, ImageIcon, CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useCurrentUser, useImageUpload, useImageValidation } from '../../hooks/useUser'; // ajuste o caminho

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
  multiple?: boolean; // Note: multiple is only for post variant
  userId?: string; // Para upload de avatar/banner de outros usuários
}

export function FileUpload({ 
  onUploadComplete,
  variant = 'post',
  multiple = false,
  userId,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  
  // Hooks para upload
  const { user: currentUser } = useCurrentUser();
  const { uploadUserAvatar, uploadUserBanner, isUploading: globalIsUploading } = useImageUpload();
  const { validateImageFile } = useImageValidation();
  
  // Estado local de upload
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validatedFiles: UploadableFile[] = [];

    acceptedFiles.forEach(file => {
      // Validar arquivo apenas para avatar e banner
      if (variant !== 'post') {
        const validation = validateImageFile(file, {
          maxSize: variant === 'banner' ? 10 : 5, // Banner até 10MB, avatar até 5MB
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

      // Arquivo válido
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
    // Filtrar apenas arquivos pendentes
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    
    // Marcar arquivos como 'uploading'
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

          // Simular progresso inicial
          setFiles(prev => prev.map(f => 
            f.file === uploadableFile.file ? { ...f, progress: 10 } : f
          ));

          if (variant === 'avatar') {
            result = await uploadUserAvatar(targetUserId, uploadableFile.file);
          } else if (variant === 'banner') {
            result = await uploadUserBanner(targetUserId, uploadableFile.file);
          } else {
            // Para posts, você pode implementar um serviço específico
            // Por agora, vamos simular
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockUrl = `https://picsum.photos/seed/${encodeURIComponent(uploadableFile.file.name)}/800/600`;
            onUploadComplete(mockUrl);
            return { ...uploadableFile, status: 'success' as const, progress: 100 };
          }

          // Progresso completo
          setFiles(prev => prev.map(f => 
            f.file === uploadableFile.file ? { ...f, progress: 100 } : f
          ));

          // Notificar conclusão com a URL da imagem
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
      
      // Atualizar estado com resultados
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
          dropzone: { p: '2', width: 128, height: 128, borderRadius: '50%' },
          thumb: { width: 128, height: 128, borderRadius: '50%' },
          icon: { width: 32, height: 32 },
        };
      case 'banner':
        return {
          dropzone: { p: '5', height: 160, width: '100%' },
          thumb: { width: '100%', height: 160 },
          icon: { width: 48, height: 48 },
        };
      case 'post':
      default:
        return {
          dropzone: { p: '5' },
          thumb: { width: 100, height: 100 },
          icon: { width: 24, height: 24 },
        };
    }
  };

  const styles = getVariantStyles();

  const renderThumb = (uploadableFile: UploadableFile) => {
    const { file, status, progress, error } = uploadableFile;
    
    return (
      <Box key={file.name} style={{ position: 'relative', ...styles.thumb, overflow: 'hidden' }}>
        <AspectRatio ratio={variant === 'banner' ? 16 / 9 : 1}>
          {file.type.startsWith('image/') ? (
            <img 
              src={file.preview} 
              alt={`Preview of ${file.name}`} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                opacity: status === 'error' ? 0.5 : 1
              }} 
            />
          ) : (
            <Flex align="center" justify="center" width="100%" height="100%" style={{ backgroundColor: 'var(--gray-a3)' }}>
              <ImageIcon style={styles.icon} />
            </Flex>
          )}
        </AspectRatio>
        
        {/* Progress bar para upload */}
        {status === 'uploading' && (
          <Progress 
            value={progress} 
            style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              width: '100%' 
            }} 
          />
        )}
        
        {/* Ícone de sucesso */}
        {status === 'success' && (
          <CheckCircledIcon 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              color: 'white', 
              width: 32, 
              height: 32, 
              background: 'rgba(34, 197, 94, 0.8)', 
              borderRadius: '50%',
              padding: 4
            }} 
          />
        )}
        
        {/* Ícone de erro */}
        {status === 'error' && (
          <Flex 
            align="center" 
            justify="center"
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              background: 'rgba(239, 68, 68, 0.1)',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <ExclamationTriangleIcon 
              style={{ 
                color: 'var(--red-11)', 
                width: 24, 
                height: 24
              }} 
            />
            {error && (
              <Text size="1" color="red" style={{ textAlign: 'center', padding: '0 8px' }}>
                {error}
              </Text>
            )}
            <Button 
              size="1" 
              variant="soft" 
              color="red"
              onClick={() => retryUpload(uploadableFile)}
            >
              Tentar novamente
            </Button>
          </Flex>
        )}
        
        {/* Botão de remover */}
        <IconButton 
          size="1" 
          variant="solid" 
          color="gray" 
          onClick={() => removeFile(file)} 
          style={{ 
            position: 'absolute', 
            top: 4, 
            right: 4, 
            cursor: 'pointer' 
          }} 
          highContrast
        >
          <Cross2Icon />
        </IconButton>
      </Box>
    );
  };

  const hasPendingFiles = files.some(f => f.status === 'pending');
  const hasErrorFiles = files.some(f => f.status === 'error');
  const uploading = isUploading || globalIsUploading;

  return (
    <Flex direction="column" gap="4">
      <Box
        {...getRootProps()}
        style={{
          ...styles.dropzone,
          border: `2px dashed var(--gray-a7)`,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'var(--gray-a2)' : 'transparent',
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          opacity: uploading ? 0.6 : 1,
          pointerEvents: uploading ? 'none' : 'auto',
        }}
      >
        <input {...getInputProps()} />
        {files.length === 0 && (
          <Flex direction="column" align="center" gap="2">
            <UploadIcon style={styles.icon} />
            <Text size="2">
              {isDragActive
                ? 'Solte o arquivo aqui...'
                : "Arraste e solte ou clique para selecionar"}
            </Text>
            {variant !== 'avatar' && (
              <Text size="1" color="gray">
                {variant === 'post' ? 'Imagens e vídeos' : 'Imagem'} 
                {variant === 'banner' ? ' (até 10MB)' : ' (até 5MB)'}
              </Text>
            )}
          </Flex>
        )}
        {files.length > 0 && variant !== 'post' && renderThumb(files[0])}
      </Box>

      {files.length > 0 && variant === 'post' && (
        <Flex wrap="wrap" gap="3" mt="4">
          {files.map(renderThumb)}
        </Flex>
      )}

      {files.length > 0 && !uploading && hasPendingFiles && (
        <Button 
          onClick={handleUpload} 
          color='red'
          disabled={uploading}
        >
          {uploading ? 'Enviando...' : `Upload ${variant === 'post' && files.length > 1 ? `${files.length} files` : 'file'}`}
        </Button>
      )}

      {hasErrorFiles && (
        <Text size="2" color="red">
          Alguns arquivos falharam no upload. Clique em "Tentar novamente" ou remova-os.
        </Text>
      )}
    </Flex>
  );
}
