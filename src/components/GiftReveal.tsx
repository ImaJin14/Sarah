import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X } from 'lucide-react';
import GlobalAudioManager from './AudioManager';

interface GiftRevealProps {
  onOpenGift: () => void;
}

const GiftReveal: React.FC<GiftRevealProps> = ({ onOpenGift }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioManager = GlobalAudioManager.getInstance();

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (isModalOpen) {
        audioManager.unregisterPlayer('gift-video');
      }
    };
  }, [isModalOpen, audioManager]);

  const handleOpenGift = () => {
    onOpenGift();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (videoRef.current) {
      audioManager.unregisterPlayer('gift-video');
    }
    setIsModalOpen(false);
  };

  const pauseGiftVideo = () => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  };

  const handleVideoPlay = () => {
    if (videoRef.current) {
      // Register with audio manager when video starts playing
      audioManager.registerPlayer(
        'gift-video',
        pauseGiftVideo,
        videoRef.current
      );
    }
  };

  const handleVideoPause = () => {
    // Could optionally unregister here, but keeping it registered
    // allows the manager to pause this video if another player starts
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
          I've prepared something special just for you. Hope you like it!
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

                <div className="mb-6">
                  <div className="w-full h-64 mb-6 bg-pink-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover rounded-lg"
                      controls
                      autoPlay
                      onPlay={handleVideoPlay}
                      onPause={handleVideoPause}
                    >
                      <source src="/Sarah/gift.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>  
                  <p className="text-lg italic text-black-600 dark:text-black-300">
                    This is but a moment in the beautiful cycle God has designed, where every season has its purpose, every sunrise holds a promise. Like the lilies of the field and the turning of the leaves, your life blooms in divine rhythm. What comes next is a whisper from heaven... sacred and unfolding.
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


// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Gift, X, Heart, Coffee, Star, Smartphone, Upload, Check } from 'lucide-react';

// interface GiftOption {
//   id: string;
//   name: string;
//   suggestedAmount: number;
//   icon: React.ReactNode;
//   description: string;
// }

// interface GiftRevealProps {
//   onOpenGift: () => void;
// }

// const GiftReveal: React.FC<GiftRevealProps> = ({ onOpenGift }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showGiftOptions, setShowGiftOptions] = useState(false);
//   const [showPaymentDetails, setShowPaymentDetails] = useState(false);
//   const [showUploadForm, setShowUploadForm] = useState(false);
//   const [selectedGift, setSelectedGift] = useState<GiftOption | null>(null);
//   const [customAmount, setCustomAmount] = useState('');
//   const [userName, setUserName] = useState('');
//   const [screenshot, setScreenshot] = useState<File | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // Airtel Money number for receiving payments
//   const AIRTEL_MONEY_NUMBER = "0977123456"; // Replace with actual number

//   const giftOptions: GiftOption[] = [
//     {
//       id: 'coffee',
//       name: 'Buy me a coffee',
//       suggestedAmount: 25, // ZMW
//       icon: <Coffee className="h-6 w-6" />,
//       description: 'A small token of appreciation'
//     },
//     {
//       id: 'support',
//       name: 'Show support',
//       suggestedAmount: 50, // ZMW
//       icon: <Heart className="h-6 w-6" />,
//       description: 'Help with my goals'
//     },
//     {
//       id: 'generous',
//       name: 'Be generous',
//       suggestedAmount: 100, // ZMW
//       icon: <Star className="h-6 w-6" />,
//       description: 'Make a meaningful impact'
//     },
//     {
//       id: 'custom',
//       name: 'Custom amount',
//       suggestedAmount: 0,
//       icon: <Gift className="h-6 w-6" />,
//       description: 'Choose your own amount'
//     }
//   ];

//   const handleOpenGift = () => {
//     onOpenGift();
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setShowGiftOptions(false);
//     setShowPaymentDetails(false);
//     setShowUploadForm(false);
//     setSelectedGift(null);
//     setCustomAmount('');
//     setUserName('');
//     setScreenshot(null);
//     setIsProcessing(false);
//     setIsSubmitted(false);
//   };

//   const handleSelectGift = (gift: GiftOption) => {
//     setSelectedGift(gift);
//     if (gift.id === 'custom') {
//       setCustomAmount('');
//     } else {
//       setCustomAmount(gift.suggestedAmount.toString());
//     }
//     setShowPaymentDetails(true);
//   };

//   const getGiftAmount = () => {
//     return customAmount ? parseInt(customAmount) : selectedGift?.suggestedAmount || 0;
//   };

//   const proceedToPayment = () => {
//     const amount = getGiftAmount();
//     if (!selectedGift || !amount || amount < 1) {
//       alert('Please enter a valid amount (minimum K1)');
//       return;
//     }
//     setShowUploadForm(true);
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Check file type
//       if (!file.type.startsWith('image/')) {
//         alert('Please upload an image file');
//         return;
//       }
//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         alert('File size must be less than 5MB');
//         return;
//       }
//       setScreenshot(file);
//     }
//   };

//   const submitPaymentProof = async () => {
//     if (!userName.trim()) {
//       alert('Please enter your name');
//       return;
//     }
//     if (!screenshot) {
//       alert('Please upload a payment screenshot');
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       // Here you would upload to your backend
//       const formData = new FormData();
//       formData.append('screenshot', screenshot);
//       formData.append('userName', userName);
//       formData.append('giftType', selectedGift?.name || '');
//       formData.append('amount', getGiftAmount().toString());
//       formData.append('timestamp', new Date().toISOString());

//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       // In real implementation:
//       // const response = await fetch('/api/submit-payment-proof', {
//       //   method: 'POST',
//       //   body: formData
//       // });

//       setIsProcessing(false);
//       setIsSubmitted(true);

//       setTimeout(() => {
//         closeModal();
//       }, 3000);

//     } catch (error) {
//       setIsProcessing(false);
//       alert('Failed to submit payment proof. Please try again.');
//     }
//   };

//   return (
//     <section className="py-16" id="gift">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         whileInView={{ opacity: 1, scale: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8 }}
//         className="max-w-md mx-auto text-center"
//       >
//         <h2 className="text-3xl md:text-4xl font-serif font-bold text-purple-800 mb-6">
//           Your Special Gift
//         </h2>
        
//         <p className="text-lg text-gray-700 mb-8">
//           I've prepared something special just for you. Hope you like it!
//         </p>
        
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={handleOpenGift}
//           className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg flex items-center justify-center mx-auto"
//         >
//           <Gift className="mr-2 h-6 w-6" />
//           Open Your Gift
//         </motion.button>
//       </motion.div>
      
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
//             onClick={closeModal}
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ type: "spring", damping: 20 }}
//               className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 onClick={closeModal}
//                 className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
//                 aria-label="Close modal"
//               >
//                 <X className="h-6 w-6" />
//               </button>
              
