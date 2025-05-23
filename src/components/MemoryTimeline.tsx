import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Heart } from 'lucide-react';

interface Memory {
  id: number;
  date: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
}

const memories: Memory[] = [
  {
    id: 1,
    date: "2020-02-14",
    title: "First Valentine's Day",
    description: "Our first Valentine's Day together - you made everything magical.",
    location: "Downtown Restaurant",
    image: "/memories/valentine.jpg"
  },
  {
    id: 2,
    date: "2020-06-15",
    title: "Summer Adventure",
    description: "That amazing road trip where we got lost but found so much joy.",
    location: "Coastal Highway",
    image: "/memories/roadtrip.jpg"
  },
  {
    id: 3,
    date: "2021-01-01",
    title: "New Year, New Us",
    description: "Starting the year together, making resolutions we actually kept.",
    location: "Home",
    image: "/memories/newyear.jpg"
  },
  // Add more memories here
];

const MemoryTimeline: React.FC = () => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  return (
    <section className="py-16 bg-white rounded-2xl shadow-lg">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif text-center mb-12 text-purple-800"
        >
          Our Memory Timeline
        </motion.h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-300 to-purple-300"></div>
          
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex items-center mb-8 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg shadow-md cursor-pointer"
                  onClick={() => setSelectedMemory(memory)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-600 font-medium">
                      {new Date(memory.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
                    {memory.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{memory.description}</p>
                  {memory.location && (
                    <div className="flex items-center gap-1 mt-2">
                      <MapPin className="w-3 h-3 text-pink-500" />
                      <span className="text-xs text-pink-500">{memory.location}</span>
                    </div>
                  )}
                </motion.div>
              </div>
              
              {/* Timeline dot */}
              <div className="relative z-10">
                <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full border-4 border-white shadow-lg"></div>
              </div>
              
              <div className="w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Heart className="w-8 h-8 text-pink-500 mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
                  {selectedMemory.title}
                </h3>
                <p className="text-purple-600 mb-4">
                  {new Date(selectedMemory.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-4">{selectedMemory.description}</p>
                {selectedMemory.location && (
                  <div className="flex items-center justify-center gap-2 text-pink-500">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedMemory.location}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MemoryTimeline;