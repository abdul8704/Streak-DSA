import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Easy', value: 120, total: 924, color: '#00af9b' }, // Cyan
    { name: 'Medium', value: 80, total: 2002, color: '#ffb800' }, // Yellow
    { name: 'Hard', value: 15, total: 906, color: '#ff2d55' }, // Red
];

// Calculate totals
const solvedCount = data.reduce((acc, curr) => acc + curr.value, 0);
const totalQuestions = data.reduce((acc, curr) => acc + curr.total, 0);

const DifficultyBreak = () => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm h-full grid grid-cols-4 gap-4 items-center">

            {/* Col 1 (1/4): Solved Count / Total */}
            <div className="col-span-1 flex flex-col justify-center items-center">
                <div className="text-gray-400 text-sm font-medium mb-1">Solved</div>
                <div className="text-4xl font-extrabold text-gray-800 leading-none">
                    {solvedCount}
                </div>
                <div className="text-gray-400 text-sm font-medium mt-1">
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
                        <div className="bg-gray-50 rounded-lg p-2 flex flex-col justify-center">
                            <span className="text-xs font-medium" style={{ color: item.color }}>{item.name}</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-gray-700">{item.value}</span>
                                <span className="text-xs text-gray-400">/{item.total}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DifficultyBreak;
