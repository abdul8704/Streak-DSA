import React from 'react';
import Greet from './Greet';
import Calendar from './Calendar';
import DifficultyBreak from './DifficultyBreak';
import SolvedGraph from './SolvedGraph';
import ContestGraph from './ContestGraph';
import StreakCalendar from './StreakCalendar';

const Dashboard = () => {
    return (
        <div className="h-full p-6 bg-surface overflow-y-auto flex flex-col gap-6">
            {/* Top Section: Main Grid */}
            <div className="grid grid-cols-3 gap-6 flex-shrink-0">

                {/* Left Column (2/3 width) - Greet, Difficulty, Solved */}
                <div className="col-span-2 flex flex-col gap-6">
                    <div className="h-32">
                        <Greet />
                    </div>
                    <div className="h-64">
                        <DifficultyBreak />
                    </div>
                    <div className="h-[300px]">
                        <SolvedGraph />
                    </div>
                </div>

                {/* Right Column (1/3 width) - StreakCalendar, ContestGraph */}
                <div className="col-span-1 flex flex-col gap-6">
                    <div className="flex-[2] min-h-[400px]">
                        <StreakCalendar />
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <ContestGraph />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Submission Heatmap (Full Width) */}
            <div className="w-full h-64 flex-shrink-0">
                <Calendar />
            </div>
        </div>
    );
};

export default Dashboard;
