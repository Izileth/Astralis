
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LoginForm } from '../components/Auth/LoginForm';

export function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md border-border/40 shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight text-center">
            Login
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Entre com sua conta para continuar
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <LoginForm />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Novo por aqui?
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link 
                to="/register" 
                className="font-medium text-foreground hover:underline transition-all"
              >
                Crie uma agora
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
