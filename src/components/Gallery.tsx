import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
  url: string;
  caption: string;
}

const Gallery = () => {
  const images: Image[] = [
    {
      url: "/img/photo_2_2025-05-20_17-15-33.jpg",
      caption: "The day we first met – where every chapter of grace began. ❤️"
    },
    {
      url: "/img/photo_2025-05-20_17-44-39.jpg",
      caption: "“For I know the plans I have for you...” – Jeremiah 29:11 🌸"
    },
    {
      url: "/img/photo_3_2025-05-20_17-15-33.jpg",
      caption: "“To everything there is a season...” – Ecclesiastes 3:1 🍂"
    },
    {
      url: "/img/photo_4_2025-05-20_17-15-33.jpg",
      caption: "In the wilderness, He carried you – Deuteronomy 1:31 💫"
    },
    {
      url: "/img/photo_5_2025-05-20_17-15-33.jpg",
      caption: "“My grace is sufficient for thee...” – 2 Corinthians 12:9 🙏"
    },
    {
      url: "/img/photo_6_2025-05-20_17-15-33.jpg",
      caption: "“Sit still, my daughter, until you see how the matter will turn out.” – Ruth 3:18 🌾"
    },
    {
      url: "/img/photo_7_2025-05-20_17-15-33.jpg",
      caption: "“I will ascend... I will exalt...” – Isaiah 14:13 🌠 (A reminder of the power of humility)"
    },
    {
      url: "/img/photo_9_2025-05-20_17-15-33.jpg",
      caption: "Your joy is a light that even time respects ✨"
    },
    {
      url: "/img/photo_10_2025-05-20_17-15-33.jpg",
      caption: "If grace had a face, it would look a lot like you 💖"
    },
    {
      url: "/img/photo_11_2025-05-20_17-15-33.jpg",
      caption: "Heaven whispers through your smile – Happy Birthday, Sarah 🎂👑"
    }
  ];

  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [current, isAutoPlaying]);

  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  return (
    <section className="py-8" id="gallery">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-serif font-bold text-purple-800 text-center mb-8"
      >
        Birthday Blessings for Sarah 💜
      </motion.h2>
      
      <div className="relative h-[600px] w-[400px] md:h-[700px] md:w-[500px] mx-auto rounded-xl overflow-hidden shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img 
             src ={images[current].url} 
              alt={images[current].caption} 
              className="w-full h-full object-cover"
              loading="lazy" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-white text-lg md:text-xl font-medium">
                {images[current].caption}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 p-2 rounded-full backdrop-blur-sm text-white transition duration-300"
          onClick={() => { prevSlide(); handleUserInteraction(); }}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 p-2 rounded-full backdrop-blur-sm text-white transition duration-300"
          onClick={() => { nextSlide(); handleUserInteraction(); }}
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${current === index ? 'bg-white w-4' : 'bg-white/50'}`}
              onClick={() => { setCurrent(index); handleUserInteraction(); }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;