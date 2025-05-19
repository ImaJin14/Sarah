import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Header = () => {
  return (
    <header className="text-center py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="inline-block"
      >
        <Heart className="h-16 w-16 mx-auto text-red-500 mb-4" fill="#FCA5A5" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-red-600 mb-4"
      >
        Happy Birthday, My Love
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-xl md:text-2xl text-purple-700 max-w-2xl mx-auto leading-relaxed"
      >
        To the woman who makes my heart skip a beat, who fills my days with joy,
        and who makes every moment worth living. This is for you.
      </motion.p>
    </header>
  );
};

export default Header;