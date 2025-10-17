
// ForgotPasswordPage.tsx
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { ForgotPasswordForm } from '../components/Auth/ForgotPasswordForm';

export function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md border-border/40 shadow-sm">
        <CardHeader className="space-y-2 pb-6 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Esqueceu sua senha?
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Digite seu e-mail abaixo e enviaremos um link para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ForgotPasswordForm />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Lembrou?
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Lembrou da senha?{' '}
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