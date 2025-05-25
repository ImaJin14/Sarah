import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Heart, MapPin, Camera, Plane, Plus } from 'lucide-react';
import { db } from '../main';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  Timestamp,
  getDoc,
} from 'firebase/firestore';

interface BucketListItem {
  id: string;
  title: string;
  description: string;
  category: 'travel' | 'experience' | 'milestone' | 'adventure';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  contentProtected?: boolean;
  timestamp?: Timestamp | null;
  createdAt?: Timestamp | null;
  completedAt?: Timestamp | null; // Added for completion date
}

const BucketList: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'travel' | 'experience' | 'milestone' | 'adventure'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [items, setItems] = useState<BucketListItem[]>([]);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'travel' | 'experience' | 'milestone' | 'adventure'>('experience');
  const [newItemPriority, setNewItemPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newItemContentProtected, setNewItemContentProtected] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Password modal states
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For revealing protected content
  const [contentToReveal, setContentToReveal] = useState<{ id: string; description: string } | null>(null);
  const [unlockedItems, setUnlockedItems] = useState<Set<string>>(new Set());

  // For status change protection
  const [itemToToggle, setItemToToggle] = useState<string | null>(null);

  const bucketListCollectionRef = collection(db, 'bucketList');
  const PASSWORD_DOC_PATH = doc(db, 'settings', 'bucketList');

  useEffect(() => {
    const q = query(bucketListCollectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bucketList: BucketListItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description,
        category: doc.data().category,
        completed: doc.data().completed,
        priority: doc.data().priority,
        contentProtected: doc.data().contentProtected || false,
        timestamp: doc.data().timestamp,
        createdAt: doc.data().createdAt || doc.data().timestamp,
        completedAt: doc.data().completedAt || null,
      }));
      setItems(bucketList);
    });
    return () => unsubscribe();
  }, []);

  // Get icon by category
  const getIconByCategory = (category: string) => {
    switch (category) {
      case 'travel': return <Plane className="h-5 w-5" />;
      case 'experience': return <Camera className="h-5 w-5" />;
      case 'milestone': return <MapPin className="h-5 w-5" />;
      case 'adventure': return <Heart className="h-5 w-5" />;
      default: return <Heart className="h-5 w-5" />;
    }
  };

  // Handle password submit for adding, content reveal, and status toggle
  const handleSubmitPassword = async () => {
    setIsSubmitting(true);
    try {
      const docSnap = await getDoc(PASSWORD_DOC_PATH);
      const storedPassword = docSnap.exists() ? docSnap.data().password : null;

      if (enteredPassword.trim() === storedPassword?.trim()) {
        if (contentToReveal) {
          // Password entered for revealing content
          setUnlockedItems(prev => new Set(prev).add(contentToReveal.id));
          setContentToReveal(null);
        } else if (itemToToggle) {
          // Password entered for toggling status
          await performStatusToggle(itemToToggle);
          setItemToToggle(null);
        } else {
          // Password entered for adding item
          await addDoc(bucketListCollectionRef, {
            title: newItemTitle,
            description: newItemDescription,
            category: newItemCategory,
            completed: false,
            priority: newItemPriority,
            contentProtected: newItemContentProtected,
            timestamp: serverTimestamp(),
            createdAt: serverTimestamp(),
          });
          resetForm();
        }
        setEnteredPassword('');
        setShowPasswordPrompt(false);
        setPasswordError('');
      } else {
        setPasswordError('Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying password or performing action:', error);
      setPasswordError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Perform the actual status toggle
  const performStatusToggle = async (itemId: string) => {
    const itemToUpdate = items.find((item) => item.id === itemId);
    if (itemToUpdate) {
      const docRef = doc(db, 'bucketList', itemToUpdate.id);
      const updateData: any = { 
        completed: !itemToUpdate.completed,
        timestamp: serverTimestamp() // Update timestamp for real-time sync
      };
      
      // Add completion timestamp if marking as completed
      if (!itemToUpdate.completed) {
        updateData.completedAt = serverTimestamp();
      } else {
        // Remove completion timestamp if marking as incomplete
        updateData.completedAt = null;
      }
      
      await updateDoc(docRef, updateData);
    }
  };

  const resetForm = () => {
    setNewItemTitle('');
    setNewItemDescription('');
    setNewItemCategory('experience');
    setNewItemPriority('medium');
    setNewItemContentProtected(false);
    setShowAddForm(false);
  };

  // When user clicks Add Item button, show password prompt (for confirming add)
  const handleAddButtonClick = () => {
    if (!newItemTitle.trim() || !newItemDescription.trim()) {
      return;
    }
    setContentToReveal(null);
    setItemToToggle(null);
    setShowPasswordPrompt(true);
    setPasswordError('');
  };

  // When user tries to reveal protected content
  const handleRevealContentClick = (item: BucketListItem) => {
    if (unlockedItems.has(item.id)) return;
    setContentToReveal({ id: item.id, description: item.description });
    setItemToToggle(null);
    setEnteredPassword('');
    setPasswordError('');
    setShowPasswordPrompt(true);
  };

  // When user tries to toggle completion status
  const handleToggleClick = (itemId: string) => {
    setItemToToggle(itemId);
    setContentToReveal(null);
    setEnteredPassword('');
    setPasswordError('');
    setShowPasswordPrompt(true);
  };

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPasswordPromptTitle = () => {
    if (contentToReveal) return 'Enter password to view content';
    if (itemToToggle) {
      const item = items.find(i => i.id === itemToToggle);
      return item?.completed 
        ? 'Enter password to mark as incomplete' 
        : 'Enter password to mark as complete';
    }
    return 'Enter password to add item';
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;

  const filteredItems = items.filter((item) => {
    if (filter !== 'all' && item.category !== filter) return false;
    if (!showCompleted && item.completed) return false;
    return true;
  });

  return (
    <section className="py-8 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl text-purple-800 font-bold text-center mb-2">Our Bucket List 💕</h2>
      <p className="text-center text-gray-600 max-w-xl mx-auto mb-6">
        A collection of dreams, milestones, and adventures we want to experience together. Each entry is a step toward creating unforgettable memories and celebrating our story.
      </p>

      {/* Status bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{completedCount}/{totalCount} completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {['all', 'travel', 'experience', 'milestone', 'adventure'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === filterOption
                ? 'bg-purple-600 text-white'
                : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-6">
        <label className="flex items-center space-x-2 text-gray-600">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="rounded text-purple-600"
          />
          <span>Show completed items</span>
        </label>
      </div>

      {/* Add Item Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-purple-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          {showAddForm ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      {/* Add Item Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-lg border border-purple-100 p-6 mb-8 max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-purple-800 mb-4 text-center">Add a New Bucket List Item</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                placeholder="What do you want to do?"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                placeholder="Describe this bucket list item..."
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="travel">✈️ Travel</option>
                  <option value="experience">📷 Experience</option>
                  <option value="milestone">📍 Milestone</option>
                  <option value="adventure">❤️ Adventure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newItemPriority}
                  onChange={(e) => setNewItemPriority(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="contentProtected"
                checked={newItemContentProtected}
                onChange={(e) => setNewItemContentProtected(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="contentProtected" className="text-sm text-gray-700">
                🔒 Protect content with password
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddButtonClick}
                className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newItemTitle.trim() || !newItemDescription.trim()}
              >
                Add Item
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Item List */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-lg shadow-md border-l-4 p-4 hover:shadow-lg transition-all duration-200 ${
              item.completed ? 'opacity-75' : ''
            } ${
              item.priority === 'high'
                ? 'border-red-500'
                : item.priority === 'medium'
                ? 'border-yellow-500'
                : 'border-green-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <button
                  aria-label={item.completed ? 'Mark incomplete (password required)' : 'Mark complete (password required)'}
                  onClick={() => handleToggleClick(item.id)}
                  className="text-purple-600 hover:text-purple-900 transition-colors mt-1 relative group"
                  title="Password required to change status"
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    🔒 Password required
                  </span>
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getIconByCategory(item.category)}
                    <h3 className={`font-semibold text-lg ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {item.title}
                    </h3>
                  </div>
                  <div className="text-gray-700 mb-2">
                    {item.contentProtected && !unlockedItems.has(item.id) ? (
                      <button
                        onClick={() => handleRevealContentClick(item)}
                        className="text-sm text-purple-700 underline hover:text-purple-900 transition-colors"
                      >
                        🔒 Content is protected — click to enter password
                      </button>
                    ) : (
                      <p className={item.completed ? 'line-through text-gray-500' : ''}>{item.description}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    {item.createdAt && (
                      <p>Added: {formatDate(item.createdAt)}</p>
                    )}
                    {item.completed && item.completedAt && (
                      <p className="text-green-600 font-medium">
                        ✅ Completed: {formatDate(item.completedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items found matching your filters.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or add a new item!</p>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl"
          >
            <h4 className="text-lg font-semibold mb-4 text-purple-800">
              {getPasswordPromptTitle()}
            </h4>
            <input
              type="password"
              placeholder="Password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitPassword()}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
            />
            {passwordError && (
              <p className="text-sm text-red-600 mb-3">{passwordError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setEnteredPassword('');
                  setPasswordError('');
                  setContentToReveal(null);
                  setItemToToggle(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPassword}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
                disabled={isSubmitting || enteredPassword.trim() === ''}
              >
                {isSubmitting ? 'Checking...' : 'Submit'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default BucketList;