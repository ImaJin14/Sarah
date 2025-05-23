import React from 'react';

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string; // <- changed from number to string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>; // <- changed from number to string
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4 overflow-x-auto p-4 bg-white rounded-lg shadow-md mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => setActiveTab(tab.label)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === tab.label
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