//               <div className="text-center py-4">
//                 <h3 className="text-2xl md:text-3xl font-serif font-bold text-purple-800 mb-6">
//                   My Gift to You
//                 </h3>

//                 {!showGiftOptions && !showPaymentDetails && !showUploadForm && (
//                   <>
//                     <div className="mb-6">
//                       <div className="w-full h-64 mb-6 bg-pink-100 rounded-lg flex items-center justify-center overflow-hidden">
//                         <video
//                           className="w-full h-full object-cover rounded-lg"
//                           controls
//                           autoPlay>
//                           <source src="/Sarah/video_2025-05-20_18-00-20.mp4" type="video/mp4" />
//                           Your browser does not support the video tag.
//                         </video>
//                       </div>  
//                       <p className="text-lg italic text-black-600 dark:text-black-300 mb-6">
//                         This is but a moment in the beautiful cycle God has designed, where every season has its purpose, every sunrise holds a promise. Like the lilies of the field and the turning of the leaves, your life blooms in divine rhythm. What comes next is a whisper from heaven... sacred and unfolding.
//                       </p>
//                     </div>

//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setShowGiftOptions(true)}
//                       className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center justify-center mx-auto"
//                     >
//                       <Smartphone className="mr-2 h-5 w-5" />
//                       Send via Airtel Money
//                     </motion.button>
//                   </>
//                 )}

//                 {showGiftOptions && !showPaymentDetails && !showUploadForm && (
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-center mb-4">
//                       <div className="bg-red-100 p-3 rounded-full mr-3">
//                         <Smartphone className="h-8 w-8 text-red-600" />
//                       </div>
//                       <h4 className="text-xl font-bold text-gray-800">
//                         Choose Your Gift
//                       </h4>
//                     </div>
                    
//                     {giftOptions.map((gift) => (
//                       <motion.button
//                         key={gift.id}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => handleSelectGift(gift)}
//                         className="w-full p-4 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all duration-200 flex items-center justify-between"
//                       >
//                         <div className="flex items-center">
//                           <div className="text-red-500 mr-3">
//                             {gift.icon}
//                           </div>
//                           <div className="text-left">
//                             <div className="font-bold text-gray-800">
//                               {gift.name}
//                             </div>
//                             <div className="text-sm text-gray-600">
//                               {gift.description}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-xl font-bold text-red-600">
//                           {gift.id === 'custom' ? '?' : `K${gift.suggestedAmount}`}
//                         </div>
//                       </motion.button>
//                     ))}
                    
