import React from 'react';
import axios from 'axios';
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
    const [platform, setPlatform] = React.useState('leetcode');
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Determine color based on platform for the single line
                let color = '#fbbf24'; // leetcode default
                if (platform === 'codeforces') color = '#3b82f6';
                if (platform === 'atcoder') color = '#ef4444';

                const response = await axios.post(`http://localhost:5000/api/${platform}/contest`, {
                    username: "abdulaziz120"
                });

                const rawData = response.data;

                // Process data: map to simple array for Recharts
                // Expecting array of objects with { contest: { title }, rating, ... }
                // We'll map to { name: title, value: rating }
                const processedData = rawData.map(item => ({
                    name: item.contest.title,
                    value: item.rating,
                    tooltipInfo: item // store full item for custom tooltip if needed
                }));

                setData(processedData);
            } catch (error) {
                console.error("Failed to fetch contest data:", error);
                setData([]); // clear data on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [platform]);

    const getLineColor = () => {
        switch (platform) {
            case 'codeforces': return '#3b82f6';
            case 'atcoder': return '#ef4444';
            default: return '#fbbf24'; // leetcode
        }
    };

    return (
        <div className="bg-card p-6 rounded-xl shadow-sm border border-border h-full flex flex-col transition-colors">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-primary">Contest Ratings</h2>
                <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="bg-card-hover text-sm border border-border rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="leetcode">LeetCode</option>
                    <option value="codeforces">Codeforces</option>
                    <option value="atcoder">AtCoder</option>
                </select>
            </div>

            <div className="w-full flex-1 min-h-0">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-secondary">Loading...</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                            <XAxis
                                dataKey="name"
                                hide={true} // Hide X axis labels if they are too long (contest titles often are)
                                axisLine={false}
                                tickLine={false}
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
                                itemStyle={{ color: getLineColor() }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={getLineColor()}
                                strokeWidth={2}
                                name={platform.charAt(0).toUpperCase() + platform.slice(1)}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default ContestGraph;
