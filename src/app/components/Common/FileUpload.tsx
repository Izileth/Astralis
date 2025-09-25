import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, Flex, IconButton, AspectRatio, Progress, Button } from '@radix-ui/themes';
import { UploadIcon, Cross2Icon, ImageIcon, CheckCircledIcon } from '@radix-ui/react-icons';

export interface FileWithPreview extends File {
  preview: string;
  type: string;
}

interface UploadableFile {
  file: FileWithPreview;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
}

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  variant?: 'post' | 'banner' | 'avatar';
  multiple?: boolean; // Note: multiple is only for post variant
}

export function FileUpload({ 
  onUploadComplete,
  variant = 'post',
  multiple = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploadableFiles = acceptedFiles.map(file => ({
      file: Object.assign(file, {
        preview: URL.createObjectURL(file),
      }) as FileWithPreview,
      status: 'pending' as const,
      progress: 0,
    }));

    setFiles(prevFiles => multiple ? [...prevFiles, ...newUploadableFiles] : newUploadableFiles);
  }, [multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': variant === 'post' ? ['.mp4', '.webm', '.ogg'] : [],
    },
    multiple: variant === 'post' ? multiple : false,
  });

  const handleUpload = async () => {
    setIsUploading(true);
    setFiles(files.map(f => ({ ...f, status: 'uploading' })));

    const uploadPromises = files.map(async (uploadableFile) => {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        setFiles(prev => prev.map(f => f.file === uploadableFile.file ? { ...f, progress: i } : f));
      }

      // Simulate getting a public URL
      let publicUrl = '';
      if (uploadableFile.file.type.startsWith('image/')) {
        // Use a real image service for a realistic URL
        publicUrl = `https://picsum.photos/seed/${encodeURIComponent(uploadableFile.file.name)}/800/600`;
      } else {
        publicUrl = `https://mock-video-url.com/${uploadableFile.file.name}`;
      }

      onUploadComplete(publicUrl);
      return { ...uploadableFile, status: 'success' as const };
    });

    const settledFiles = await Promise.all(uploadPromises);
    setFiles(settledFiles);
    setIsUploading(false);
  };

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles(prevFiles => prevFiles.filter(f => f.file !== fileToRemove));
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
    const { file, status, progress } = uploadableFile;
    return (
      <Box key={file.name} style={{ position: 'relative', ...styles.thumb, overflow: 'hidden' }}>
        <AspectRatio ratio={variant === 'banner' ? 16 / 9 : 1}>
          {file.type.startsWith('image/') ? (
            <img src={file.preview} alt={`Preview of ${file.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Flex align="center" justify="center" width="100%" height="100%" style={{ backgroundColor: 'var(--gray-a3)' }}>
              <ImageIcon style={styles.icon} />
            </Flex>
          )}
        </AspectRatio>
        {status === 'uploading' && <Progress value={progress} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }} />}
        {status === 'success' && <CheckCircledIcon style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', width: 32, height: 32, background: 'rgba(0,0,0,0.5)', borderRadius: '50%' }} />}
        <IconButton size="1" variant="solid" color="gray" onClick={() => removeFile(file)} style={{ position: 'absolute', top: 4, right: 4, cursor: 'pointer' }} highContrast>
          <Cross2Icon />
        </IconButton>
      </Box>
    );
  };

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
                {variant !== 'avatar' && <Text size="1" color="gray">{variant === 'post' ? 'Imagens e vídeos' : 'Imagem'} </Text>}
            </Flex>
        )}
        {files.length > 0 && variant !== 'post' && renderThumb(files[0])}
      </Box>

      {files.length > 0 && variant === 'post' && (
        <Flex wrap="wrap" gap="3" mt="4">
          {files.map(renderThumb)}
        </Flex>
      )}

      {files.length > 0 && !isUploading && files.some(f => f.status === 'pending') && (
        <Button onClick={handleUpload} color='red'>
          Upload {variant === 'post' && files.length > 1 ? `${files.length} files` : 'file'}
        </Button>
      )}
    </Flex>
  );
}
