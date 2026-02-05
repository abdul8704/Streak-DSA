import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Easy', value: 120, total: 924, color: 'var(--color-easy)' },
    { name: 'Medium', value: 80, total: 2002, color: 'var(--color-medium)' },
    { name: 'Hard', value: 15, total: 906, color: 'var(--color-hard)' },
];

// Calculate totals
const solvedCount = data.reduce((acc, curr) => acc + curr.value, 0);
const totalQuestions = data.reduce((acc, curr) => acc + curr.total, 0);

const DifficultyBreak = () => {
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
                            data={data}
                            innerRadius={"70%"}
                            outerRadius={"90%"}
                            startAngle={90}
                            endAngle={-270}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Col 4 (1/4): Difficulty Stats */}
            <div className="col-span-1 flex flex-col justify-center gap-2">
                {data.map((item) => (
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
