import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="flex h-screen bg-white font-sans text-gray-900">
      {/* Sidebar - 1/7 width */}
      <div className="w-[14.28%] min-w-[200px] h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Dashboard - 6/7 width */}
      <div className="flex-1 h-full overflow-hidden">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
