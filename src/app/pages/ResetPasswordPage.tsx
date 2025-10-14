import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ResetPasswordForm } from '../components/Auth/ResetPasswordForm';

export function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Redefinir Senha</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
