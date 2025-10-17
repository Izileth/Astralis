
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RegisterForm } from '../components/Auth/RegisterForm';

export function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md border-border/40 shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight text-center">
            Criar Conta
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Preencha os dados para criar sua conta
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <RegisterForm />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Já tem conta?
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                className="font-medium text-foreground hover:underline transition-all"
              >
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}