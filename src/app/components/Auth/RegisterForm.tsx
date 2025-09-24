import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Flex, Callout } from '@radix-ui/themes';
import useAuthStore from '../../store/auth';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register({ name, email, password });
      navigate('/profile');
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

        <TextField.Root
          size="3"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField.Root
          size="3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField.Root
          size="3"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button size="3" type="submit" disabled={isLoading}>
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </Flex>
    </form>
  );
}
