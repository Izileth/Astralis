import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField, Flex, Callout } from '@radix-ui/themes';
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
      <Flex direction="column" gap="3">
        {error && (
          <Callout.Root color="red" role="alert">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        {message && !error && (
          <Callout.Root color="green">
            <Callout.Text>{message}</Callout.Text>
          </Callout.Root>
        )}

        <TextField.Root
          size="3"
          type="password"
          placeholder="Nova Senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <TextField.Root
          size="3"
          type="password"
          placeholder="Confirmar Nova Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button size="3" type="submit" disabled={isLoading}>
          {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
        </Button>
      </Flex>
    </form>
  );
}
