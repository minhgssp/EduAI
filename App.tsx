import React, { useState } from 'react';
import Header from './components/Header';
import BuilderView from './views/BuilderView';
import AboutView from './views/AboutView';
import RoadmapView from './views/RoadmapView'; // Import the new RoadmapView
import { BuilderProvider } from './contexts/BuilderContext';
import { View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('builder');

  const renderView = () => {
    switch (view) {
      case 'builder':
        return <BuilderView />;
      case 'about':
        return <AboutView />;
      case 'roadmap':
        return <RoadmapView />; // Render RoadmapView for 'roadmap'
      default:
        return <BuilderView />;
    }
  };

  return (
    <BuilderProvider>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
        <Header currentView={view} setView={setView} />
        <main className="container mx-auto px-4 py-6">
          {renderView()}
        </main>
      </div>
    </BuilderProvider>
  );
};

export default App;