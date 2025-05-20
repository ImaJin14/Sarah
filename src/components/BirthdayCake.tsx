import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BirthdayCake: React.FC = () => {
  const [isLit, setIsLit] = useState(false);
  const [showWish, setShowWish] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLit(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleBlowCandles = () => {
    if (isLit) {
      setIsLit(false);
      setShowWish(true);
      setTimeout(() => {
        setShowWish(false);
        setTimeout(() => setIsLit(true), 3000);
      }, 4000);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-[450px] flex items-end justify-center">
      {/* Wish text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: showWish ? 1 : 0, y: showWish ? -30 : 10 }}
        className="absolute top-10 text-center w-full z-20"
      >
        <motion.div
          animate={{ y: showWish ? [0, -40] : 0 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="inline-block bg-white/90 backdrop-blur-md rounded-full px-8 py-4 shadow-xl"
        >
          <h3 className="text-2xl font-semibold text-pink-600">✨ Make a wish, my love! ✨</h3>
        </motion.div>
      </motion.div>

      
      {/* Cake */}
      <div className="relative">
        
        {/* Cake Plate */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-72 h-6 bg-white rounded-full shadow-md"></div>

        {/* Cake Layers */}
        {[
          { width: 'w-40', colors: 'from-pink-400 to-pink-500', dots: 6 },
          { width: 'w-52', colors: 'from-purple-400 to-purple-500', dots: 8 },
          { width: 'w-68', colors: 'from-red-400 to-red-500', dots: 10 }
        ].map((layer, i) => (
          <motion.div
            key={`layer-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.2, duration: 0.5, type: 'spring' }}
            className={`relative h-20 ${layer.width} bg-gradient-to-r ${layer.colors} rounded-2xl shadow-lg mb-2 mx-auto z-${10 + i}`}
          >
            {/* Frosting */}
            <div className="absolute top-0 left-0 w-full h-4 bg-white rounded-b-full shadow-inner"></div>
            {/* Dots */}
            {Array.from({ length: layer.dots }).map((_, d) => (
              <div
                key={`dot-${i}-${d}`}
                className="absolute bottom-2 w-2.5 h-2.5 bg-white rounded-full"
                style={{ left: `${(d + 1) * (100 / (layer.dots + 1))}%` }}
              />
            ))}
          </motion.div>
        ))}

        {/* Candles */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`candle-${i}`} className="absolute -top-12" style={{ left: `${22 + i * 18}%` }}>
            <div className="w-2.5 h-14 bg-gradient-to-b from-blue-300 to-blue-500 relative rounded-sm shadow-sm">
              {/* Candle stripes */}
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="absolute left-0 w-full h-0.5 bg-white opacity-60"
                  style={{ top: `${(j + 1) * 25}%` }}
                />
              ))}

              {/* Flame */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: isLit ? [0.8, 1.2, 0.8] : 0,
                  opacity: isLit ? 1 : 0
                }}
                transition={{
                  repeat: isLit ? Infinity : 0,
                  duration: 0.8,
                  ease: 'easeInOut'
                }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-yellow-300 to-orange-500 rounded-full"
              />
              {/* Glow */}
              {isLit && (
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'easeInOut'
                  }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-300/30 rounded-full blur-md"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className = "cake">
        {/* Blow Button */}
      <button
        onClick={handleBlowCandles}
        disabled={!isLit}
        className={`absolute top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg ${
          isLit
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
            : 'bg-gray-200 text-gray-400 opacity-50'
        }`}
      >
        Blow Candles
      </button>
      </div>
    </div>
  );
};

export default BirthdayCake;
