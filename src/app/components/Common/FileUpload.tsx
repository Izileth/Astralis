import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, ImageIcon } from 'lucide-react';
import { cn } from '@/app/lib/utils';
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
  className?: string;
}

export function FileUpload({ 
  onUploadComplete,
  variant = 'post',
  multiple = false,
  userId,
  className
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  
  const { user: currentUser } = useCurrentUser();
  const { uploadUserAvatar, uploadUserBanner} = useImageUpload();
  const { validateImageFile } = useImageValidation();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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
        status: 'uploading',
        progress: 0,
      });
    });

    setFiles(prevFiles => multiple ? [...prevFiles, ...validatedFiles] : validatedFiles);

    // Upload automático e silencioso
    for (const uploadableFile of validatedFiles) {
      if (uploadableFile.status === 'error') continue;
      
      try {
        const targetUserId = userId || currentUser?.id;
        
        if (!targetUserId) {
          throw new Error('Usuário não identificado');
        }

        // Simula progresso suave
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.file === uploadableFile.file && f.progress < 90
              ? { ...f, progress: f.progress + 10 }
              : f
          ));
        }, 200);

        let result;
        if (variant === 'avatar') {
          result = await uploadUserAvatar(targetUserId, uploadableFile.file);
        } else if (variant === 'banner') {
          result = await uploadUserBanner(targetUserId, uploadableFile.file);
        } else {
          await new Promise(resolve => setTimeout(resolve, 1500));
          const mockUrl = `https://picsum.photos/seed/${encodeURIComponent(uploadableFile.file.name)}/800/600`;
          clearInterval(progressInterval);
          
          setFiles(prev => prev.map(f => 
            f.file === uploadableFile.file 
              ? { ...f, status: 'success', progress: 100 }
              : f
          ));
          
          onUploadComplete(mockUrl);
          continue;
        }

        clearInterval(progressInterval);
        
        setFiles(prev => prev.map(f => 
          f.file === uploadableFile.file 
            ? { ...f, status: 'success', progress: 100 }
            : f
        ));

        const imageUrl = variant === 'avatar' ? result.avatarUrl : result.bannerUrl;
        if (imageUrl) {
          onUploadComplete(imageUrl);
        }

      } catch (error: any) {
        console.error(`Erro no upload de ${uploadableFile.file.name}:`, error);
        setFiles(prev => prev.map(f => 
          f.file === uploadableFile.file 
            ? { ...f, status: 'error', error: error.message || 'Erro no upload' }
            : f
        ));
      }
    }
  }, [multiple, variant, validateImageFile, userId, currentUser, uploadUserAvatar, uploadUserBanner, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': variant === 'post' ? ['.mp4', '.webm', '.ogg'] : [],
    },
    multiple: variant === 'post' ? multiple : false,
  });

  const removeFile = (fileToRemove: FileWithPreview, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles(prevFiles => prevFiles.filter(f => f.file !== fileToRemove));
    URL.revokeObjectURL(fileToRemove.preview);
  };

  useEffect(() => {
    return () => files.forEach(f => URL.revokeObjectURL(f.file.preview));
  }, [files]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'avatar':
        return 'w-24 h-24 rounded-full';
      case 'banner':
        return 'w-full h-32 rounded-lg';
      case 'post':
      default:
        return 'w-full min-h-[120px] rounded-lg';
    }
  };

  const variantStyles = getVariantStyles();
  const hasFiles = files.length > 0;
  const hasUploadingFiles = files.some(f => f.status === 'uploading');

  const renderImage = (uploadableFile: UploadableFile) => {
    const { file, status, progress } = uploadableFile;
    
    return (
      <div 
        key={file.name}
        className={cn(
          "relative group overflow-hidden bg-muted",
          variant === 'avatar' ? 'w-24 h-24 rounded-full' : 
          variant === 'banner' ? 'w-full h-32 rounded-lg' :
          'w-28 h-28 rounded-lg'
        )}
      >
        <img 
          src={file.preview} 
          alt="Preview"
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            status === 'uploading' && "blur-[2px] scale-105"
          )}
        />
        
        {/* Loading overlay sutil */}
        {status === 'uploading' && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity">
            <div 
              className="absolute bottom-0 left-0 h-0.5 bg-white/80 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Botão de remover discreto */}
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

        {/* Erro sutil */}
        {status === 'error' && (
          <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm flex items-center justify-center">
            <div className="text-xs text-red-600 font-medium px-2 py-1 bg-white/90 rounded">
              Erro
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      {/* Dropzone */}
      {(!hasFiles || variant === 'post') && (
        <div
          {...getRootProps()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            variantStyles,
            "border-2 border-dashed transition-all duration-200 cursor-pointer",
            "flex items-center justify-center",
            isDragActive 
              ? "border-primary bg-primary/5" 
              : isHovered 
                ? "border-muted-foreground/40 bg-muted/50"
                : "border-muted-foreground/20 bg-muted/20"
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <div className={cn(
              "rounded-full p-2 transition-colors",
              isHovered ? "bg-primary/10" : "bg-muted"
            )}>
              {variant === 'post' ? (
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Upload className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-foreground">
                {isDragActive ? 'Solte aqui' : 'Adicionar'}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {variant === 'banner' ? 'até 10MB' : 'até 5MB'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview das imagens */}
      {hasFiles && (
        <div className={cn(
          "flex gap-3",
          variant === 'post' ? "flex-wrap" : ""
        )}>
          {files.map(renderImage)}
        </div>
      )}

      {/* Loading indicator discreto */}
      {hasUploadingFiles && (
        <div className="absolute -bottom-6 left-0 right-0 h-0.5 bg-muted overflow-hidden">
          <div className="h-full bg-primary/60 animate-pulse" style={{ width: '60%' }} />
        </div>
      )}
    </div>
  );
}