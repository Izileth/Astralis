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
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        {error && (
          <Alert variant="destructive" role="alert">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && !error && (
          <Alert variant="default">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button variant={"destructive"} type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Redefinir Senha'}
        </Button>
      </div>
    </form>
  );
}
