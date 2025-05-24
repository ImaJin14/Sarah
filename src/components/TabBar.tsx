import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="sticky top-4 z-20 mb-8">
      <div className="flex justify-center px-2">
        <div className="inline-flex flex-wrap justify-center gap-1 md:gap-2 p-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100 max-w-full">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`relative px-3 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-medium transition-all duration-300 flex-shrink-0 min-w-0 ${
                activeTab === tab.label
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {activeTab === tab.label && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 truncate">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabBar;