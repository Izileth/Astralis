import { useState } from 'react';
import { Button, TextField, Flex, Callout } from '@radix-ui/themes';
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button size="3" type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Redefinir Senha'}
        </Button>
      </Flex>
    </form>
  );
}
