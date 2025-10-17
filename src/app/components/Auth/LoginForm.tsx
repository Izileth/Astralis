import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import useAuthStore from '../../store/auth';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      navigate('/profile');
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

      <div className="space-y-2">
        <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Senha
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-border/40 focus:border-foreground transition-colors"
        />
      </div>

      <div className="flex justify-end">
        <Link to="/forgot-password" className="group">
          <p className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Esqueceu sua senha?
          </p>
        </Link>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  );
}