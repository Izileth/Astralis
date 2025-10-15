import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image, Video, AlertCircle } from 'lucide-react';
import { cn } from '@/app/lib/utils';
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
  className?: string;
}

export function PostFileUpload({ 
  postId,
  onUploadComplete,
  onStandaloneUpload,
  multiple = true,
  acceptVideo = true,
  maxFileSize = 10,
  className
}: PostFileUploadProps) {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  
  const { uploadPostMedia, uploadStandaloneImage, isUploading } = usePostMediaUpload();
  const { validateMediaFile } = useMediaValidation();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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
        status: 'uploading',
        progress: 0,
      });
    });

    setFiles(prevFiles => multiple ? [...prevFiles, ...validatedFiles] : validatedFiles);

    // Upload automático e silencioso
    for (const uploadableFile of validatedFiles) {
      if (uploadableFile.status === 'error') continue;
      
      try {
        // Simula progresso suave
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.file === uploadableFile.file && f.progress < 85
              ? { ...f, progress: f.progress + 15 }
              : f
          ));
        }, 300);

        let result;
        const isVideo = uploadableFile.file.type.startsWith('video/');

        if (postId) {
          result = await uploadPostMedia(postId, uploadableFile.file);
          
          if (result) {
            const mediaUrl = isVideo ? result.videoUrl : result.imageUrl;
            if (mediaUrl) {
              onUploadComplete(mediaUrl, isVideo);
            }
          }
        } else if (onStandaloneUpload && !isVideo) {
          const url = await uploadStandaloneImage(uploadableFile.file);
          
          if (url) {
            onStandaloneUpload(url);
            onUploadComplete(url, false);
          }
        } else {
          throw new Error('Configuração de upload inválida');
        }

        clearInterval(progressInterval);
        
        setFiles(prev => prev.map(f => 
          f.file === uploadableFile.file 
            ? { ...f, status: 'success', progress: 100 }
            : f
        ));

      } catch (error: any) {
        console.error(`Erro no upload de ${uploadableFile.file.name}:`, error);
        setFiles(prev => prev.map(f => 
          f.file === uploadableFile.file 
            ? { ...f, status: 'error', error: error.message || 'Erro no upload' }
            : f
        ));
      }
    }
  }, [multiple, validateMediaFile, maxFileSize, acceptVideo, postId, uploadPostMedia, uploadStandaloneImage, onUploadComplete, onStandaloneUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      ...(acceptVideo && { 'video/*': ['.mp4', '.webm', '.ogg'] })
    },
    multiple,
  });

  const removeFile = (fileToRemove: FileWithPreview, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles(prevFiles => prevFiles.filter(f => f.file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };

  const retryUpload = async (uploadableFile: UploadableFile, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setFiles(prev => prev.map(f => 
      f.file === uploadableFile.file 
        ? { ...f, status: 'uploading', progress: 0, error: undefined }
        : f
    ));

    try {
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.file === uploadableFile.file && f.progress < 85
            ? { ...f, progress: f.progress + 15 }
            : f
        ));
      }, 300);

      const isVideo = uploadableFile.file.type.startsWith('video/');
      let result;

      if (postId) {
        result = await uploadPostMedia(postId, uploadableFile.file);
        
        if (result) {
          const mediaUrl = isVideo ? result.videoUrl : result.imageUrl;
          if (mediaUrl) {
            onUploadComplete(mediaUrl, isVideo);
          }
        }
      } else if (onStandaloneUpload && !isVideo) {
        const url = await uploadStandaloneImage(uploadableFile.file);
        
        if (url) {
          onStandaloneUpload(url);
          onUploadComplete(url, false);
        }
      }

      clearInterval(progressInterval);
      
      setFiles(prev => prev.map(f => 
        f.file === uploadableFile.file 
          ? { ...f, status: 'success', progress: 100 }
          : f
      ));

    } catch (error: any) {
      console.error(`Erro no retry:`, error);
      setFiles(prev => prev.map(f => 
        f.file === uploadableFile.file 
          ? { ...f, status: 'error', error: error.message || 'Erro no upload' }
          : f
      ));
    }
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

  const renderMediaItem = (uploadableFile: UploadableFile) => {
    const { file, status, progress, error } = uploadableFile;
    const isVideo = file.type.startsWith('video/');
    
    return (
      <div 
        key={file.name}
        className="relative group w-32 h-32 rounded-lg overflow-hidden bg-muted"
      >
        {/* Preview */}
        {file.type.startsWith('image/') ? (
          <img 
            src={file.preview} 
            alt="Preview"
            className={cn(
              "w-full h-full object-cover transition-all duration-300",
              status === 'uploading' && "blur-[2px] scale-105"
            )}
          />
        ) : isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Video className="w-8 h-8 text-muted-foreground" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Image className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        
        {/* Loading overlay sutil */}
        {status === 'uploading' && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]">
            <div 
              className="absolute bottom-0 left-0 h-1 bg-white/80 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Erro discreto */}
        {status === 'error' && (
          <div className="absolute inset-0 bg-red-500/90 backdrop-blur-sm flex flex-col items-center justify-center p-3 gap-2">
            <AlertCircle className="w-5 h-5 text-white" />
            <button
              onClick={(e) => retryUpload(uploadableFile, e)}
              className="text-[10px] font-medium text-white bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Botão de remover */}
        {status !== 'uploading' && (
          <button
            onClick={(e) => removeFile(file, e)}
            className={cn(
              "absolute top-2 right-2 w-6 h-6 rounded-full",
              "bg-black/60 hover:bg-black/80",
              "flex items-center justify-center",
              "opacity-0 group-hover:opacity-100",
              "transition-all duration-200",
              "backdrop-blur-sm"
            )}
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        )}

        {/* Info do arquivo */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
          <p className="text-[10px] text-white font-medium truncate leading-tight">
            {file.name.length > 18 ? file.name.substring(0, 18) + '...' : file.name}
          </p>
          <p className="text-[9px] text-white/70">
            {formatFileSize(file.size)} {isVideo && '• Vídeo'}
          </p>
        </div>
      </div>
    );
  };

  const hasFiles = files.length > 0;
  const hasUploadingFiles = files.some(f => f.status === 'uploading');
  const hasErrorFiles = files.some(f => f.status === 'error');

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "border-2 border-dashed rounded-lg p-8",
          "flex flex-col items-center justify-center",
          "transition-all duration-200 cursor-pointer",
          isDragActive 
            ? "border-primary bg-primary/5" 
            : isHovered 
              ? "border-muted-foreground/40 bg-muted/50"
              : "border-muted-foreground/20 bg-muted/20",
          isUploading && "opacity-60 cursor-not-allowed pointer-events-none"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={cn(
            "rounded-full p-3 transition-colors",
            isHovered ? "bg-primary/10" : "bg-muted"
          )}>
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? 'Solte aqui' : 'Adicionar arquivos'}
            </p>
            <p className="text-xs text-muted-foreground">
              {acceptVideo ? 'Imagens e vídeos' : 'Imagens'}
            </p>
          </div>
          
          <p className="text-[10px] text-muted-foreground">
            Até {maxFileSize}MB • {acceptVideo ? 'JPG, PNG, WebP, GIF, MP4' : 'JPG, PNG, WebP, GIF'}
          </p>
        </div>
      </div>

      {/* Preview das mídias */}
      {hasFiles && (
        <div className="flex flex-wrap gap-3">
          {files.map(renderMediaItem)}
        </div>
      )}

      {/* Indicador de upload discreto */}
      {hasUploadingFiles && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 border border-blue-100">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-blue-700">
            Processando...
          </p>
        </div>
      )}

      {/* Alerta de erro discreto */}
      {hasErrorFiles && !hasUploadingFiles && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 border border-red-100">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-xs text-red-700">
            Alguns arquivos falharam. Tente novamente.
          </p>
        </div>
      )}
    </div>
  );
}