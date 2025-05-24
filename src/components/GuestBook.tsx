import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Send, User } from 'lucide-react';

import { db } from '../main';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';

interface GuestMessage {
  id: string;
  name: string;
  message: string;
  timestamp: Date;
}

const GuestBook: React.FC = () => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [newMessage, setNewMessage] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const messagesCollection = collection(db as Firestore, 'guestbook_messages');
    const q = query(messagesCollection, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id, // Explicitly include the document ID
        name: doc.data().name,
        message: doc.data().message,
        timestamp: doc.data().timestamp?.toDate() // Convert Firestore Timestamp to Date
      })) as GuestMessage[];
      setMessages(messagesData);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Remove localStorage remnants if any
    localStorage.removeItem('sarahBirthdayMessages');

    if (!newMessage.name.trim() || !newMessage.message.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Create new message
    const messageData = {
      name: newMessage.name.trim(),
      message: newMessage.message.trim(),
      // Use serverTimestamp() for a reliable timestamp
      timestamp: serverTimestamp()
    };

    const messagesCollection = collection(db as Firestore, 'guestbook_messages');
    await addDoc(messagesCollection, messageData);
    
    // Reset form
    setNewMessage({ name: '', message: '' });
    setIsSubmitting(false);
    setShowForm(false);

    // Show success feedback
    setTimeout(() => {
      // Could add a toast notification here
    }, 500);
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return 'Invalid Date'; // Handle cases where timestamp is not a valid Date object
    }

     return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <section className="py-16" id="guestbook">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          {/* <MessageCircle className="h-12 w-12 mx-auto text-purple-600 mb-4" /> */}
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-purple-800 mb-4">
            Birthday Guest Book
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Leave a special birthday message for Sarah! Your words will make her day even more memorable.
          </p>
        </div>

        {/* Sign Button */}
        <div className="text-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg inline-flex items-center"
          >
            <Heart className="mr-2 h-5 w-5" />
            {showForm ? 'Cancel' : 'Sign the Guest Book'}
          </motion.button>
        </div>

        {/* Message Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-pink-200 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={newMessage.name}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your name"
                      required
                      maxLength={50}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Birthday Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={newMessage.message}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Write your birthday message for Sarah..."
                      required
                      maxLength={500}
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {newMessage.message.length}/500
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !newMessage.name.trim() || !newMessage.message.trim()}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="mr-2 h-5 w-5" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Display */}
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                Be the first to sign Sarah's birthday guest book!
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-serif font-semibold text-purple-800">
                  Birthday Messages ({messages.length})
                </h3>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-6 rounded-xl shadow-md border border-pink-100 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 truncate">
                              {message.name}
                            </h4>
                            <span className="text-sm text-gray-500 flex-shrink-0">
                              {formatDate(message.timestamp)}
                           </span>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed">
                            {message.message}
                          </p>
                          
                          <div className="mt-3 flex items-center text-pink-500">
                            <Heart className="h-4 w-4 mr-1" fill="currentColor" />
                            <span className="text-sm">Birthday wishes</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Clear Messages Button (for testing/admin) */}
        {/* {messages.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
                  // Implement logic to clear messages from Firestore if needed (carefully!)
                }
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all messages
            </button>
          </div>
        )} */}
      </motion.div>
    </section>
  );
};

export default GuestBook;