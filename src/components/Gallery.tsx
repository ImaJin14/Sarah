import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
  url: string;
  caption: string;
}

const Gallery = () => {
  // Sample images - replace with your own
  const images: Image[] = [
    {
      url: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      caption: "The day we first met"
    },
    {
      url: "https://images.pexels.com/photos/3331094/pexels-photo-3331094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      caption: "Our first vacation together"
    },
    {
      url: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      caption: "That sunset we'll never forget"
    },
    {
      url: "https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      caption: "Our favorite coffee shop"
    },
    {
      url: "https://images.pexels.com/photos/1024969/pexels-photo-1024969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      caption: "The day I knew you were the one"
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

  // Auto slide functionality
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [current, isAutoPlaying]);

  // Pause autoplay when user interacts with the gallery
  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    // Resume autoplay after 15 seconds of inactivity
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
        Our Memories Together
      </motion.h2>
      
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px] max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img 
              src={images[current].url} 
              alt={images[current].caption} 
              className="w-full h-full object-cover" 
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