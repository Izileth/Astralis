import AppRoutes from "./app/router";
import { MainLayout } from "./app/components/Layout/MainLayout";

function App() {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default App;
