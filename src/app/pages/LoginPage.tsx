import { Card, Flex, Box, Text, Heading } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/Auth/LoginForm';

export function LoginPage() {
  return (
    <Flex align="center" justify="center" style={{ height: '100vh' }}>
      <Card style={{ width: 400 }}>
        <Box p="4">
          <Heading align="center" mb="6">Login</Heading>
          <LoginForm />
          <Box mt="4" className='text-center'>
            <Text size="2">
              Não tem uma conta? {' '}
              <Link to="/register">Crie uma agora</Link>
            </Text>
          </Box>
        </Box>
      </Card>
    </Flex>
  );
}