//                     <button
//                       onClick={() => setShowGiftOptions(false)}
//                       className="text-gray-500 hover:text-gray-700 mt-4"
//                     >
//                       ← Back to gift
//                     </button>
//                   </div>
//                 )}

//                 {showPaymentDetails && !showUploadForm && selectedGift && (
//                   <div className="space-y-6">
//                     <div className="text-center">
//                       <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
//                         <Smartphone className="h-12 w-12 text-red-600" />
//                       </div>
//                       <h4 className="text-xl font-bold text-gray-800 mb-2">
//                         {selectedGift.name}
//                       </h4>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Enter Amount (K)
//                         </label>
//                         <input
//                           type="number"
//                           min="1"
//                           value={customAmount}
//                           onChange={(e) => setCustomAmount(e.target.value)}
//                           placeholder={selectedGift.id === 'custom' ? 'Enter amount' : selectedGift.suggestedAmount.toString()}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-xl font-bold"
//                         />
//                       </div>
//                     </div>

//                     <div className="bg-red-50 p-4 rounded-lg text-left">
//                       <h5 className="font-bold text-red-800 mb-2">Payment Instructions:</h5>
//                       <div className="text-sm text-red-700 space-y-1">
//                         <p>1. Dial *115# on your Airtel phone</p>
//                         <p>2. Select "Send Money"</p>
//                         <p>3. Enter: <strong>{AIRTEL_MONEY_NUMBER}</strong></p>
//                         <p>4. Amount: <strong>K{getGiftAmount()}</strong></p>
//                         <p>5. Enter your PIN to confirm</p>
//                       </div>
//                       <div className="mt-3 p-2 bg-white rounded border-l-4 border-red-500">
//                         <p className="text-sm font-mono text-gray-800">
//                           Quick dial: *115*{AIRTEL_MONEY_NUMBER}*{getGiftAmount()}#
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setShowPaymentDetails(false)}
//                         className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                       >
//                         Back
//                       </button>
//                       <button
//                         onClick={proceedToPayment}
//                         className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                       >
//                         I've Made Payment
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {showUploadForm && !isSubmitted && (
//                   <div className="space-y-6">
//                     <div className="text-center">
//                       <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
//                         <Upload className="h-12 w-12 text-green-600" />
//                       </div>
//                       <h4 className="text-xl font-bold text-gray-800 mb-2">
//                         Upload Payment Proof
//                       </h4>
//                       <p className="text-gray-600 mb-4">
//                         Gift: {selectedGift?.name} - K{getGiftAmount()}
//                       </p>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Your Name *
//                         </label>
//                         <input
//                           type="text"
//                           value={userName}
//                           onChange={(e) => setUserName(e.target.value)}
//                           placeholder="Enter your full name"
//                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Payment Screenshot *
//                         </label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleFileUpload}
//                             className="hidden"
//                             id="screenshot-upload"
//                           />
//                           <label
//                             htmlFor="screenshot-upload"
//                             className="cursor-pointer flex flex-col items-center"
//                           >
//                             <Upload className="h-12 w-12 text-gray-400 mb-2" />
//                             <span className="text-gray-600">
//                               {screenshot ? screenshot.name : 'Click to upload screenshot'}
//                             </span>
//                             <span className="text-xs text-gray-500 mt-1">
//                               PNG, JPG up to 5MB
//                             </span>
//                           </label>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setShowUploadForm(false)}
//                         className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                       >
//                         Back
//                       </button>
//                       <button
//                         onClick={submitPaymentProof}
//                         disabled={isProcessing || !userName.trim() || !screenshot}
//                         className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {isProcessing ? 'Submitting...' : 'Submit Proof'}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {isSubmitted && (
//                   <div className="text-center space-y-4">
//                     <div className="bg-green-100 p-6 rounded-full inline-block mb-4">
//                       <Check className="h-16 w-16 text-green-600" />
//                     </div>
//                     <h4 className="text-2xl font-bold text-green-800 mb-2">
//                       Thank You! 💖
//                     </h4>
//                     <p className="text-gray-600">
//                       Your payment proof has been submitted successfully. 
//                       I'll verify and acknowledge your gift soon!
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       This window will close automatically...
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// };

// export default GiftReveal;