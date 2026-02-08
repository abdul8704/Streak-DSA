import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import Greet from './Greet';
import Calendar from './Calendar';
import DifficultyBreak from './DifficultyBreak';
import SolvedGraph from './SolvedGraph';
import ContestGraph from './ContestGraph';
import StreakCalendar from './StreakCalendar';

const Dashboard = () => {
    const { user } = useAuth();
    const [hasLeetCode, setHasLeetCode] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkHandle = async () => {
            if (user?.username) {
                try {
                    const response = await fetch(`http://localhost:5000/api/user/platforms/${user.username}`);
                    if (response.ok) {
                        const platforms = await response.json();
                        const leetcode = platforms.find(p => p.platform === 'leetcode' && p.platform_handle);
                        setHasLeetCode(!!leetcode);
                    }
                } catch (error) {
                    console.error("Failed to check platforms", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        checkHandle();
    }, [user]);

    return (
        <div className="h-full p-6 bg-surface overflow-y-auto flex flex-col gap-6">

            {/* Alert for missing handle */}
            {!loading && !hasLeetCode && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center justify-between text-amber-600 dark:text-amber-400">
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={24} />
                        <div>
                            <h3 className="font-semibold">LeetCode Handle Missing</h3>
                            <p className="text-sm opacity-90">Please link your LeetCode account to view your statistics.</p>
                        </div>
                    </div>
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm"
                    >
                        Link Account <ArrowRight size={16} />
                    </Link>
                </div>
            )}

            {/* Top Section: Main Grid */}
            <div className="grid grid-cols-3 gap-6 flex-shrink-0">

                {/* Left Column (2/3 width) - Greet, Difficulty, Solved */}
                <div className="col-span-2 flex flex-col gap-6">
                    <div className="h-32">
                        <Greet />
                    </div>
                    <div className="h-64">
                        <DifficultyBreak />
                    </div>
                    <div className="h-[450px]">
                        <SolvedGraph />
                    </div>
                </div>

                {/* Right Column (1/3 width) - StreakCalendar, ContestGraph */}
                <div className="col-span-1 flex flex-col gap-6">
                    <div className="flex-none">
                        <StreakCalendar />
                    </div>
                    <div className="flex-1 min-h-0">
                        <ContestGraph />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Submission Heatmap (Full Width) */}
            <div className="w-full h-64 flex-shrink-0">
                <Calendar />
            </div>
        </div>
    );
};

export default Dashboard;
