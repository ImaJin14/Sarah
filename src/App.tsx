import { useState } from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import LoveLetter from './components/LoveLetter';
import BirthdayCake from './components/BirthdayCake';
import GiftReveal from './components/GiftReveal';
import Footer from './components/Footer';
import MusicPlayer from './components/MusicPlayer';
import FloatingHearts from './components/FloatingHearts';
import MemoryTimeline from './components/MemoryTimeline';
import WishCollection from './components/WishCollection';
import InteractiveMap from './components/InteractiveMap';
import BirthdayCountdown from './components/BirthdayCountdown';
import VideoMessages from './components/VideoMessages';
import VoiceNotes from './components/VoiceNotes';
import FavoriteThings from './components/FavoriteThings';
import QuizAboutSarah from './components/QuizAboutSarah';
import BucketList from './components/BucketList';
import GuestBook from './components/GuestBook';
// import ThemeToggle from './components/ThemeToggle';
// import SocialShare from './components/SocialShare';
import { motion } from 'framer-motion';
// import { useTheme } from './hooks/useTheme';


function App() {
  const [giftOpened, setGiftOpened] = useState(false);

  const handleOpenGift = () => {
    setGiftOpened(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 relative overflow-hidden">
      <FloatingHearts />
      
      <MusicPlayer />
      <BirthdayCountdown />
      
      {/* <ThemeToggle /> */}
      {/* <SocialShare /> */}      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <Header />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="my-12"
        >
          <BirthdayCake />
        </motion.div>

        <main className="mt-8 space-y-16">
           <Gallery />
           <VideoMessages />
           <VoiceNotes />
           <MemoryTimeline />
           <InteractiveMap />
           <LoveLetter />
           <FavoriteThings />
           <BucketList />
           <QuizAboutSarah />
           <WishCollection />
           <GuestBook />
           <GiftReveal onOpenGift={handleOpenGift} isOpen={giftOpened} />
         </main>
        
        <Footer />
      </motion.div>
    </div>
  );
}

export default App;
