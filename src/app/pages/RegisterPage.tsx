import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RegisterForm } from '../components/Auth/RegisterForm';

export function RegisterPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Criar Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="mt-4 text-center">
            <p className="text-sm">
              Já tem uma conta? {' '}
              <Link to="/login" className="underline">
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
