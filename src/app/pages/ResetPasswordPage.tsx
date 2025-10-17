
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { ResetPasswordForm } from '../components/Auth/ResetPasswordForm';

export function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md border-border/40 shadow-sm">
        <CardHeader className="space-y-2 pb-6 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Redefinir Senha
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Digite sua nova senha abaixo para redefinir o acesso à sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}