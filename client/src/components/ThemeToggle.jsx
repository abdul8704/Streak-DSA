import React from 'react';
import { Moon, Sun, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center bg-surface p-1 rounded-lg border border-border">
            <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-card shadow-sm text-accent' : 'text-secondary hover:text-primary'}`}
                title="Light Mode"
            >
                <Sun size={16} />
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-card shadow-sm text-accent' : 'text-secondary hover:text-primary'}`}
                title="Dark Mode"
            >
                <Moon size={16} />
            </button>
            <button
                onClick={() => setTheme('midnight')}
                className={`p-1.5 rounded-md transition-colors ${theme === 'midnight' ? 'bg-card shadow-sm text-accent' : 'text-secondary hover:text-primary'}`}
                title="Midnight Theme"
            >
                <Laptop size={16} />{/* Using generic icon for 'custom/midnight' */}
            </button>
        </div>
    );
};

export default ThemeToggle;
