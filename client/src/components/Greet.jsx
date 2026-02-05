import React from 'react';

const Greet = () => {
    return (
        <div className="bg-card p-4 rounded-xl shadow-sm border border-border h-full flex flex-col justify-center">
            <h1 className="text-xl font-bold text-primary">Welcome back, Vaval 👋</h1>
            <p className="text-secondary">Keep up the streak!</p>
        </div>
    );
};

export default Greet;
