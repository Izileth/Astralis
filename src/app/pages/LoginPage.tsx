import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LoginForm } from '../components/Auth/LoginForm';

export function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center">
            <p className="text-sm">
              Não tem uma conta? {' '}
              <Link to="/register" className="underline">
                Crie uma agora
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
