import React, { useEffect, useState } from 'react';

const Calendar = () => {
    const [calendarData, setCalendarData] = useState([]);

    useEffect(() => {
        // Start date: Today minus 1 year
        const today = new Date();
        const startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);

        // We iterate through each month from startDate to today
        const data = [];

        // Create a pointer date starting at the first day of the start month
        // But we need to handle the case where startDate is mid-month. 
        // User said "start from (today's date, last year)".
        // Meaning if today is Feb 4 2026, start Feb 4 2025.
        // But the UI is month-blocked. Separation of months.
        // If we start Feb 4, do we skip Feb 1-3?
        // LeetCode-style usually just shows the block for that month. 
        // If we want to be precise, we can mark days before Feb 4 as "invisible" or "empty".

        // Determine the start month pointer
        let iterDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

        // Loop until we cover the month of today
        while (iterDate <= today) {
            const year = iterDate.getFullYear();
            const month = iterDate.getMonth();
            const monthName = iterDate.toLocaleString('default', { month: 'short' });
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDay = new Date(year, month, 1).getDay(); // for padding

            const days = [];
            for (let d = 1; d <= daysInMonth; d++) {
                const currentDate = new Date(year, month, d);

                // Check bounds
                // Is it before startDate?
                // startDate is inclusive "today's date, last year"
                const isBeforeStart = currentDate < startDate;
                // Is it after today?
                const isAfterToday = currentDate > today;

                if (isBeforeStart || isAfterToday) {
                    // Empty or invisible
                    days.push({ day: d, intensity: -1 });
                } else {
                    // Valid range
                    days.push({
                        day: d,
                        intensity: Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0
                    });
                }
            }

            data.push({
                name: monthName,
                year: year,
                startDay,
                days
            });

            // Increment month
            iterDate.setMonth(iterDate.getMonth() + 1);
        }

        setCalendarData(data);
    }, []);

    const getColor = (intensity) => {
        // -1 means out of range (future OR before 1 year ago)
        if (intensity === -1) return 'bg-gray-50';

        switch (intensity) {
            case 1: return 'bg-green-200';
            case 2: return 'bg-green-400';
            case 3: return 'bg-green-600';
            case 4: return 'bg-green-800';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-700">Submission Calendar <span className="text-sm font-normal text-gray-400 ml-2">(Past Year)</span></h2>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Less</span>
                    <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
                    <span>More</span>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-8 min-w-max">
                    {calendarData.map((month, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                            <span className="text-xs text-gray-400 font-medium text-center block">
                                {month.name}
                            </span>

                            <div className="grid grid-rows-7 grid-flow-col gap-1">
                                {Array.from({ length: month.startDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="w-3 h-3"></div>
                                ))}

                                {month.days.map((day) => (
                                    <div
                                        key={day.day}
                                        className={`w-3 h-3 rounded-sm ${getColor(day.intensity)}`}
                                        title={`${month.name} ${day.day}, ${month.year}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
