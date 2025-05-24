import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Coffee, Book, Music, Camera, Palette, Flower, Star } from 'lucide-react';

interface FavoriteThing {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  color: string;
  reason: string;
}

const favoriteThings: FavoriteThing[] = [
  {
    id: 1,
    category: "Drink",
    title: "Morning Drink",
    description: "Your perfect cappuccino with extra foam",
    image: "/Sarah/img/photo_5_2025-05-24_00-29-17.jpg",
    icon: <Coffee className="w-6 h-6" />,
    color: "from-amber-400 to-orange-500",
    reason: "The way you close your eyes and smile with that first sip every morning"
  },
  {
    id: 2,
    category: "Hobby",
    title: "Reading",
    description: "Lost in fantasy novels and poetry",
    image: "/Sarah/img/photo_1_2025-05-24_00-29-17.jpg",
    icon: <Book className="w-6 h-6" />,
    color: "from-blue-400 to-indigo-500",
    reason: "I love watching you get completely absorbed in your books"
  },
  {
    id: 3,
    category: "Music",
    title: "Indie Folk",
    description: "Acoustic melodies and heartfelt lyrics",
    image: "/Sarah/img/photo_1_2025-05-24_00-38-10.jpg",
    icon: <Music className="w-6 h-6" />,
    color: "from-purple-400 to-pink-500",
    reason: "Your taste in music always introduces me to beautiful new songs"
  },
  {
    id: 4,
    category: "Activity",
    title: "Photography",
    description: "Capturing moments and beautiful landscapes",
    image: "/Sarah/img/photo_8_2025-05-20_17-15-33.jpg",
    icon: <Camera className="w-6 h-6" />,
    color: "from-green-400 to-teal-500",
    reason: "You see beauty in everything through your camera lens"
  },
  {
    id: 5,
    category: "Art",
    title: "Watercolor Painting",
    description: "Creating dreamy, flowing artwork",
    image: "/Sarah/img/photo_2_2025-05-24_00-38-10.jpg",
    icon: <Palette className="w-6 h-6" />,
    color: "from-pink-400 to-rose-500",
    reason: "Your paintings are as beautiful and gentle as your soul"
  },
  {
    id: 6,
    category: "Nature",
    title: "Sunflowers",
    description: "Bright, cheerful, and always facing the sun",
    image: "/Sarah/img/photo_4_2025-05-24_00-29-17.jpg",
    icon: <Flower className="w-6 h-6" />,
    color: "from-yellow-400 to-orange-400",
    reason: "They remind me of you - always bright and bringing joy to everyone"
  },
  {
    id: 7,
    category: "Food",
    title: "Fun meal Games",
    description: "Made from scratch with love",
    image: "/Sarah/img/photo_2_2025-05-24_00-29-17.jpg",
    icon: <Heart className="w-6 h-6" />,
    color: "from-red-400 to-pink-400",
    reason: "Every time you cook, you put so much love into it"
  },
  {
    id: 8,
    category: "Time",
    title: "Stargazing",
    description: "Quiet nights under the infinite sky",
    image: "/Sarah/img/photo_6_2025-05-24_00-29-17.jpg",
    icon: <Star className="w-6 h-6" />,
    color: "from-indigo-400 to-purple-500",
    reason: "Those peaceful moments when it's just us and the universe"
  }
];

const FavoriteThings: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<FavoriteThing | null>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif text-center mb-4 text-purple-800"
        >
          /Sarah's Favorite Things
        </motion.h2>
        <p className="text-center text-gray-600 mb-12">
          All the little things that make you uniquely wonderful
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteThings.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedItem(item)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-white">
                <div className="relative h-48">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                  
                  {/* Icon overlay */}
                  <div className="absolute top-4 right-4">
                    <div className={`bg-gradient-to-r ${item.color} text-white p-2 rounded-full shadow-lg`}>
                      {item.icon}
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-serif font-semibold text-lg text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>

                {/* Hover effect heart */}
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <Heart className="w-12 h-12 text-white fill-pink-500 drop-shadow-lg" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl overflow-hidden max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-64">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${selectedItem.color} opacity-30`} />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className={`bg-gradient-to-r ${selectedItem.color} text-white p-3 rounded-full w-fit mb-3`}>
                      {selectedItem.icon}
                    </div>
                    <h3 className="text-white text-2xl font-serif font-bold mb-1">
                      {selectedItem.title}
                    </h3>
                    <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                      {selectedItem.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span className="font-semibold text-gray-800">Why I love this about you:</span>
                    </div>
                    <p className="text-gray-700 italic">{selectedItem.reason}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FavoriteThings;