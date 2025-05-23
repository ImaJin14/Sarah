import React, { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SocialSharing: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const currentUrl = window.location.href;
  const shareText = "Check out this beautiful birthday celebration! 🎂💕";
  
  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Copy,
      action: async () => {
        try {
          await navigator.clipboard.writeText(currentUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
      }
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
      }
    }
  ];
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Happy Birthday Sarah!',
          text: shareText,
          url: currentUrl
        });
      } catch (err) {
        console.error('Native sharing failed:', err);
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNativeShare}
        className="bg-white/90 backdrop-blur-sm text-purple-600 p-3 rounded-full shadow-lg hover:bg-white transition-colors"
        aria-label="Share this page"
      >
        <Share2 className="h-5 w-5" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute top-16 right-0 bg-white rounded-xl shadow-xl p-4 min-w-[200px]"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Share</h3>
            <div className="space-y-2">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action();
                    if (option.name !== 'Copy Link') {
                      setIsOpen(false);
                    }
                  }}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  {option.name === 'Copy Link' && copied ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <option.icon className="h-5 w-5 text-gray-600" />
                  )}
                  <span className={`${copied && option.name === 'Copy Link' ? 'text-green-600' : 'text-gray-700'}`}>
                    {option.name === 'Copy Link' && copied ? 'Copied!' : option.name}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialSharing;