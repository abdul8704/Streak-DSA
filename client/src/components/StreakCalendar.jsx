import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Zap, Trophy, Target, TrendingUp } from 'lucide-react';

const StreakCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // State for solved days
    const [solvedDays, setSolvedDays] = useState(new Set());
    const [stats, setStats] = useState({
        currentStreak: 0,
        longestStreak: 0,
        todaySolved: 0,
        maxSolvedOneDay: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/leetcode/daily', {
                    username: "abdulaziz120"
                });
                const data = response.data;

                // Process solved days
                const newSolvedDays = new Set();
                let todayCount = 0;
                let max = 0;

                const parsedDates = []; // Store timestamps

                Object.entries(data).forEach(([dateStr, count]) => {
                    const date = new Date(dateStr);
                    if (count > 0) {
                        newSolvedDays.add(date.toDateString());
                        parsedDates.push(date.getTime());
                    }

                    if (count > max) max = count;

                    // check if today
                    const today = new Date();
                    if (date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear()) {
                        console.log(`Matched today: ${dateStr} with count ${count}`);
                        todayCount = count;
                    }
                });

                // Calculate Streaks
                parsedDates.sort((a, b) => a - b); // Ascending

                let currentStreak = 0;
                let longestStreak = 0;
                let tempStreak = 0;

                if (parsedDates.length > 0) {
                    // Longest Streak
                    tempStreak = 1;
                    longestStreak = 1;
                    for (let i = 1; i < parsedDates.length; i++) {
                        const prev = new Date(parsedDates[i - 1]);
                        const curr = new Date(parsedDates[i]);

                        // Check if consecutive (difference is approx 1 day)
                        const diffTime = curr - prev;
                        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

                        // Note: If multiple submissions on same day, diffDays is 0. 
                        // But we filtered distinct dates earlier? 
                        // actually new Date(dateStr) from "6 Feb 2026" creates unique timestamps per day.

                        if (diffDays === 1) {
                            tempStreak++;
                        } else if (diffDays > 1) {
                            tempStreak = 1;
                        }
                        // If diffDays === 0 (same day), do nothing (streak continues effectively, but count doesn't increase)

                        if (tempStreak > longestStreak) longestStreak = tempStreak;
                    }

                    // Current Streak
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);

                    // Check if last available data point is today or yesterday
                    const lastDateTimestamp = parsedDates[parsedDates.length - 1];
                    const lastDate = new Date(lastDateTimestamp);

                    const isToday = lastDate.getDate() === today.getDate() &&
                        lastDate.getMonth() === today.getMonth() &&
                        lastDate.getFullYear() === today.getFullYear();

                    const isYesterday = lastDate.getDate() === yesterday.getDate() &&
                        lastDate.getMonth() === yesterday.getMonth() &&
                        lastDate.getFullYear() === yesterday.getFullYear();

                    if (isToday || isYesterday) {
                        currentStreak = 1;
                        for (let i = parsedDates.length - 2; i >= 0; i--) {
                            const curr = new Date(parsedDates[i + 1]);
                            const prev = new Date(parsedDates[i]);
                            const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
                            if (diff === 1) {
                                currentStreak++;
                            } else if (diff > 1) {
                                break;
                            }
                        }
                    } else {
                        currentStreak = 0;
                    }
                }

                setSolvedDays(newSolvedDays);
                setStats(prev => ({
                    ...prev,
                    currentStreak,
                    longestStreak,
                    todaySolved: todayCount,
                    maxSolvedOneDay: max
                }));

            } catch (error) {
                console.error("Error fetching streak data:", error);
            }
        };

        fetchData();
    }, []);

    const handlePrevMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
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
            const dateCheck = new Date(year, currentDate.getMonth(), d);
            const isSolved = solvedDays.has(dateCheck.toDateString());

            const isToday = d === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

            dayElements.push(
                <div
                    key={d}
                    className={`h-8 w-8 flex items-center justify-center text-sm rounded-full cursor-pointer transition-all
                        ${isToday ? 'border-2 border-primary' : ''}
                        ${isSolved
                            ? 'bg-green-100 text-green-600 font-bold dark:bg-green-900/30 dark:text-green-400'
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
        <div className="bg-card p-4 rounded-xl shadow-sm border border-border  flex flex-col transition-colors">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-primary">{monthName} {year}</h3>
                <div className="flex gap-1">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-card-hover rounded-md text-secondary hover:text-primary">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-card-hover rounded-md text-secondary hover:text-primary">
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
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
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
