import { Flex, Spinner, Text } from '@radix-ui/themes';

export function SplashScreen() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="4"
      style={{
        height: '100vh',
        backgroundColor: 'var(--color-background)',
        color: 'var(--gray-12)',
      }}
    >
      {/* Replace with your actual project logo */}
      <img src="/vite.svg" alt="Project Logo" style={{ width: '120px', height: '120px' }} />
      <Text size="6" weight="bold">Astralis</Text>
      <Spinner size="3" />
    </Flex>
  );
}
