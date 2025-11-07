import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="my-4">
      <div className="border-4 border-gray-200 border-t-blue-600 rounded-full w-8 h-8 animate-spin mx-auto"></div>
    </div>
  );
};

export default Loader;
