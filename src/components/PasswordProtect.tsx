import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Heart, Eye, EyeOff } from 'lucide-react';

interface PasswordProtectProps {
  children: React.ReactNode;
  password: string;
  title?: string;
  hint?: string;
}

const PasswordProtect: React.FC<PasswordProtectProps> = ({ 
  children, 
  password, 
  title = "This section is special",
  hint 
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputPassword.toLowerCase().trim() === password.toLowerCase().trim()) {
      setIsUnlocked(true);
      setIsWrong(false);
    } else {
      setIsWrong(true);
      setAttempts(prev => prev + 1);
      setInputPassword('');
      
      // Reset wrong state after animation
      setTimeout(() => setIsWrong(false), 600);
    }
  };

  const getHintMessage = () => {
    if (attempts === 0) return hint;
    if (attempts === 1) return "Think about our special moments together... 💕";
    if (attempts === 2) return "Remember what you always tell me? 🥰";
    if (attempts >= 3) return "It's something you say every day... ❤️";
    return hint;
  };

  if (isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-200 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isWrong ? [1, 1.02, 0.98, 1] : 1
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              rotate: isWrong ? [0, -10, 10, -5, 5, 0] : 0,
              scale: isWrong ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <div className="relative">
              <Lock className="w-16 h-16 mx-auto text-pink-500 mb-4" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
              </motion.div>
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-purple-800 mb-2">
            {title}
          </h2>
          
          <p className="text-purple-600">
            Enter the password to unlock these love notes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              placeholder="Enter password..."
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                isWrong 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-pink-200 focus:border-pink-400'
              }`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {(hint || attempts > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-center"
              >
                <p className="text-sm text-purple-600">
                  💡 <strong>Hint:</strong> {getHintMessage()}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isWrong && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-50 border border-red-200 rounded-xl p-3 text-center"
              >
                <p className="text-sm text-red-600">
                  ❌ Incorrect password. Try again!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!inputPassword.trim()}
          >
            Unlock Love Notes 💕
          </motion.button>
        </form>

        {attempts >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-purple-500">
              Having trouble? Think about what makes our love special... 💖
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PasswordProtect;