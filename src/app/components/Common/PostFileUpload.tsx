import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, Flex, IconButton, Progress, Button } from '@radix-ui/themes';
import { UploadIcon, Cross2Icon, ImageIcon, CheckCircledIcon, ExclamationTriangleIcon, VideoIcon, ReloadIcon } from '@radix-ui/react-icons';
import { usePostMediaUpload, useMediaValidation } from '../../hooks/usePost';

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

interface PostFileUploadProps {
  postId?: string;
  onUploadComplete: (url: string, isVideo: boolean) => void;
  onStandaloneUpload?: (url: string) => void;
  multiple?: boolean;
  acceptVideo?: boolean;
  maxFileSize?: number;
}

export function PostFileUpload({ 
  postId,
  onUploadComplete,
  onStandaloneUpload,
  multiple = true,
  acceptVideo = true,
  maxFileSize = 10,
}: PostFileUploadProps) {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  
  const { uploadPostMedia, uploadStandaloneImage, isUploading } = usePostMediaUpload();
  const { validateMediaFile } = useMediaValidation();
  
  const [localUploading, setLocalUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validatedFiles: UploadableFile[] = [];

    acceptedFiles.forEach(file => {
      const validation = validateMediaFile(file, {
        maxSize: maxFileSize,
        acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        acceptedVideoTypes: acceptVideo ? ['video/mp4', 'video/webm', 'video/ogg'] : []
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

      validatedFiles.push({
        file: Object.assign(file, {
          preview: URL.createObjectURL(file),
        }) as FileWithPreview,
        status: 'pending',
        progress: 0,
      });
    });

    setFiles(prevFiles => multiple ? [...prevFiles, ...validatedFiles] : validatedFiles);
  }, [multiple, validateMediaFile, maxFileSize, acceptVideo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      ...(acceptVideo && { 'video/*': ['.mp4', '.webm', '.ogg'] })
    },
    multiple,
  });

  const handleUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) return;

    setLocalUploading(true);
    
    setFiles(prev => prev.map(f => 
      f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
    ));

    try {
      const uploadPromises = pendingFiles.map(async (uploadableFile) => {
        try {
          setFiles(prev => prev.map(f => 
            f.file === uploadableFile.file ? { ...f, progress: 20 } : f
          ));

          let result;
          const isVideo = uploadableFile.file.type.startsWith('video/');

          if (postId) {
            result = await uploadPostMedia(postId, uploadableFile.file);
            
            setFiles(prev => prev.map(f => 
              f.file === uploadableFile.file ? { ...f, progress: 80 } : f
            ));

            if (result) {
              const mediaUrl = isVideo ? result.videoUrl : result.imageUrl;
              if (mediaUrl) {
                onUploadComplete(mediaUrl, isVideo);
              }
            }
          } else if (onStandaloneUpload && !isVideo) {
            const url = await uploadStandaloneImage(uploadableFile.file);
            
            setFiles(prev => prev.map(f => 
              f.file === uploadableFile.file ? { ...f, progress: 80 } : f
            ));

            if (url) {
              onStandaloneUpload(url);
              onUploadComplete(url, false);
            }
          } else {
            throw new Error('Configuração de upload inválida');
          }

          setFiles(prev => prev.map(f => 
            f.file === uploadableFile.file ? { ...f, progress: 100 } : f
          ));

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
      setLocalUploading(false);
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

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
            borderRadius: '8px',
          }}
        >
          <Box style={{ width: '70%', textAlign: 'center' }}>
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
            borderRadius: '8px',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px'
          }}
        >
          <ExclamationTriangleIcon style={{ width: '20px', height: '20px', color: 'white' }} />
          {error && (
            <Text size="1" style={{ color: 'white', textAlign: 'center', lineHeight: '1.3' }}>
              {error.length > 40 ? error.substring(0, 40) + '...' : error}
            </Text>
          )}
          <Button 
            size="1" 
            variant="solid"
            style={{
              background: 'white',
              color: 'var(--red-9)',
              border: 'none',
              fontWeight: '500',
              fontSize: '11px'
            }}
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
    const isVideo = file.type.startsWith('video/');
    
    return (
      <Box 
        key={file.name} 
        style={{ 
          position: 'relative',
          width: '120px',
          height: '120px',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--gray-a6)',
        }}
      >
        {file.type.startsWith('image/') ? (
          <img 
            src={file.preview} 
            alt="Preview"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
            }} 
          />
        ) : isVideo ? (
          <Flex 
            align="center" 
            justify="center" 
            style={{ 
              width: '100%', 
              height: '100%', 
              background: 'var(--gray-a3)' 
            }}
          >
            <VideoIcon style={{ width: '32px', height: '32px', color: 'var(--gray-11)' }} />
          </Flex>
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
            <ImageIcon style={{ width: '32px', height: '32px', color: 'var(--gray-11)' }} />
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

        {/* Info do arquivo */}
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '8px 6px 6px',
          }}
        >
          <Text 
            size="1" 
            style={{ 
              color: 'white', 
              fontWeight: '500',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              display: 'block',
              lineHeight: '1.2'
            }}
          >
            {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
          </Text>
          <Text 
            size="1" 
            style={{ 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '10px'
            }}
          >
            {formatFileSize(file.size)} {isVideo && '• Video'}
          </Text>
        </Box>
      </Box>
    );
  };

  const uploading = localUploading || isUploading;
  const hasPendingFiles = files.some(f => f.status === 'pending');
  const hasErrorFiles = files.some(f => f.status === 'error');
  const pendingCount = files.filter(f => f.status === 'pending').length;

  return (
    <Flex direction="column" gap="4" style={{ width: '100%' }}>
      <Box
        {...getRootProps()}
        style={{
          padding: '40px 24px',
          border: isDragActive 
            ? '2px solid var(--blue-8)' 
            : '2px dashed var(--gray-a7)',
          background: isDragActive 
            ? 'var(--blue-a2)' 
            : 'var(--gray-a1)',
          borderRadius: '12px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          opacity: uploading ? 0.6 : 1,
          pointerEvents: uploading ? 'none' : 'auto',
          transition: 'all 0.2s ease',
        }}
      >
        <input {...getInputProps()} />
        
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
            <Text size="3" weight="medium" style={{ color: 'var(--gray-12)' }}>
              {isDragActive ? 'Solte aqui' : 'Escolher arquivos'}
            </Text>
            <Text size="2" style={{ color: 'var(--gray-11)' }}>
              {acceptVideo ? 'Imagens e vídeos' : 'Imagens'}
            </Text>
          </Flex>
          
          <Text size="1" style={{ color: 'var(--gray-9)', textAlign: 'center' }}>
            Até {maxFileSize}MB • {acceptVideo ? 'JPG, PNG, WebP, GIF, MP4, WebM' : 'JPG, PNG, WebP, GIF'}
          </Text>
        </Flex>
      </Box>

      {files.length > 0 && (
        <Flex wrap="wrap" gap="3">
          {files.map(renderThumb)}
        </Flex>
      )}

      {files.length > 0 && hasPendingFiles && (
        <Button 
          onClick={handleUpload} 
          disabled={uploading}
          style={{
            background: '#dc2626',
            color: 'white',
            border: 'none',
            fontWeight: '500',
            height: '44px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            borderRadius: '8px'
          }}
        >
          {uploading ? (
            <Flex align="center" gap="2">
              <ReloadIcon style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              Enviando...
            </Flex>
          ) : (
            `Enviar ${pendingCount} ${pendingCount === 1 ? 'arquivo' : 'arquivos'}`
          )}
        </Button>
      )}

      {uploading && (
        <Flex 
          align="center" 
          gap="2" 
          p="3" 
          style={{
            background: 'var(--blue-a2)',
            border: '1px solid var(--blue-a6)',
            borderRadius: '8px',
          }}
        >
          <ReloadIcon style={{ width: '16px', height: '16px', color: 'var(--blue-11)', animation: 'spin 1s linear infinite' }} />
          <Text size="2" style={{ color: 'var(--blue-11)' }}>
            Fazendo upload... Não feche esta página.
          </Text>
        </Flex>
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