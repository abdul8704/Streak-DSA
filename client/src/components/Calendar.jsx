import React, { useEffect, useState } from 'react';

const Calendar = () => {
    const [calendarData, setCalendarData] = useState([]);

    useEffect(() => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);

        let iterDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
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
            iterDate.setMonth(iterDate.getMonth() + 1);
        }

        setCalendarData(data);
    }, []);
    console.log(calendarData)
    const getColor = (intensity) => {
        if (intensity === -1) return 'bg-transparent';

        if (intensity === 0) return 'bg-gray-100 dark:bg-[#393939]';
        if (intensity === 1) return 'bg-gray-300 dark:bg-[#016620]';
        if (intensity === 2 || intensity === 3) return `bg-green-${intensity === 2 ? '300' : '400'} dark:bg-[#109932]`;
        if (intensity === 4 || intensity === 5) return 'bg-green-500 dark:bg-[#28C244]';
        if (intensity >= 6) return 'bg-green-600 dark:bg-[#7FE18B]';

        return 'bg-gray-100 dark:bg-[#393939]'; // default fallback
    };

    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full flex flex-col overflow-hidden transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-primary">Submission Calendar <span className="text-sm font-normal text-secondary ml-2">(Past Year)</span></h2>
                <div className="flex items-center gap-2 text-xs text-secondary">
                    <span>Less</span>
                    <div className="w-3 h-3 bg-gray-100 dark:bg-[#393939] rounded-sm"></div>
                    <div className="w-3 h-3 bg-gray-300 dark:bg-[#016620] rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-300 dark:bg-[#109932] rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-500 dark:bg-[#28C244] rounded-sm"></div>
                    <div className="w-3 h-3 bg-green-600 dark:bg-[#7FE18B] rounded-sm"></div>
                    <span>More</span>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-8 min-w-max">
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
