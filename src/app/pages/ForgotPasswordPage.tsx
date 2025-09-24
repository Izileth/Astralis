import { Card, Flex, Box, Text, Heading } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { ForgotPasswordForm } from '../components/Auth/ForgotPasswordForm';

export function ForgotPasswordPage() {
  return (
    <Flex align="center" justify="center" style={{ height: '100vh' }}>
      <Card style={{ width: 400 }}>
        <Box p="4">
          <Heading align="center" mb="6">Esqueceu sua senha?</Heading>
          <Text as="p" size="2" mb="4" align="center">
            Digite seu e-mail abaixo e enviaremos um link para redefinir sua senha.
          </Text>
          <ForgotPasswordForm />
          <Box mt="4" className='text-center'>
            <Text size="2">
              Lembrou da senha? {' '}
              <Link to="/login">Faça login</Link>
            </Text>
          </Box>
        </Box>
      </Card>
    </Flex>
  );
}
