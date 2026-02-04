import React from 'react';
import { Bell, Layers, Zap, Terminal, Code2, User, LogOut } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="h-screen w-full bg-gray-50 flex flex-col justify-between p-4 border-r border-gray-200">
            {/* Top Section */}
            <div className="space-y-6">
                <div className="text-2xl font-bold px-2 text-gray-800">Logo</div>

                <nav className="space-y-2">
                    <SidebarItem icon={<Bell size={20} />} label="Notification" active />
                    <SidebarItem icon={<Layers size={20} />} label="All Platforms" />
                    <SidebarItem icon={<Zap size={20} />} label="LeetCode" className="text-yellow-600 bg-yellow-50" />
                    <SidebarItem icon={<Terminal size={20} />} label="AtCoder" />
                    <SidebarItem icon={<Code2 size={20} />} label="Codeforces" />
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="space-y-2">
                <SidebarItem icon={<User size={20} />} label="Edit Profile" />
                <SidebarItem icon={<LogOut size={20} />} label="Logout" className="text-red-500 hover:bg-red-50" />
            </div>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, className = "" }) => {
    return (
        <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${active ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:bg-gray-100'}
            ${className}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default Sidebar;
