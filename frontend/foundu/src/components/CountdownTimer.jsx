import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const CountdownTimer = ({ deadline, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        if (!deadline) return null;
        const difference = +new Date(deadline) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = { expired: true };
        }

        return timeLeft;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const newTime = calculateTimeLeft();
            setTimeLeft(newTime);
            if (newTime?.expired && onExpire) {
                onExpire();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    if (!timeLeft) return null;

    if (timeLeft.expired) {
        return (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-[10px] font-black uppercase tracking-widest">
                <AlertCircle size={14} /> Time's Up! Deadline Passed
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Clock size={14} className="text-blue-400" />
                <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white">{timeLeft.days}d</span>
                    <span className="text-white">{timeLeft.hours}h</span>
                    <span className="text-white">{timeLeft.minutes}m</span>
                    <span className="text-white animate-pulse text-blue-400">{timeLeft.seconds}s</span>
                    <span className="text-gray-500 ml-1">Remaining</span>
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;
