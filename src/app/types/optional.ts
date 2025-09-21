
// Para formulários com estados de loading
export interface FormState {
  isLoading: boolean;
  errors: Record<string, string>;
  success: boolean;
}

// Para componentes que podem estar em loading
export interface WithLoading {
  isLoading?: boolean;
}

// Para componentes com dados opcionais
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
