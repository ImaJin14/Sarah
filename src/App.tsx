import React, { useState } from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import LoveLetter from './components/LoveLetter';
import GiftReveal from './components/GiftReveal';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import FloatingHearts from './components/FloatingHearts';
import { motion } from 'framer-motion';

function App() {
  const [giftOpened, setGiftOpened] = useState(false);

  const handleOpenGift = () => {
    setGiftOpened(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 relative overflow-hidden">
      <FloatingHearts />
      
      <MusicPlayer />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <Header />
        
        <main className="mt-8 space-y-16">
          <Gallery />
          <LoveLetter />
          <GiftReveal onOpenGift={handleOpenGift} isOpen={giftOpened} />
        </main>
        
        <Footer />
      </motion.div>
    </div>
  );
}

export default App;