import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check auth on mount
    // Check auth on mount
    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // Replacing fetch with a helper or just updating all calls?
    // Let's update `login` to expecting cookie.

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include' // Important for setting cookie
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const userData = await response.json();
            setUser(userData);
            // No localStorage needed for user persistence if we trust the cookie check on reload.
            // But checking /me on every reload causes a flash of "loading".
            // We can keep localStorage as a hint or "optimistic" user state.
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const initiateSignup = async (username, email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup/init', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Signup initiation failed');

            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const verifySignup = async (username, email, password, otp) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, otp })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Verification failed');

            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // I should rewrite the whole AuthContext to align with specific needs.

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const updateProfile = async (data) => {
        // data can contain email, password, etc.
        // We need to send username as identifier
        if (!user) return { success: false, message: "Not authenticated" };

        try {
            const response = await fetch('http://localhost:5000/api/auth/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username, ...data }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Update failed');
            }

            // Update local user state if email changed
            if (data.email) {
                const updatedUser = { ...user, email: data.email };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            return { success: true };

        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    const value = {
        user,
        login,
        initiateSignup,
        verifySignup,
        logout,
        updateProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
