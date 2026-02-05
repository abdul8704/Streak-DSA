import React from 'react';
import { Bell, Layers, Zap, Terminal, Code2, User, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
    return (
        <div className="h-full w-full bg-surface flex flex-col justify-between p-4">
            {/* Top Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="text-2xl font-bold text-primary">Logo</div>
                    <ThemeToggle />
                </div>

                <nav className="space-y-2">
                    <SidebarItem icon={<Bell size={20} />} label="Notification" active />
                    <SidebarItem icon={<Layers size={20} />} label="All Platforms" />
                    <SidebarItem icon={<Zap size={20} />} label="LeetCode" className="text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400" />
                    <SidebarItem icon={<Terminal size={20} />} label="AtCoder" />
                    <SidebarItem icon={<Code2 size={20} />} label="Codeforces" />
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="space-y-2">
                <SidebarItem icon={<User size={20} />} label="Edit Profile" />
                <SidebarItem icon={<LogOut size={20} />} label="Logout" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" />
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, className = "" }) => {
    return (
        <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${active
                    ? 'bg-card shadow-sm text-primary'
                    : 'text-secondary hover:bg-card-hover hover:text-primary'}
            ${className}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default Sidebar;
