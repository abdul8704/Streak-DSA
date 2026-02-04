import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    { date: "Week 1", leetcode: 1500, codeforces: 1200, atcoder: 900 },
    { date: "Week 2", leetcode: 1520, codeforces: 1240, atcoder: 920 },
    { date: "Week 3", leetcode: 1515, codeforces: 1280, atcoder: 950 },
    { date: "Week 4", leetcode: 1540, codeforces: 1250, atcoder: 980 },
    { date: "Week 5", leetcode: 1580, codeforces: 1300, atcoder: 1000 },
    { date: "Week 6", leetcode: 1600, codeforces: 1320, atcoder: 1050 },
    { date: "Week 7", leetcode: 1590, codeforces: 1350, atcoder: 1040 },
    { date: "Week 8", leetcode: 1620, codeforces: 1400, atcoder: 1100 },
];

const ContestGraph = () => {
    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full flex flex-col transition-colors">
            <h2 className="text-lg font-bold mb-4 text-primary">Contest Ratings</h2>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Line type="monotone" dataKey="leetcode" stroke="#fbbf24" strokeWidth={2} name="LeetCode" dot={false} />
                        <Line type="monotone" dataKey="codeforces" stroke="#3b82f6" strokeWidth={2} name="Codeforces" dot={false} />
                        <Line type="monotone" dataKey="atcoder" stroke="#ef4444" strokeWidth={2} name="AtCoder" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ContestGraph;
