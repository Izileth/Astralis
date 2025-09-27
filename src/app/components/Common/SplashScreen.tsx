import { Flex, Text, Box } from '@radix-ui/themes';

export function SplashScreen() {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="h-screen bg-white"
    >
      {/* Logo/Brand Section */}
      <Box className="mb-8">
        <Flex direction="column" align="center" gap="2">
          {/* Logo */}
          <Box className="w-24 h-24 mb-4 relative">
            <img 
              src="https://i.pinimg.com/736x/7b/56/3a/7b563ad1a7f1f60cf095c155fd53deb5.jpg" 
              alt="Astralis Logo" 
              className="w-full h-full object-cover rounded-full border-4 border-red-600"
            />
          </Box>
          
          {/* Brand Name */}
          <Text size="8" weight="bold" className="font-serif text-black tracking-tight">
            ASTRALIS
          </Text>
          
          {/* Tagline */}
          <Text size="2" className="font-sans text-gray-500 uppercase tracking-wider">
            Portal de Notícias
          </Text>
        </Flex>
      </Box>

      {/* Custom Skeleton Loading */}
      <Box className="w-full max-w-md">
        {/* Loading Text */}
        <Text size="1" className="font-sans text-gray-400 text-center mb-4 uppercase tracking-wider">
          Carregando conteúdo...
        </Text>
        
  
        {/* Progress Indicator */}
        <Box className="mt-6">
          <Box className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <Box className="h-full bg-red-600 rounded-full animate-pulse" style={{ width: '60%' }}></Box>
          </Box>
          <Text size="1" className="font-sans text-gray-400 text-center mt-2">
            Preparando sua experiência...
          </Text>
        </Box>
      </Box>

      {/* Footer */}
      <Box className="absolute bottom-6">
        <Text size="1" className="font-serif text-gray-300 text-center">
          © 2025 Astralis Portal
        </Text>
      </Box>
    </Flex>
  );
}