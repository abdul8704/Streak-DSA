import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const EditProfile = () => {
    const { user, updateProfile } = useAuth();
    const [profileData, setProfileData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [platforms, setPlatforms] = useState([]);
    const [newPlatform, setNewPlatform] = useState({ platform: 'leetcode', handle: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setProfileData(prev => ({ ...prev, email: user.email }));

            // Fetch platforms
            const fetchPlatforms = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/user/platforms/${user.username}`);
                    if (response.ok) {
                        const data = await response.json();
                        setPlatforms(data);
                        // Pre-fill leetcode handle if exists
                        const leetcode = data.find(p => p.platform === 'leetcode');
                        if (leetcode) {
                            setNewPlatform(prev => ({ ...prev, handle: leetcode.platform_handle }));
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch platforms", error);
                }
            };
            fetchPlatforms();
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (profileData.password && profileData.password !== profileData.confirmPassword) {
            return setError("Passwords do not match");
        }

        const updateData = { email: profileData.email };
        if (profileData.password) updateData.password = profileData.password;

        const result = await updateProfile(updateData);
        if (result.success) {
            setMessage("Profile updated successfully");
            setProfileData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } else {
            setError(result.message);
        }
    };

    const handleAddPlatform = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!newPlatform.handle) return setError("Handle is required");

        try {
            const response = await fetch('http://localhost:5000/api/user/platform', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: user.username,
                    platforms: [{ platform: newPlatform.platform, handle: newPlatform.handle }]
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to add platform');
            }

            setMessage("Platform handle added");
            setNewPlatform({ platform: 'leetcode', handle: '' });
            // Ideally we should refetch platforms here if we were listing them from DB
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="h-full overflow-y-auto bg-surface p-8">
            <h1 className="text-3xl font-bold text-primary mb-8">Edit Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Account Settings */}
                <div className="bg-background rounded-xl p-6 border border-border">
                    <h2 className="text-xl font-semibold text-primary mb-4">Account Settings</h2>

                    {message && <div className="mb-4 text-green-500 text-sm">{message}</div>}
                    {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
                            <input
                                type="text"
                                value={user?.username || ''}
                                disabled
                                className="w-full rounded-lg border border-border bg-surface p-2.5 text-text-secondary cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleProfileChange}
                                className="w-full rounded-lg border border-border bg-background p-2.5 text-primary focus:border-text-accent focus:outline-none"
                            />
                        </div>

                        <hr className="border-border my-4" />

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">New Password (leave blank to keep current)</label>
                            <input
                                type="password"
                                name="password"
                                value={profileData.password}
                                onChange={handleProfileChange}
                                className="w-full rounded-lg border border-border bg-background p-2.5 text-primary focus:border-text-accent focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={profileData.confirmPassword}
                                onChange={handleProfileChange}
                                className="w-full rounded-lg border border-border bg-background p-2.5 text-primary focus:border-text-accent focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-text-accent py-2.5 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 shadow-md shadow-text-accent/20"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>

                {/* Platform Handles */}
                <div className="bg-background rounded-xl p-6 border border-border h-fit">
                    <h2 className="text-xl font-semibold text-primary mb-4">Platform Handles</h2>

                    <form onSubmit={handleAddPlatform} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Platform</label>
                            <select
                                value={newPlatform.platform}
                                onChange={(e) => {
                                    const selected = e.target.value;
                                    const existing = platforms.find(p => p.platform === selected);
                                    setNewPlatform({
                                        platform: selected,
                                        handle: existing ? existing.platform_handle : ''
                                    });
                                }}
                                className="w-full rounded-lg border border-border bg-background p-2.5 text-primary focus:border-text-accent focus:outline-none"
                            >
                                <option value="leetcode">LeetCode</option>
                                <option value="codeforces">Codeforces</option>
                                <option value="geeksforgeeks">GeeksForGeeks</option>
                            </select>
                        </div>

                        {/* Display Current Handle Status */}
                        <div className="text-sm">
                            <span className="text-text-secondary">Current Handle: </span>
                            {platforms.find(p => p.platform === newPlatform.platform) ? (
                                <span className="text-primary font-medium">{platforms.find(p => p.platform === newPlatform.platform).platform_handle}</span>
                            ) : (
                                <span className="text-red-400 italic">No handle found</span>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Handle / Username</label>
                            <input
                                type="text"
                                value={newPlatform.handle}
                                onChange={(e) => setNewPlatform({ ...newPlatform, handle: e.target.value })}
                                className="w-full rounded-lg border border-border bg-background p-2.5 text-primary focus:border-text-accent focus:outline-none"
                                placeholder="Enter handle"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-surface border-2 border-text-accent text-text-accent py-2.5 font-semibold transition-colors hover:bg-text-accent hover:text-white"
                        >
                            Link Platform
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
