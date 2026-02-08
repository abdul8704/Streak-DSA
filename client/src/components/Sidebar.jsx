import React, { useState } from 'react';
import { Bell, Layers, Zap, Terminal, Code2, User, LogOut, RefreshCw, Database, X, HelpCircle } from 'lucide-react';
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
                        icon={<Layers size={20} />}
                        label="Dashboard"
                        active={location.pathname === '/dashboard'}
                        onClick={() => navigate('/dashboard')}
                    />
                    <SidebarItem
                        icon={<Bell size={20} />}
                        label="Notification"
                        active={location.pathname === '/notifications'}
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

            {/* Full Sync Drawer (Right Side) */}
            {showSyncModal && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowSyncModal(false)}
                    />

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-md h-full bg-surface shadow-2xl p-6 overflow-y-auto transform transition-transform animate-in slide-in-from-right duration-300 border-l border-border">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                <Database size={24} className="text-text-accent" />
                                Full LeetCode Sync
                            </h3>
                            <button
                                onClick={() => setShowSyncModal(false)}
                                className="p-2 hover:bg-card-hover rounded-full text-text-secondary hover:text-primary transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Instructions Box */}
                            <div className="bg-card p-4 rounded-lg border border-border">
                                <h4 className="flex items-center gap-2 font-semibold text-text-primary mb-3">
                                    <HelpCircle size={16} />
                                    How to get tokens
                                </h4>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
                                    <li>Login to <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer" className="text-text-accent hover:underline">LeetCode.com</a> in a new tab.</li>
                                    <li>Open Developer Tools (Right-click &gt; Inspect or press <kbd className="bg-background px-1 rounded border border-border">F12</kbd>).</li>
                                    <li>Go to the <strong>Application</strong> tab (might be hidden behind '>>').</li>
                                    <li>In the sidebar, expand <strong>Cookies</strong> and select <code>https://leetcode.com</code>.</li>
                                    <li>Find and copy the values for:
                                        <ul className="list-disc list-inside ml-4 mt-1 text-xs space-y-1">
                                            <li><code>LEETCODE_SESSION</code></li>
                                            <li><code>csrftoken</code></li>
                                        </ul>
                                    </li>
                                </ol>
                            </div>

                            <form onSubmit={handleFullSync} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">LeetCode Session</label>
                                    <input
                                        type="text"
                                        placeholder="Paste LEETCODE_SESSION here..."
                                        className="w-full p-3 rounded-lg border border-border bg-background text-sm text-primary focus:border-text-accent focus:ring-1 focus:ring-text-accent outline-none transition-all"
                                        value={syncCredentials.leetcode_session}
                                        onChange={e => setSyncCredentials({ ...syncCredentials, leetcode_session: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">CSRF Token</label>
                                    <input
                                        type="text"
                                        placeholder="Paste csrftoken here..."
                                        className="w-full p-3 rounded-lg border border-border bg-background text-sm text-primary focus:border-text-accent focus:ring-1 focus:ring-text-accent outline-none transition-all"
                                        value={syncCredentials.csrf_token}
                                        onChange={e => setSyncCredentials({ ...syncCredentials, csrf_token: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowSyncModal(false)}
                                        className="flex-1 py-2.5 text-sm font-medium text-text-secondary bg-card hover:bg-card-hover rounded-lg transition-colors border border-border"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-2.5 text-sm font-bold text-white bg-text-accent hover:bg-opacity-90 rounded-lg shadow-lg shadow-text-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        disabled={isSyncing}
                                    >
                                        {isSyncing ? (
                                            <>
                                                <RefreshCw size={16} className="animate-spin" />
                                                Syncing...
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={16} />
                                                Start Full Sync
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <p className="text-xs text-center text-text-secondary">
                                Your tokens are only used for this one-time sync and are not stored permanently.
                            </p>
                        </div>
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
