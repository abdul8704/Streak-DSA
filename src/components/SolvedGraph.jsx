import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
    { date: "Jan 20", solved: 2 },
    { date: "Jan 21", solved: 5 },
    { date: "Jan 22", solved: 3 },
    { date: "Jan 23", solved: 8 },
    { date: "Jan 24", solved: 4 },
    { date: "Jan 25", solved: 6 },
    { date: "Jan 26", solved: 9 },
    { date: "Jan 27", solved: 2 },
    { date: "Jan 28", solved: 7 },
    { date: "Jan 29", solved: 5 },
    { date: "Jan 30", solved: 4 },
    { date: "Jan 31", solved: 6 },
    { date: "Feb 01", solved: 1 },
    { date: "Feb 02", solved: 5 }
];

const SolvedGraph = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // TODO: Replace sample data with API call
        setData(sampleData);
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Activity (Last 14 Days)</h2>
            <div className="flex-1 w-full min-h-[px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            interval={2}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="solved"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SolvedGraph;
