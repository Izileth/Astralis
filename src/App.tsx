import AppRoutes from "./app/router";
import { Header } from "./app/components/Layout/Header"; // Import the Header component
import { Flex, Box } from "@radix-ui/themes"; // Assuming Radix UI for layout

function App() {
  return (
    <Flex direction="column" style={{ minHeight: "100vh" }}>
      <Header /> {/* Render the Header globally */}
      <Box flexGrow="1"> {/* This Box will contain the routes and take up remaining space */}
        <AppRoutes />
      </Box>
    </Flex>
  );
}

export default App;
