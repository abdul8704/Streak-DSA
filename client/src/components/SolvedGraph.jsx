import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

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
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [range, setRange] = useState('last-7-days');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const response = await axios.get(`http://localhost:5000/api/user-data/${user.username}/graph`, {
                    params: { range }
                });
                const apiData = response.data;
                // Assuming apiData is array of { date, count } or similar.
                // If it needs processing, we do it here.
                // Assuming backend returns ready-to-use data for recharts or we map it.
                // Using previous logic structure if backend returns raw dictionary:
console.log(apiData);
                let processedData = [];
                if (Array.isArray(apiData)) {
                    processedData = apiData;
                } else if (typeof apiData === 'object') {
                    processedData = Object.entries(apiData).map(([dateStr, count]) => {
                        const date = new Date(dateStr);
                        const month = date.toLocaleString('default', { month: 'short' });
                        const day = date.getDate().toString().padStart(2, '0');
                        return {
                            date: `${month} ${day}`,
                            solved: count,
                            timestamp: date.getTime()
                        };
                    }).sort((a, b) => a.timestamp - b.timestamp);
                }

                setData(processedData);
            } catch (error) {
                console.error("Error fetching graph data:", error);
            }
        };

        fetchData();
    }, [user, range]);

    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full flex flex-col transition-colors">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-primary">Activity</h2>
                <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="bg-card-hover text-sm border border-border rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="last-30-days">Last 30 Days</option>
                    <option value="last-90-days">Last 90 Days</option>
                    <option value="all-time">All Time</option>
                </select>
            </div>

            <div className="flex-1 w-full min-h-[px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                            interval={range === 'last 90 days' || range === 'all time' ? 5 : 2}
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
                            dataKey="count"
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
