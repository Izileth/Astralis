import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Spinner, Callout } from '@radix-ui/themes';
import useAuthStore from '../store/auth';

export function SocialAuthCallbackPage() {
  const navigate = useNavigate();
  const { socialLogin, error, clearError } = useAuthStore();

  useEffect(() => {
    const handleSocialLogin = async () => {
      clearError();
      const params = new URLSearchParams(window.location.search);
      try {
        await socialLogin(params);
        navigate('/profile');
      } catch (err) {
        // Error is handled in the store, navigate to login with error
        navigate('/login', { state: { socialLoginError: error || 'Falha no login social.' } });
      }
    };

    handleSocialLogin();
  }, [navigate, socialLogin, clearError, error]);

  return (
    <Flex align="center" justify="center" style={{ height: '100vh' }}>
      <Flex direction="column" gap="3" align="center">
        <Spinner size="3" />
        <Callout.Root color="blue">
          <Callout.Text>Processando login social...</Callout.Text>
        </Callout.Root>
        {error && (
          <Callout.Root color="red" role="alert">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
      </Flex>
    </Flex>
  );
}
