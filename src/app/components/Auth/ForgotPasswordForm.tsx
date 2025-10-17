
import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import useAuthStore from '../../store/auth';

export function ForgotPasswordForm() {
  const { forgotPassword, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);
    try {
      const response = await forgotPassword({ email });
      setMessage(response.message || 'Se um usuário com este e-mail for encontrado, um link de redefinição de senha será enviado.');
    } catch (err) {
      // Error is handled in the store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" role="alert" className="border-red-200 bg-red-50 text-red-900">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && !error && (
        <Alert variant="default" className="border-green-200 bg-green-50 text-green-900">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-border/40 focus:border-foreground transition-colors"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
      >
        {isLoading ? 'Enviando...' : 'Redefinir Senha'}
      </Button>
    </form>
  );
}