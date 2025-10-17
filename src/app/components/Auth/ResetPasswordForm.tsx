
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" role="alert" className="border-red-200 bg-red-50 text-red-900">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert 
          variant={error ? "destructive" : "default"} 
          role="alert"
          className={error ? "border-red-200 bg-red-50 text-red-900" : "border-green-200 bg-green-50 text-green-900"}
        >
          {error ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Nova Senha
        </label>
        <Input
          id="newPassword"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="border-border/40 focus:border-foreground transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Confirmar Nova Senha
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="border-border/40 focus:border-foreground transition-colors"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
      >
        {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
      </Button>
    </form>
  );
}