
import { useEffect, useRef, useState } from 'react';

// Custom hook for delayed appearance
export const useDelayedAppearance = (delay: number = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return isVisible;
};

// Custom hook for sequential appearance of multiple elements
export const useSequentialAppearance = (count: number, delay: number = 200) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);
  
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    for (let i = 0; i < count; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => {
          const newArray = [...prev];
          newArray[i] = true;
          return newArray;
        });
      }, delay * i);
      
      timers.push(timer);
    }
    
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [count, delay]);
  
  return Array.from({ length: count }, (_, i) => visibleItems[i] || false);
};

// Custom hook for smooth progress animation
export const useSmoothProgress = (targetValue: number, duration: number = 500) => {
  const [progress, setProgress] = useState(0);
  const prevTargetRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (targetValue === prevTargetRef.current) return;
    
    prevTargetRef.current = targetValue;
    startTimeRef.current = null;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate current progress value based on previous progress and target
      const startValue = prevTargetRef.current === targetValue ? 0 : progress;
      const currentProgress = startValue + (targetValue - startValue) * progress;
      
      setProgress(currentProgress);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);
  
  return progress;
};

// Custom hook for fade-in animation on element appearance in viewport
export const useFadeInOnScroll = () => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entries[0].target);
      }
    });
    
    if (domRef.current) {
      observer.observe(domRef.current);
    }
    
    return () => {
      if (domRef.current) {
        observer.unobserve(domRef.current);
      }
    };
  }, []);
  
  return { isVisible, domRef };
};
