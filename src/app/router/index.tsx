import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '../store/auth';
import { LoginPage } from '../pages/LoginPage';
import { IndexPage } from '../pages/Index';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { SocialAuthCallbackPage } from '../pages/SocialAuthCallbackPage';
import { Flex, Spinner } from '@radix-ui/themes';

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ height: '100vh' }}>
        <Spinner size={'3'} />
      </Flex>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ height: '100vh' }}>
        <Spinner size={'3'} />
      </Flex>
    );
  }

  return (
    <Routes>

      <Route path="/" element={<IndexPage/>}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<SocialAuthCallbackPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/profile" />} />
    </Routes>
  );
}

export default AppRoutes;
