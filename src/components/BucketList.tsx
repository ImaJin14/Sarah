import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Heart, MapPin, Camera, Plane } from 'lucide-react';

interface BucketListItem {
  id: number;
  title: string;
  description: string;
  category: 'travel' | 'experience' | 'milestone' | 'adventure';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

const BucketList: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'travel' | 'experience' | 'milestone' | 'adventure'>('all');
  const [showCompleted, setShowCompleted] = useState(true);

  const bucketListItems: BucketListItem[] = [
    {
      id: 1,
      title: "Visit the Holy Land",
      description: "Walk where Jesus walked, pray at the Western Wall, and experience the land of our faith together 🇮🇱",
      category: 'travel',
      completed: false,
      priority: 'high',
      icon: <MapPin className="h-5 w-5" />
    },
    {
      id: 2,
      title: "Get Married in a Beautiful Church",
      description: "Exchange vows in God's presence, surrounded by family and friends who love us ⛪",
      category: 'milestone',
      completed: false,
      priority: 'high',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 3,
      title: "Build Our Dream Home",
      description: "Create a sanctuary where we can raise our family and welcome others with hospitality 🏡",
      category: 'milestone',
      completed: false,
      priority: 'high',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 4,
      title: "Go on a Safari Adventure",
      description: "Experience God's incredible creation in the African wilderness together 🦁",
      category: 'adventure',
      completed: false,
      priority: 'medium',
      icon: <Camera className="h-5 w-5" />
    },
    {
      id: 5,
      title: "Learn to Dance Together",
      description: "Take ballroom dancing lessons and have our first dance be perfect 💃🕺",
      category: 'experience',
      completed: false,
      priority: 'medium',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 6,
      title: "Visit Every Continent",
      description: "Explore God's beautiful world together, one continent at a time 🌍",
      category: 'travel',
      completed: false,
      priority: 'low',
      icon: <Plane className="h-5 w-5" />
    },
    {
      id: 7,
      title: "Start a Family",
      description: "Raise beautiful children in the fear and admonition of the Lord 👶",
      category: 'milestone',
      completed: false,
      priority: 'high',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 8,
      title: "Attend a Christian Concert Together",
      description: "Worship through music at a live Christian concert or festival 🎵",
      category: 'experience',
      completed: false,
      priority: 'medium',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 9,
      title: "Write Our Love Story",
      description: "Document our journey together to share with our future children 📖",
      category: 'experience',
      completed: false,
      priority: 'medium',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: 10,
      title: "Volunteer Together",
      description: "Serve others in our community through our local church or charity 🤝",
      category: 'experience',
      completed: false,
      priority: 'high',
      icon: <Heart className="h-5 w-5" />
    }
  ];

  const [items, setItems] = useState(bucketListItems);

  const toggleCompleted = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const filteredItems = items.filter(item => {
    if (filter !== 'all' && item.category !== filter) return false;
    if (!showCompleted && item.completed) return false;
    return true;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'travel': return 'bg-blue-100 text-blue-800';
      case 'experience': return 'bg-green-100 text-green-800';
      case 'milestone': return 'bg-purple-100 text-purple-800';
      case 'adventure': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <section className="py-8" id="bucket-list">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-purple-800 mb-4">
            Our Bucket List Together 💕
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Dreams we want to chase and memories we want to make, hand in hand
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{completedCount}/{totalCount} completed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
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

        {/* Bucket List Items */}
        <div className="grid gap-4 md:gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getPriorityColor(item.priority)} ${
                item.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => toggleCompleted(item.id)}
                  className={`mt-1 transition-colors duration-200 ${
                    item.completed ? 'text-green-600' : 'text-gray-400 hover:text-purple-600'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {item.icon}
                    <h3 className={`text-lg font-semibold ${
                      item.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}>
                      {item.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  
                  <p className={`text-gray-600 ${item.completed ? 'line-through' : ''}`}>
                    {item.description}
                  </p>
                  
                  <div className="mt-2 flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items match your current filters.</p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default BucketList;