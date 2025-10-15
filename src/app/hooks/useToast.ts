

import { toast as sonnerToast } from 'sonner';

type ToastProps = {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export function useToast() {
  return {
    toast: ({ title, description, action }: ToastProps) => {
      return sonnerToast.success(title, {
        description,
        action: action ? {
          label: action.label,
          onClick: action.onClick,
        } : undefined,
      });
    },
    // Métodos adicionais para diferentes tipos de toast
    success: (title: string, description?: string) => {
      return sonnerToast.success(title, { description });
    },
    error: (title: string, description?: string) => {
      return sonnerToast.error(title, { description });
    },
    warning: (title: string, description?: string) => {
      return sonnerToast.warning(title, { description });
    },
    info: (title: string, description?: string) => {
      return sonnerToast.info(title, { description });
    },
    // Método para toasts promissores (loading -> success/error)
    promise: <T>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: unknown) => string);
      }
    ) => {
      return sonnerToast.promise(promise, options);
    },
    dismiss: (toastId?: string | number) => {
      sonnerToast.dismiss(toastId);
    },
  };
}

// Export direto do sonner para uso sem hook quando necessário
export { sonnerToast as toast };