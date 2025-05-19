import React, { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { Heart } from 'lucide-react';

interface FloatingHeart {
  id: number;
  x: number;
  scale: number;
  duration: number;
  delay: number;
  opacity: number;
}

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  
  // Generate initial hearts
  useEffect(() => {
    const initialHearts = Array.from({ length: 15 }, (_, i) => createHeart(i));
    setHearts(initialHearts);
    
    // Add a new heart every 3 seconds
    const interval = setInterval(() => {
      setHearts(prevHearts => {
        // Remove oldest heart if we have too many
        const updatedHearts = prevHearts.length >= 25 
          ? [...prevHearts.slice(1)] 
          : [...prevHearts];
        
        return [...updatedHearts, createHeart(Date.now())];
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Create a new heart with random properties
  const createHeart = (id: number): FloatingHeart => {
    return {
      id,
      x: Math.random() * 100, // random horizontal position (0-100%)
      scale: 0.5 + Math.random() * 1.5, // random size
      duration: 15 + Math.random() * 20, // random animation duration
      delay: Math.random() * 5, // random start delay
      opacity: 0.4 + Math.random() * 0.6, // random opacity
    };
  };
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ 
            y: "110vh", 
            x: `${heart.x}vw`,
            opacity: heart.opacity,
            scale: heart.scale,
            rotate: Math.random() * 30 - 15,
          }}
          animate={{ 
            y: "-10vh",
            rotate: Math.random() * 60 - 30,
          }}
          transition={{ 
            duration: heart.duration,
            delay: heart.delay,
            ease: "linear",
            repeat: Infinity,
          }}
          className="absolute"
        >
          <Heart 
            className="text-pink-400" 
            fill="#FCA5A5" 
            size={24} 
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;