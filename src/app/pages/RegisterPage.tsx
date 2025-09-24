import { Card, Flex, Box, Text, Heading } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/Auth/RegisterForm';

export function RegisterPage() {
  return (
    <Flex align="center" justify="center" style={{ height: '100vh' }}>
      <Card style={{ width: 400 }}>
        <Box p="4">
          <Heading align="center" mb="6">Criar Conta</Heading>
          <RegisterForm />
          <Box mt="4" className='text-center'>
            <Text size="2">
              Já tem uma conta? {' '}
              <Link to="/login">Faça login</Link>
            </Text>
          </Box>
        </Box>
      </Card>
    </Flex>
  );
}
