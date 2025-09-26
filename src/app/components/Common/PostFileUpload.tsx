import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, Flex, IconButton, AspectRatio, Progress, Button } from '@radix-ui/themes';
import { UploadIcon, Cross2Icon, ImageIcon, CheckCircledIcon, ExclamationTriangleIcon, VideoIcon } from '@radix-ui/react-icons';
import { usePostMediaUpload, useMediaValidation } from '../../hooks/post'; // ajuste o caminho

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
  postId?: string; // Para upload direto em um post existente
  onUploadComplete: (url: string, isVideo: boolean) => void;
  onStandaloneUpload?: (url: string) => void; // Para upload standalone (retorna URL)
  multiple?: boolean;
  acceptVideo?: boolean; // Se deve aceitar vídeos além de imagens
  maxFileSize?: number; // em MB
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
  
  // Hooks para upload e validação
  const { uploadPostMedia, uploadStandaloneImage, isUploading } = usePostMediaUpload();
  const { validateMediaFile } = useMediaValidation();
  
  // Estado local
  const [localUploading, setLocalUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validatedFiles: UploadableFile[] = [];

    acceptedFiles.forEach(file => {
      // Validar arquivo
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
    
    // Marcar arquivos como 'uploading'
    setFiles(prev => prev.map(f => 
      f.status === 'pending' ? { ...f, status: 'uploading' as const } : f
    ));

    try {
      const uploadPromises = pendingFiles.map(async (uploadableFile) => {
        try {
          // Progresso inicial
          setFiles(prev => prev.map(f => 
            f.file === uploadableFile.file ? { ...f, progress: 20 } : f
          ));

          let result;
          const isVideo = uploadableFile.file.type.startsWith('video/');

          if (postId) {
            // Upload direto para um post existente
            result = await uploadPostMedia(postId, uploadableFile.file);
            
            // Progresso 80%
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
            // Upload standalone apenas para imagens
            const url = await uploadStandaloneImage(uploadableFile.file);
            
            // Progresso 80%
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

          // Progresso completo
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
      
      // Atualizar estado com resultados
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

  const renderThumb = (uploadableFile: UploadableFile) => {
    const { file, status, progress, error } = uploadableFile;
    const isVideo = file.type.startsWith('video/');
    
    return (
      <Box key={file.name} style={{ position: 'relative', width: 120, height: 120, overflow: 'hidden', borderRadius: 8 }}>
        <AspectRatio ratio={1}>
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
          ) : isVideo ? (
            <Flex align="center" justify="center" width="100%" height="100%" style={{ backgroundColor: 'var(--gray-a3)' }}>
              <VideoIcon style={{ width: 32, height: 32, color: 'var(--gray-11)' }} />
              <Text size="1" style={{ position: 'absolute', bottom: 4, left: 4, color: 'white', background: 'rgba(0,0,0,0.7)', padding: '2px 4px', borderRadius: 4 }}>
                {Math.round(file.size / (1024 * 1024))}MB
              </Text>
            </Flex>
          ) : (
            <Flex align="center" justify="center" width="100%" height="100%" style={{ backgroundColor: 'var(--gray-a3)' }}>
              <ImageIcon style={{ width: 32, height: 32 }} />
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
              width: '100%',
              height: 4
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
              background: 'rgba(34, 197, 94, 0.9)', 
              borderRadius: '50%',
              padding: 4
            }} 
          />
        )}
        
        {/* Overlay de erro */}
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
              gap: '4px',
              padding: '8px'
            }}
          >
            <ExclamationTriangleIcon 
              style={{ 
                color: 'var(--red-11)', 
                width: 20, 
                height: 20
              }} 
            />
            {error && (
              <Text size="1" color="red" style={{ textAlign: 'center' }}>
                {error.length > 30 ? error.substring(0, 30) + '...' : error}
              </Text>
            )}
            <Button 
              size="1" 
              variant="soft" 
              color="red"
              onClick={() => retryUpload(uploadableFile)}
              style={{ fontSize: 10 }}
            >
              Retry
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

        {/* Nome do arquivo */}
        <Text 
          size="1" 
          style={{ 
            position: 'absolute', 
            bottom: 4, 
            left: 4, 
            right: 20,
            color: 'white', 
            background: 'rgba(0,0,0,0.7)', 
            padding: '2px 4px', 
            borderRadius: 4,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >
          {file.name}
        </Text>
      </Box>
    );
  };

  const hasPendingFiles = files.some(f => f.status === 'pending');
  const hasErrorFiles = files.some(f => f.status === 'error');
  const uploading = localUploading || isUploading;

  return (
    <Flex direction="column" gap="4">
      <Box
        {...getRootProps()}
        style={{
          padding: '32px',
          border: `2px dashed var(--gray-a7)`,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'var(--gray-a2)' : 'transparent',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          borderRadius: 8,
          opacity: uploading ? 0.6 : 1,
          pointerEvents: uploading ? 'none' : 'auto',
        }}
      >
        <input {...getInputProps()} />
        <Flex direction="column" align="center" gap="3">
          <UploadIcon style={{ width: 32, height: 32, color: 'var(--gray-11)' }} />
          <Flex direction="column" align="center" gap="1">
            <Text size="3" weight="medium">
              {isDragActive
                ? 'Solte os arquivos aqui...'
                : "Arraste e solte ou clique para selecionar"}
            </Text>
            <Text size="2" color="gray">
              {acceptVideo ? 'Imagens e vídeos' : 'Imagens'} até {maxFileSize}MB
            </Text>
            {acceptVideo && (
              <Text size="1" color="gray">
                Formatos suportados: JPG, PNG, WebP, GIF, MP4, WebM
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>

      {files.length > 0 && (
        <Flex wrap="wrap" gap="3">
          {files.map(renderThumb)}
        </Flex>
      )}

      {files.length > 0 && !uploading && hasPendingFiles && (
        <Button 
          onClick={handleUpload} 
          color='red'
          size="3"
          disabled={uploading}
        >
          {uploading ? 'Enviando...' : `Upload ${files.filter(f => f.status === 'pending').length} arquivo${files.filter(f => f.status === 'pending').length !== 1 ? 's' : ''}`}
        </Button>
      )}

      {hasErrorFiles && (
        <Text size="2" color="red">
          Alguns arquivos falharam no upload. Clique em "Retry" ou remova-os.
        </Text>
      )}

      {uploading && (
        <Text size="2" color="gray">
          Fazendo upload... Não feche esta página.
        </Text>
      )}
    </Flex>
  );
}