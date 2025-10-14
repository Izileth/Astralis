import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import useAuthStore from '../../store/auth';

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setMessage(null);

    if (!token) {
      setMessage('Token de redefinição de senha ausente.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    try {
      await resetPassword({ token, newPassword, confirmPassword });
      setMessage('Sua senha foi redefinida com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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
        {message && (
          <Alert variant={error ? "destructive" : "default"} role="alert">
            {error ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Input
          type="password"
          placeholder="Nova Senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirmar Nova Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button variant={"destructive"} type="submit" disabled={isLoading}>
          {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
        </Button>
      </div>
    </form>
  );
}
