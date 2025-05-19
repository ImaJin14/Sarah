import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X } from 'lucide-react';

interface GiftRevealProps {
  onOpenGift: () => void;
  isOpen: boolean;
}

const GiftReveal: React.FC<GiftRevealProps> = ({ onOpenGift, isOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenGift = () => {
    onOpenGift();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="py-16" id="gift">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-purple-800 mb-6">
          Your Special Gift
        </h2>
        
        <p className="text-lg text-gray-700 mb-8">
          I've prepared something special just for you. Click below to reveal your birthday surprise.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenGift}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg flex items-center justify-center mx-auto"
        >
          <Gift className="mr-2 h-6 w-6" />
          Open Your Gift
        </motion.button>
      </motion.div>
      
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="text-center py-4">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-purple-800 mb-6">
                  My Gift to You
                </h3>
                
                {/* Replace this with your actual gift content */}
                <div className="mb-6">
                  <div className="w-full h-64 mb-6 bg-pink-100 rounded-lg flex items-center justify-center">
                    {/* This is a placeholder for your actual gift (e.g., a video, image, poem, etc.) */}
                    <p className="text-purple-600 font-medium px-8">
                      This could be a video message, a digital gift card, a special poem, or any other surprise you want to include.
                    </p>
                  </div>
                  
                  <p className="text-lg text-gray-700">
                    This is just the beginning of a day full of surprises. I have more planned for you, my love. Check your phone for the next clue!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GiftReveal;