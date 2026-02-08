import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Zap, Trophy, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StreakCalendar = () => {
    const { user } = useAuth();
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
            if (!user) return;
            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1; // API expects 1-12

                // Fetch Calendar Data
                const calendarResponse = await axios.get(`http://localhost:5000/api/user-data/${user.username}/streak`, {
                    params: { month, year }
                });
                const calendarData = calendarResponse.data;

                console.log(calendarData);

                // Process solved days from calendarData
                // calendarData format expected: { "YYYY-MM-DD": count, ... }
                const newSolvedDays = new Set();
                Object.entries(calendarData).forEach(([dateStr, count]) => {
                    if (count > 0) {
                        // Parse dateStr "YYYY-MM-DD" to Date object to format as standard string if needed
                        // But toDateString() depends on local time, and "YYYY-MM-DD" is usually UTC or local date literal.
                        // Let's rely on standardizing.
                        const parts = dateStr.split('-');
                        const date = new Date(parts[0], parts[1] - 1, parts[2]);
                        newSolvedDays.add(date.toDateString());
                    }
                });
                setSolvedDays(newSolvedDays);


                // Fetch All Time Graph Data for Stats
                const statsResponse = await axios.get(`http://localhost:5000/api/user-data/${user.username}/graph`, {
                    params: { range: 'all-time' }
                });
                const graphData = statsResponse.data; // Array of { date: "YYYY-MM-DD", count: number }

                // Calculate Stats
                let calculatedStats = {
                    currentStreak: 0,
                    longestStreak: 0,
                    todaySolved: 0,
                    maxSolvedOneDay: 0
                };

                if (Array.isArray(graphData)) {
                    // Sort data by date just in case
                    const sortedData = [...graphData].sort((a, b) => new Date(a.date) - new Date(b.date));

                    // 1. Max Solved One Day
                    let maxSolved = 0;
                    sortedData.forEach(item => {
                        if (item.count > maxSolved) maxSolved = item.count;
                    });

                    // 2. Today Solved
                    const today = new Date();
                    const y = today.getFullYear();
                    const m = String(today.getMonth() + 1).padStart(2, '0');
                    const d = String(today.getDate()).padStart(2, '0');
                    const todayStr = `${y}-${m}-${d}`;

                    const todayEntry = sortedData.find(item => item.date === todayStr);
                    const todayCount = todayEntry ? todayEntry.count : 0;

                    // 3. Streaks
                    // Create a Set of solved dates for O(1) lookup
                    const solvedDatesSet = new Set(sortedData.filter(item => item.count > 0).map(item => item.date));

                    // Current Streak
                    let currentStreak = 0;
                    let checkDate = new Date(today);
                    // If today has no submissions, checking from yesterday might be valid for "active" streak in some definitions,
                    // but user said "start from today... if not found break". 
                    // However, legitimate streaks often allow "today not yet solved" if yesterday was solved.
                    // BUT user instruction: "start from today, and find... if found increase... else break".
                    // This implies if today is 0, streak is 0. 
                    // Let's stick to the requested logic: Start today.

                    while (true) {
                        const y = checkDate.getFullYear();
                        const m = String(checkDate.getMonth() + 1).padStart(2, '0');
                        const day = String(checkDate.getDate()).padStart(2, '0');
                        const dateStr = `${y}-${m}-${day}`;

                        // Check if we have data for this date and count > 0
                        // The graph data might be sparse (only days with submissions) or dense (all days).
                        // API usually returns sparse for "solved" queries or distinct dates, but graph endpoint returns 'all' in range?
                        // Let's rely on the set of dates where count > 0.
                        if (solvedDatesSet.has(dateStr)) {
                            currentStreak++;
                            checkDate.setDate(checkDate.getDate() - 1);
                        } else {
                            // If today is 0, we break immediately -> streak 0.
                            // If user wanted "streak includes yesterday if today is pending", they'd say check yesterday.
                            // The instruction was explicit.
                            break;

                            // Re-reading user instruction: "start from today... if found, increase... if not found, break"
                            // If I haven't solved today, my streak is broken/0.
                            // If I solved today, I check yesterday.
                        }
                    }

                    // Longest Streak
                    // We can iterate through the sorted data and count consecutive days.
                    // Note: sortedData might be sparse. We need to check day differences.
                    let longestStreak = 0;
                    let tempStreak = 0;

                    // Get only dates with > 0 solutions, sorted
                    const activeDates = sortedData
                        .filter(item => item.count > 0)
                        .map(item => new Date(item.date).getTime())
                        .sort((a, b) => a - b);

                    if (activeDates.length > 0) {
                        tempStreak = 1;
                        longestStreak = 1;

                        for (let i = 1; i < activeDates.length; i++) {
                            const prev = activeDates[i - 1];
                            const curr = activeDates[i];

                            const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

                            if (diff === 1) {
                                tempStreak++;
                            } else if (diff > 1) {
                                tempStreak = 1;
                            }

                            if (tempStreak > longestStreak) longestStreak = tempStreak;
                        }
                    }

                    calculatedStats = {
                        currentStreak,
                        longestStreak,
                        todaySolved: todayCount,
                        maxSolvedOneDay: maxSolved
                    };
                }

                setStats(calculatedStats);

            } catch (error) {
                console.error("Error fetching streak data:", error);
            }
        };

        fetchData();
    }, [user, currentDate]);

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
