import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, User } from 'lucide-react';
import { db } from '../main';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  DocumentData
} from 'firebase/firestore';

interface Wish {
  id: string;
  name: string;
  message: string;
  timestamp: Date;
}

const WishCollection: React.FC = () => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState({ name: '', message: '' });
  const [showForm, setShowForm] = useState(false);

  // Fetch wishes from Firestore
  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishesData: Wish[] = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          name: data.name,
          message: data.message,
          timestamp: data.timestamp?.toDate() ?? new Date(),
        };
      });
      setWishes(wishesData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (newWish.name.trim() && newWish.message.trim()) {
        addDoc(collection(db, 'wishes'), {
          name: newWish.name.trim(),
          message: newWish.message.trim(),
          timestamp: serverTimestamp(),
        });
        setNewWish({ name: '', message: '' });
        setShowForm(false);
      }
    },
    [newWish]
  );

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

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={newWish.name}
                    onChange={(e) =>
                      setNewWish({ ...newWish, name: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewWish({ ...newWish, message: e.target.value })
                    }
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

        {wishes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishes.map((wish) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {wish.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {wish.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{wish.message}"</p>
              </motion.div>
            ))}
          </div>
        ) : (
          !showForm && (
            <div className="text-center text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No wishes yet. Be the first to leave a birthday message!</p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default WishCollection;
