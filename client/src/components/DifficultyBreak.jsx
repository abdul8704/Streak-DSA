import React from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const DifficultyBreak = () => {
    const { user } = useAuth();
    const [stats, setStats] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            try {
                const response = await axios.post('http://localhost:5000/api/leetcode/solved', {
                    username: user.username
                });
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="h-full flex items-center justify-center text-secondary">Loading...</div>;
    }

    // Process data for charts
    const chartData = stats
        .filter(item => item.difficulty !== 'All')
        .map(item => {
            let color;
            if (item.difficulty === 'Easy') color = 'var(--color-easy)';
            else if (item.difficulty === 'Medium') color = 'var(--color-medium)';
            else if (item.difficulty === 'Hard') color = 'var(--color-hard)';

            return {
                name: item.difficulty,
                value: item.count,
                total: item.submissions,
                color: color
            };
        });

    const allStats = stats.find(item => item.difficulty === 'All') || { count: 0, submissions: 0 };
    const solvedCount = allStats.count;
    const totalQuestions = allStats.submissions;

    return (
        <div className="bg-card p-4 rounded-xl shadow-sm border border-border h-full grid grid-cols-4 gap-4 items-center transition-colors">

            {/* Col 1 (1/4): Solved Count / Total */}
            <div className="col-span-1 flex flex-col justify-center items-center">
                <div className="text-secondary text-sm font-medium mb-1">Solved</div>
                <div className="text-4xl font-extrabold text-primary leading-none">
                    {solvedCount}
                </div>
                <div className="text-secondary text-sm font-medium mt-1">
                    / {totalQuestions}
                </div>
            </div>

            {/* Col 2 & 3 (2/4 -> 1/2): Pie Chart */}
            <div className="col-span-2 h-full relative min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            innerRadius={"70%"}
                            outerRadius={"90%"}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Col 4 (1/4): Difficulty Stats */}
            <div className="col-span-1 flex flex-col justify-center gap-2">
                {chartData.map((item) => (
                    <div key={item.name} className="flex flex-col">
                        <div className="bg-card-hover rounded-lg p-2 flex flex-col justify-center">
                            <span className="text-xs font-medium" style={{ color: item.color }}>{item.name}</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-primary">{item.value}</span>
                                <span className="text-xs text-secondary">/{item.total}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DifficultyBreak;
