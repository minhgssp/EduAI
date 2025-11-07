import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItemClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "text-gray-600 hover:bg-gray-200";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          <h1 className="text-xl font-bold text-gray-800">EduAI Builder</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('builder')}
            className={`${navItemClasses} ${currentView === 'builder' ? activeClasses : inactiveClasses}`}
          >
            Builder
          </button>
          <button
            onClick={() => setView('about')}
            className={`${navItemClasses} ${currentView === 'about' ? activeClasses : inactiveClasses}`}
          >
            About
          </button>
          <button
            onClick={() => setView('roadmap')}
            className={`${navItemClasses} ${currentView === 'roadmap' ? activeClasses : inactiveClasses}`}
          >
            Roadmap
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;