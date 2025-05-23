import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Gift, Sparkles } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const BirthdayCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isToday, setIsToday] = useState(false);

  // Set Sarah's next birthday date (you can customize this)
  const getNextBirthday = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let birthday = new Date(currentYear, 4, 27); // May 27th (month is 0-indexed)
    
    // If birthday has passed this year, set it to next year
    if (birthday < now) {
      birthday = new Date(currentYear + 1, 4, 27);
    }
    
    return birthday;
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const birthday = getNextBirthday();
      const difference = birthday.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsToday(false);
      } else {
        // Check if it's today
        const today = new Date();
        const birthdayToday = new Date(today.getFullYear(), 4, 27);
        setIsToday(today.toDateString() === birthdayToday.toDateString());
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isToday) {
    return (
      <section className="py-16 bg-gradient-to-r from-pink-400 to-purple-600 text-white rounded-2xl">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Gift className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-4xl font-serif font-bold mb-4">
              🎉 It's Sarah's Birthday! 🎉
            </h2>
            <p className="text-xl opacity-90">
              Today is the special day! Happy Birthday, Sarah!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-4xl font-serif font-bold mb-2">
            Countdown to Sarah's Birthday
          </h2>
          <p className="text-xl opacity-90">
            The most wonderful day of the year is coming!
          </p>
        </motion.div>

        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-4"
            >
              <motion.div
                key={item.value}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-3xl font-bold mb-1"
              >
                {item.value.toString().padStart(2, '0')}
              </motion.div>
              <div className="text-sm opacity-80">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Calendar className="w-6 h-6 inline mr-2" />
          <span className="text-lg">
            Next Birthday: {getNextBirthday().toLocaleDateString()}
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default BirthdayCountdown;