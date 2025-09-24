import { Card, Flex, Box, Heading } from '@radix-ui/themes';
import { ResetPasswordForm } from '../components/Auth/ResetPasswordForm';

export function ResetPasswordPage() {
  return (
    <Flex align="center" justify="center" style={{ height: '100vh' }}>
      <Card style={{ width: 400 }}>
        <Box p="4">
          <Heading align="center" mb="6">Redefinir Senha</Heading>
          <ResetPasswordForm />
        </Box>
      </Card>
    </Flex>
  );
}
