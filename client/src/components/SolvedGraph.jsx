import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/leetcode/daily', {
                    username: "abdulaziz120"
                });
                const data = response.data;

                const processedData = Object.entries(data).map(([dateStr, count]) => {
                    const date = new Date(dateStr);
                    // Format: "Jan 20"
                    const month = date.toLocaleString('default', { month: 'short' });
                    const day = date.getDate().toString().padStart(2, '0');
                    return {
                        date: `${month} ${day}`,
                        solved: count,
                        timestamp: date.getTime()
                    };
                })
                    .sort((a, b) => a.timestamp - b.timestamp)
                    .slice(-14); // Last 14 days

                setData(processedData);
            } catch (error) {
                console.error("Error fetching graph data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full flex flex-col transition-colors">
            <h2 className="text-lg font-bold mb-4 text-primary">Activity (Last 14 Days)</h2>
            <div className="flex-1 w-full min-h-[px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                            interval={2}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: 'var(--text-primary)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="solved"
                            stroke="var(--text-accent)"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: 'var(--bg-card)', stroke: 'var(--text-accent)' }}
                            activeDot={{ r: 6, fill: 'var(--text-accent)' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SolvedGraph;
