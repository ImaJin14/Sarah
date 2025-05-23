import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, User } from 'lucide-react';

interface Wish {
  id: number;
  name: string;
  message: string;
  timestamp: Date;
}

const WishCollection: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState({ name: '', message: '' });
  const [showForm, setShowForm] = useState(false);

  // Load wishes from localStorage on component mount
  useEffect(() => {
    const savedWishes = localStorage.getItem('birthday-wishes');
    if (savedWishes) {
      const parsedWishes = JSON.parse(savedWishes).map((wish: any) => ({
        ...wish,
        timestamp: new Date(wish.timestamp)
      }));
      setWishes(parsedWishes);
    }
  }, []);

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWish.name.trim() && newWish.message.trim()) {
      const wish: Wish = {
        id: Date.now(),
        name: newWish.name.trim(),
        message: newWish.message.trim(),
        timestamp: new Date()
      };
      
      const updatedWishes = [wish, ...wishes];
      setWishes(updatedWishes);
      localStorage.setItem('birthday-wishes', JSON.stringify(updatedWishes));
      
      setNewWish({ name: '', message: '' });
      setShowForm(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif text-purple-800 mb-4">
            Birthday Wishes for Sarah
          </h2>
          <p className="text-gray-600 mb-8">
            Leave a special message for Sarah's birthday!
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            <Heart className="w-5 h-5 inline mr-2" />
            Add Your Wish
          </motion.button>
        </motion.div>

        {/* Wish Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <form onSubmit={handleSubmitWish} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={newWish.name}
                    onChange={(e) => setNewWish({ ...newWish, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Birthday Message
                  </label>
                  <textarea
                    value={newWish.message}
                    onChange={(e) => setNewWish({ ...newWish, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 h-24 resize-none"
                    placeholder="Write your birthday wish for Sarah..."
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-shadow"
                  >
                    <Send className="w-4 h-4 inline mr-2" />
                    Send Wish
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishes Display */}
        {wishes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{wish.name}</h4>
                    <p className="text-xs text-gray-500">
                      {wish.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{wish.message}"</p>
              </motion.div>
            ))}
          </div>
        )}

        {wishes.length === 0 && !showForm && (
          <div className="text-center text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No wishes yet. Be the first to leave a birthday message!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WishCollection;