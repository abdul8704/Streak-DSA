import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { signup, login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords ensure match");
        }

        const result = await signup(formData.username, formData.email, formData.password);
        if (result.success) {
            // Auto login after signup
            const loginResult = await login(formData.username, formData.password);
            if (loginResult.success) {
                // First time user, maybe redirect to profile to complete setup?
                // Request said: "while registering for firdt time, after creating new user, take them to edit profile page."
                navigate('/profile');
            } else {
                navigate('/login');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md rounded-xl bg-surface p-8 shadow-xl border border-border">
                <h2 className="mb-6 text-3xl font-bold text-center text-primary">Create Account</h2>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-text-secondary">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-border bg-background p-2.5 text-primary focus:border-text-accent focus:outline-none focus:ring-1 focus:ring-text-accent transition-colors"
                            placeholder="Choose a username"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-text-secondary">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-border bg-background p-2.5 text-primary focus:border-text-accent focus:outline-none focus:ring-1 focus:ring-text-accent transition-colors"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-text-secondary">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-border bg-background p-2.5 text-primary focus:border-text-accent focus:outline-none focus:ring-1 focus:ring-text-accent transition-colors"
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-text-secondary">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-border bg-background p-2.5 text-primary focus:border-text-accent focus:outline-none focus:ring-1 focus:ring-text-accent transition-colors"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-text-accent py-2.5 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 shadow-md shadow-text-accent/20"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-text-accent hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
