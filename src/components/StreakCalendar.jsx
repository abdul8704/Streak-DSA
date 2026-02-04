import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, Trophy, Target, TrendingUp } from 'lucide-react';

const StreakCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock data for solved days
    const solvedDays = new Set([1, 3, 4, 7, 8, 12, 14, 15, 16, 20, 22, 25, 28, 30]);

    // Mock Stats
    const stats = {
        currentStreak: 4,
        longestStreak: 12,
        todaySolved: 2,
        maxSolvedOneDay: 8
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const renderDays = () => {
        const dayElements = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            dayElements.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
        }

        // Days of month
        for (let d = 1; d <= days; d++) {
            const isSolved = solvedDays.has(d);
            const isToday = d === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

            dayElements.push(
                <div
                    key={d}
                    className={`h-8 w-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-all
                        ${isToday ? 'border-2 border-primary' : ''}
                        ${isSolved
                            ? 'bg-orange-100 text-orange-600 font-bold dark:bg-orange-900/30 dark:text-orange-400'
                            : 'text-secondary hover:bg-card-hover'}
                    `}
                >
                    {d}
                </div>
            );
        }
        return dayElements;
    };

    return (
        <div className="bg-card p-4 rounded-xl shadow-sm border border-border h-full flex flex-col transition-colors">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-primary">{monthName} {year}</h3>
                <div className="flex gap-1">
                    <button className="p-1 hover:bg-card-hover rounded-md text-secondary hover:text-primary">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="p-1 hover:bg-card-hover rounded-md text-secondary hover:text-primary">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-xs text-secondary font-medium">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-x-1 gap-y-4 place-items-center mb-6">
                {renderDays()}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-border">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-surface">
                    <div className="p-2 bg-card rounded-md shadow-sm text-orange-500 border border-border">
                        <Zap size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-secondary font-medium">Current Streak</span>
                        <span className="text-sm font-bold text-primary">{stats.currentStreak} Days</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-surface">
                    <div className="p-2 bg-card rounded-md shadow-sm text-yellow-500 border border-border">
                        <Trophy size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-secondary font-medium">Longest Streak</span>
                        <span className="text-sm font-bold text-primary">{stats.longestStreak} Days</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-surface">
                    <div className="p-2 bg-card rounded-md shadow-sm text-blue-500 border border-border">
                        <Target size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-secondary font-medium">Solved Today</span>
                        <span className="text-sm font-bold text-primary">{stats.todaySolved}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-surface">
                    <div className="p-2 bg-card rounded-md shadow-sm text-green-500 border border-border">
                        <TrendingUp size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-secondary font-medium">Max Solved</span>
                        <span className="text-sm font-bold text-primary">{stats.maxSolvedOneDay}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreakCalendar;
