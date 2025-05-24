
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Gift, Sparkles } from 'lucide-react';

interface FullscreenCountdownProps {
  targetDate: string; // Format: 'YYYY-MM-DD'
  onCountdownComplete: () => void;
}

const FullscreenCountdown: React.FC<FullscreenCountdownProps> = ({ 
  targetDate, 
  onCountdownComplete 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate + 'T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!isComplete) {
          setIsComplete(true);
          setTimeout(onCountdownComplete, 3000); // Show celebration for 3 seconds
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onCountdownComplete, isComplete]);

  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: 0,
            scale: 0.5 + Math.random() * 0.5
          }}
          animate={{
            y: -50,
            rotate: 360,
            scale: 0.8 + Math.random() * 0.4
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        >
          {i % 3 === 0 ? (
            <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
          ) : i % 3 === 1 ? (
            <Gift className="w-6 h-6 text-purple-400" />
          ) : (
            <Sparkles className="w-6 h-6 text-yellow-400" />
          )}
        </motion.div>
      ))}
    </div>
  );

  if (isComplete) {
    return (
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 1 }}
      >
        <FloatingElements />
        <motion.div
          className="text-center text-white"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0.6 }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Gift className="w-24 h-24 mx-auto mb-8 text-yellow-300" />
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            🎉 IT'S TIME! 🎉
          </h1>
          <p className="text-2xl md:text-3xl">
            Happy Birthday, Sarah! 🎂
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <FloatingElements />
      
      <div className="text-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Heart className="w-20 h-20 mx-auto text-red-500 mb-8" fill="currentColor" />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl font-serif font-bold text-purple-800 mb-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Sarah's Birthday Countdown
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-purple-600 mb-12 max-w-2xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          The most special day is almost here! ✨
        </motion.p>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-pink-200"
              whileHover={{ scale: 1.05 }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
            >
              <motion.div
                className="text-4xl md:text-6xl font-bold text-purple-800 mb-2"
                key={item.value} // This will trigger re-animation on value change
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {item.value.toString().padStart(2, '0')}
              </motion.div>
              <div className="text-lg text-purple-600 font-medium">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          className="mt-12 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          onClick={onCountdownComplete}
        >
          Enter Early (Skip Countdown)
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FullscreenCountdown;