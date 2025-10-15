import AppRoutes from "./app/router";
import { MainLayout } from "./app/components/Layout/MainLayout";
import { Toaster } from "./app/components/ui/sonner";

function App() {
  return (
    <>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
      <Toaster />
    </>
  );
}

export default App;
