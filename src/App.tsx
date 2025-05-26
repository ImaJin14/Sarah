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
import { motion, AnimatePresence } from 'framer-motion';

import { db } from './main';           // Your firebase config file
import { doc, getDoc } from 'firebase/firestore';

function PasswordProtectFirestore({
  title,
  hint,
  children
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'settings', 'bucketList');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const storedPassword = docSnap.data().password;
        if (password === storedPassword) {
          setIsAuthorized(true);
        } else {
          alert('Incorrect password');
        }
      } else {
        alert('Password config not found.');
      }
    } catch (error) {
      console.error('Error checking password:', error);
      alert('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 bg-pink-50 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="mb-6 italic text-gray-600">{hint}</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        className="p-2 border border-gray-300 rounded w-full max-w-xs"
        disabled={loading}
      />
      <button
        onClick={handlePasswordSubmit}
        className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Unlock'}
      </button>
    </div>
  );
}

function App() {
  const [giftOpened, setGiftOpened] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [showMainSite, setShowMainSite] = useState(false); // Set to false for countdown

  // Set Sarah's birthday date (YYYY-MM-DD format)
  const birthdayDate = '2025-05-27'; // Sarah's birthday

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
        <PasswordProtectFirestore
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
        </PasswordProtectFirestore>
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
