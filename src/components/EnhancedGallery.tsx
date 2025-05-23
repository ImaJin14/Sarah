import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Heart, Calendar, MapPin } from 'lucide-react';

interface Photo {
  id: number;
  src: string;
  alt: string;
  caption: string;
  date: string;
  location: string;
  memory: string;
}

const photos: Photo[] = [
  {
    id: 1,
    src: "public/img/photo_2_2025-05-20_17-15-33.jpg",
    alt: "Sarah smiling",
    caption: "Your beautiful smile that lights up my world",
    date: "2023-06-15",
    location: "Central Park",
    memory: "This was the day you wore that yellow dress and we spent hours just talking under the trees."
  },
  {
    id: 2,
    src: "public/img/photo_2_2025-05-20_17-15-33.jpg",
    alt: "Us together",
    caption: "Our first adventure together",
    date: "2023-03-20",
    location: "Mountain Trail",
    memory: "Remember how we got lost but you said it was the best kind of lost because we were together?"
  },
  {
    id: 3,
    src: "public/img/photo_2_2025-05-20_17-15-33.jpg",
    alt: "Sarah laughing",
    caption: "That contagious laugh of yours",
    date: "2023-08-10",
    location: "Beach House",
    memory: "You were laughing at my terrible joke about seashells, but your laugh made it the funniest thing ever."
  },
  {
    id: 4,
    src: "public/img/photo_2_2025-05-20_17-15-33.jpg",
    alt: "Sunset moment",
    caption: "Watching the sunset in your eyes",
    date: "2023-09-22",
    location: "Rooftop Terrace",
    memory: "We stayed up there until the stars came out, and you said you'd never felt more at peace."
  },
  {
    id: 5,
    src: "public/img/photo_2_2025-05-20_17-15-33.jpg",
    alt: "Sarah cooking",
    caption: "Chef Sarah in action",
    date: "2023-11-05",
    location: "Our Kitchen",
    memory: "You were making pasta from scratch and got flour everywhere, including on my nose when you kissed me."
  },
  {
    id: 6,
    src: "public/img/photo_2_2025-05-20_17-15-33.jpg",
    alt: "Winter walk",
    caption: "Winter wonderland with you",
    date: "2023-12-18",
    location: "Snowy Park",
    memory: "Our first snowball fight - you won, of course, but I got the best prize when you helped me up."
  }
];

const EnhancedGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    const nextIndex = (currentIndex + 1) % photos.length;
    setCurrentIndex(nextIndex);
    setSelectedPhoto(photos[nextIndex]);
  };

  const prevPhoto = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setCurrentIndex(prevIndex);
    setSelectedPhoto(photos[prevIndex]);
  };

  return (
    <section className="py-16">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-serif text-center mb-4 text-purple-800"
      >
        Our Beautiful Memories
      </motion.h2>
      <p className="text-center text-gray-600 mb-12">
        Each photo tells a story of our love
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => openLightbox(photo, index)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-semibold text-lg mb-1">{photo.caption}</h3>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(photo.date).toLocaleDateString()}</span>
                    <MapPin className="w-3 h-3 ml-2" />
                    <span>{photo.location}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Heart className="w-6 h-6 text-white fill-pink-500" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation arrows */}
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              <div className="bg-white rounded-2xl overflow-hidden">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt}
                  className="w-full h-96 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                    {selectedPhoto.caption}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedPhoto.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedPhoto.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    {selectedPhoto.memory}
                  </p>
                </div>
              </div>

              {/* Photo counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {currentIndex + 1} of {photos.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EnhancedGallery;