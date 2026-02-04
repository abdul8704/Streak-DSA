import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background font-sans text-primary transition-colors duration-200">
        {/* Sidebar - 1/7 width */}
        <div className="w-[14.28%] min-w-[200px] h-full flex-shrink-0 bg-surface border-r border-border">
          <Sidebar />
        </div>

        {/* Dashboard - 6/7 width */}
        <div className="flex-1 h-full overflow-hidden bg-surface">
          <Dashboard />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
