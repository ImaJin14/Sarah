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
import FullscreenCountdown from './components/FullscreenCountdown';
import TabBar from './components/TabBar';
import PasswordProtect from './components/PasswordProtect';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [giftOpened, setGiftOpened] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [showMainSite, setShowMainSite] = useState(false);// Set to false for countdown

  // Set Sarah's birthday date (YYYY-MM-DD format)
  const birthdayDate = '2025-05-27'; // Sarah's birthday

    // Password for the Love section
  const lovePassword = "MyWife";

  const handleOpenGift = () => {
    setGiftOpened(true);
  };

  const handleCountdownComplete = () => {
    setShowMainSite(true);
  };

  // Define your tabs with their content
  const tabs = [
    {
      label: 'Home',
      content: (
        <div className="space-y-16">
          <Header />
          <BirthdayCake />
        </div>
      )
    },
    {
      label: 'Photos',
      content: (
        <div className="space-y-16">
          <Gallery />
          <MemoryTimeline />
        </div>
      )
    },
    {
      label: 'Places',
      content: (
        <div className="space-y-16">
          <InteractiveMap />
          <BucketList />
        </div>
      )
    },
    {
      label: 'Love',
      content: (
        <PasswordProtect
        password={lovePassword}
        title="Just for your eyes!"
        hint="Hint: It's something I wish For Daily... 💕"
        >
        <div className="space-y-16">
          <LoveLetter />
          <div className="grid md:grid-cols-2 gap-8">
            <VideoMessages />
            <VoiceNotes />
          </div>
        </div>
        </PasswordProtect>
      )
    },
    {
      label: 'Fun',
      content: (
        <div className="space-y-16">
          <FavoriteThings />
          <QuizAboutSarah />
        </div>
      )
    },
    {
      label: 'Guest',
      content: (
        <div className="space-y-16">
          <div className="grid md:grid-cols-2 gap-8 items-start justify-items-stretch">
            <div className="flex flex-col h-full">
              <GuestBook />
            </div>
            <div className="flex flex-col h-full">
              <WishCollection />
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Gift',
      content: (
        <div className="space-y-16">
          <GiftReveal onOpenGift={handleOpenGift} isOpen={giftOpened} />
        </div>
      )
    }
  ];

  // Find the current tab's content
  const currentTabContent = tabs.find(tab => tab.label === activeTab)?.content;

  return (
    <AnimatePresence mode="wait">
      {!showMainSite ? (
        <FullscreenCountdown 
          key="countdown"
          targetDate={birthdayDate}
          onCountdownComplete={handleCountdownComplete}
        />
      ) : (
        <motion.div
          key="main-site"
          className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <FloatingHearts />
          <MusicPlayer />
          <BirthdayCountdown />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="container mx-auto px-4 py-8"
          >
            {/* Standalone TabBar at the top */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8"
            >
              <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            </motion.div>

            {/* Tab Content */}
            <motion.main 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {currentTabContent}
            </motion.main>
            
            <Footer />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;