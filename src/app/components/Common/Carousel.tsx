import { Box, Flex, Text } from '@radix-ui/themes';
import { useState, useEffect } from 'react';

interface CarouselItem {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
}

interface CarouselProps {
  items?: CarouselItem[];
  interval?: number; // in milliseconds
}

const defaultItems: CarouselItem[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d0069872fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Explore a Natureza',
    description: 'Descubra paisagens incríveis e aventuras ao ar livre.',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Céus Estrelados',
    description: 'Maravilhe-se com a beleza do universo noturno.',
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1465146344425-ad42a8e7218c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Montanhas Majestosas',
    description: 'Conquiste novos picos e desfrute de vistas panorâmicas.',
  },
];

export function Carousel({ items = defaultItems, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval]);

  const currentItem = items[currentIndex];

  return (
    <Box
      style={{
        width: '100%',
        maxWidth: '1200px',
        height: '400px',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 'var(--radius-3)',
      }}
    >
      <img
        src={currentItem.imageUrl}
        alt={currentItem.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 0.5s ease-in-out',
        }}
      />
      <Flex
        direction="column"
        justify="end"
        p="4"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
          color: 'white',
        }}
      >
        <Text size="6" weight="bold" mb="2">
          {currentItem.title}
        </Text>
        <Text size="3">
          {currentItem.description}
        </Text>
      </Flex>
      <Flex
        gap="2"
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {items.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: currentIndex === index ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
            }}
          />
        ))}
      </Flex>
    </Box>
  );
}
