import React, { useEffect, useState } from 'react';

const Calendar = () => {
    const [calendarData, setCalendarData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/leetcode/heatmap', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: "abdulaziz120" })
                });
                const apiData = await response.json();

                const today = new Date();
                const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

                let iterDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                const data = [];

                while (iterDate <= today) {
                    const year = iterDate.getFullYear();
                    const month = iterDate.getMonth();
                    const monthName = iterDate.toLocaleString('default', { month: 'short' });
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const startDay = new Date(year, month, 1).getDay();

                    const days = [];
                    for (let d = 1; d <= daysInMonth; d++) {
                        const currentDate = new Date(year, month, d);
                        const isBeforeStart = currentDate < startDate;
                        const isAfterToday = currentDate > today;

                        if (isBeforeStart || isAfterToday) {
                            days.push({ day: d, intensity: -1 });
                        } else {
                            // Construct date key "D MMM YYYY"
                            const dayStr = d;
                            const monthStr = currentDate.toLocaleString('default', { month: 'short' });
                            const yearStr = year;
                            const dateKey = `${dayStr} ${monthStr} ${yearStr}`;

                            const count = apiData[dateKey] || 0;

                            // Determine intensity based on count
                            // 0 -> 0, 1-3 -> 2/3, 4+ -> 4/5 logic or simple mapping
                            let intensity = 0;
                            if (count === 0) intensity = 0;
                            else if (count <= 2) intensity = 2; // mild green
                            else if (count <= 5) intensity = 4; // medium green
                            else intensity = 6; // bright green

                            days.push({
                                day: d,
                                intensity: intensity
                            });
                        }
                    }

                    data.push({
                        name: monthName,
                        year: year,
                        startDay,
                        days
                    });
                    iterDate.setMonth(iterDate.getMonth() + 1);
                }

                setCalendarData(data);
            } catch (error) {
                console.error("Failed to fetch heatmap data:", error);
            }
        };

        fetchData();
    }, []);

    const getColor = (intensity) => {
        if (intensity === -1) return 'bg-transparent';
        if (intensity === 0) return 'bg-gray-300 dark:bg-[#393939]'; // 0 submissions
        if (intensity <= 2) return 'bg-[#0e4429] dark:bg-[#0e4429]'; // 1-2 submissions
        if (intensity <= 4) return 'bg-[#006d32] dark:bg-[#006d32]'; // 3-5 submissions
        if (intensity >= 5) return 'bg-[#39d353] dark:bg-[#39d353]'; // 6+ submissions

        return 'bg-gray-300 dark:bg-[#393939]'; // default fallback
    };

    return (
        <div className="bg-card p-5 rounded-xl shadow-sm border border-border h-full flex flex-col overflow-hidden transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-primary">Submission Calendar <span className="text-sm font-normal text-secondary ml-2">(Past Year)</span></h2>
                <div className="flex items-center gap-2 text-xs text-secondary">
                    <span>Less</span>
                    <div className="w-3 h-3 bg-gray-300 dark:bg-[#393939] rounded-sm"></div>
                    <div className="w-3 h-3 bg-[#016620] rounded-sm"></div>
                    <div className="w-3 h-3 bg-[#109932] rounded-sm"></div>
                    <div className="w-3 h-3 bg-[#28C244] rounded-sm"></div>
                    <div className="w-3 h-3 bg-[#7FE18B] rounded-sm"></div>
                    <span>More</span>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-3 min-w-max">
                    {calendarData.map((month, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                            <span className="text-xs text-secondary font-medium text-center block">
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
