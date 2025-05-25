import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Calendar } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  description: string;
  date: string;
  coordinates: { x: number; y: number };
  image?: string;
}

const locations: Location[] = [
  {
    id: 1,
    name: "Where We Met",
    description: "I remember we had a conversation on TikTok about a trend.",
    date: "2023-07-26",
    coordinates: { x: 25, y: 35 },
    image: "/Sarah/img/tiktok-phone.jpg"
  },
  {
    id: 2,
    name: "First Date",
    description: "How about an Italian restaurant where we talked till closing time?",
    date: "2026-03-14",
    coordinates: { x: 45, y: 55 },
    image: "/Sarah/img/valentine.jpg"
  },
  {
    id: 3,
    name: "Weekend Getaway",
    description: "Our first weekend trip together – the beach house of memories.",
    date: "2027-05-20",
    coordinates: { x: 75, y: 25 },
    image: "/Sarah/img/bed-beach.jpg"
  },
  {
    id: 4,
    name: "Concert Night",
    description: "We danced under the stars at an outdoor concert.",
    date: "2027-05-15",
    coordinates: { x: 60, y: 75 },
    image: "/Sarah/img/back-view-crowd-fans-watching-live-performance-music-concert-night-copy-space.jpg"
  },
  {
    id: 5,
    name: "Home Sweet Home",
    description: "A place to call our own little paradise.",
    date: "2030-01-01",
    coordinates: { x: 40, y: 40 },
    image: "/Sarah/img/home.jpg"
  }
];

const InteractiveMap: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white rounded-2xl shadow-lg">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif text-center mb-4 text-purple-800"
        >
          Our Journey Together
        </motion.h2>
        <p className="text-center text-gray-600 mb-12">
          Click on the pins to explore the places that hold our memories
        </p>

        <div className="relative max-w-4xl mx-auto">
          {/* Map Background */}
          <div className="relative w-full h-96 bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 rounded-2xl overflow-hidden shadow-inner">
            {/* Decorative Shapes */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full"></div>
              <div className="absolute top-20 right-20 w-16 h-16 bg-green-200 rounded-full"></div>
              <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-yellow-200 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-24 h-8 bg-pink-200 rounded-lg"></div>
            </div>

            {/* Pins */}
            {locations.map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, type: "spring", stiffness: 300 }}
                className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer"
                style={{
                  left: `${location.coordinates.x}%`,
                  top: `${location.coordinates.y}%`
                }}
                onClick={() => setSelectedLocation(location)}
                onMouseEnter={() => setHoveredLocation(location.id)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative ${hoveredLocation === location.id ? 'z-20' : 'z-10'}`}
                >
                  <MapPin 
                    className={`w-8 h-8 transition-colors duration-200 ${
                      hoveredLocation === location.id ? 'text-pink-500' : 'text-purple-500'
                    }`}
                    fill="currentColor"
                  />

                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredLocation === location.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white px-3 py-2 rounded-lg shadow-lg border whitespace-nowrap"
                      >
                        <div className="text-sm font-semibold text-gray-800">
                          {location.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(location.date).toLocaleDateString()}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedLocation(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Image */}
                {selectedLocation.image && (
                  <img 
                    src={selectedLocation.image} 
                    alt={selectedLocation.name} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="text-center">
                  <MapPin className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                  <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                    {selectedLocation.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-purple-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedLocation.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedLocation.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InteractiveMap;
