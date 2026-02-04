import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check local storage or system preference
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('app-theme');
            if (savedTheme) return savedTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        // Remove old theme classes
        root.classList.remove('light', 'dark', 'midnight');
        // Add new theme class
        root.classList.add(theme);
        // Save to local storage
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
