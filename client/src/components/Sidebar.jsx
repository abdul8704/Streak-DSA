import React, { useState } from 'react';
import { Bell, Layers, Zap, Terminal, Code2, User, LogOut, RefreshCw, Database } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const [isSyncing, setIsSyncing] = useState(false);
    const [showSyncModal, setShowSyncModal] = useState(false);
    const [syncCredentials, setSyncCredentials] = useState({ leetcode_session: '', csrf_token: '' });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleQuickSync = async () => {
        if (!user) return;
        setIsSyncing(true);
        try {
            await axios.post('http://localhost:5000/api/user/sync/daily', { username: user.username });
            alert("Quick sync completed!");
            window.location.reload(); // Refresh to show new data
        } catch (error) {
            console.error(error);
            alert("Quick sync failed");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleFullSync = async (e) => {
        e.preventDefault();
        if (!user) return;
        setIsSyncing(true);
        try {
            await axios.post('http://localhost:5000/api/user/sync', {
                username: user.username,
                leetcode_session: syncCredentials.leetcode_session,
                csrf_token: syncCredentials.csrf_token
            });
            alert("Full sync completed!");
            setShowSyncModal(false);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Full sync failed: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="h-full w-full bg-surface flex flex-col justify-between p-4 relative">
            {/* Top Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="text-2xl font-bold text-primary">Logo</div>
                    <ThemeToggle />
                </div>

                <nav className="space-y-2">
                    <SidebarItem
                        icon={<Layers size={20} />} // Changed icon to Layers for Dashboard
                        label="Dashboard"
                        active={location.pathname === '/dashboard'}
                        onClick={() => navigate('/dashboard')}
                    />
                    <SidebarItem
                        icon={<Bell size={20} />}
                        label="Notification"
                        active={location.pathname === '/notifications'} // Assuming notifications has its own route or keep as is if it's a placeholder
                        onClick={() => navigate('/notifications')}
                    />
                    <div className="pt-4 pb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Sync Actions
                    </div>
                    <SidebarItem
                        icon={<RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />}
                        label="Quick Sync"
                        onClick={handleQuickSync}
                        disabled={isSyncing}
                    />
                    <SidebarItem
                        icon={<Database size={20} />}
                        label="Full LeetCode Sync"
                        onClick={() => setShowSyncModal(true)}
                        disabled={isSyncing}
                    />
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="space-y-2">
                <SidebarItem
                    icon={<User size={20} />}
                    label="Edit Profile"
                    active={location.pathname === '/profile'}
                    onClick={() => navigate('/profile')}
                />
                <SidebarItem
                    icon={<LogOut size={20} />}
                    label="Logout"
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                />
            </div>

            {/* Full Sync Modal */}
            {showSyncModal && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-surface p-6 rounded-xl shadow-2xl w-full max-w-sm border border-border">
                        <h3 className="text-lg font-bold mb-4 text-primary">LeetCode Full Sync</h3>
                        <form onSubmit={handleFullSync} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-text-secondary">LeetCode Session</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded border border-border bg-background text-sm"
                                    value={syncCredentials.leetcode_session}
                                    onChange={e => setSyncCredentials({ ...syncCredentials, leetcode_session: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-text-secondary">CSRF Token</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded border border-border bg-background text-sm"
                                    value={syncCredentials.csrf_token}
                                    onChange={e => setSyncCredentials({ ...syncCredentials, csrf_token: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowSyncModal(false)}
                                    className="px-3 py-1.5 text-sm text-text-secondary hover:text-primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 text-sm bg-text-accent text-white rounded hover:bg-opacity-90"
                                    disabled={isSyncing}
                                >
                                    {isSyncing ? 'Syncing...' : 'Start Sync'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SidebarItem = ({ icon, label, active, className = "", onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${active
                    ? 'bg-card shadow-sm text-primary'
                    : 'text-secondary hover:bg-card-hover hover:text-primary'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default Sidebar;
