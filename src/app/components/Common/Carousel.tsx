import { useState, useEffect, useRef } from 'react';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
}

interface CarouselProps {
  items: MediaItem[];
  autoPlayInterval?: number; // in milliseconds
}

const carouselStyles = `
  .carousel-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .carousel-slides {
    display: flex;
    height: 100%;
    transition: transform 0.5s ease-in-out;
  }
  .carousel-slide {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
  }
  .carousel-slide img, .carousel-slide video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .carousel-progress-bar-container {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.2);
  }
  .carousel-progress-bar {
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    transition: width 0.1s linear;
  }
`;

export function Carousel({ items, autoPlayInterval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<number | null>(null);

  useEffect(() => {
    if (items.length <= 1) return;

    const startTimer = () => {
      const startTime = Date.now();

      const updateProgress = () => {
        const elapsedTime = Date.now() - startTime;
        const progressPercentage = (elapsedTime / autoPlayInterval) * 100;
        setProgress(progressPercentage);

        if (elapsedTime < autoPlayInterval) {
          progressRef.current = requestAnimationFrame(updateProgress);
        } else {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }
      };

      progressRef.current = requestAnimationFrame(updateProgress);
    };

    const clearTimers = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (progressRef.current) {
        cancelAnimationFrame(progressRef.current);
      }
    };

    clearTimers();
    setProgress(0);
    startTimer();

    return clearTimers;
  }, [currentIndex, items.length, autoPlayInterval]);

  if (!items || items.length === 0) {
    return null; // Ou um placeholder
  }

  return (
    <div className="carousel-container">
      <style>{carouselStyles}</style>
      <div className="carousel-slides" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {items.map((item, index) => (
          <div className="carousel-slide" key={index}>
            {item.type === 'image' ? (
              <img src={item.src} alt={`Slide ${index + 1}`} />
            ) : (
              <video src={item.src} autoPlay muted loop playsInline />
            )}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div className="carousel-progress-bar-container">
          <div className="carousel-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
}