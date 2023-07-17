import { useState, useEffect } from 'react';

export default function useTimeAgo(timestamp) {
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        const calculateFormattedTime = () => {
            const currentDate = new Date();
            const previousDate = new Date(timestamp);
            const timeDiff = currentDate.getTime() - previousDate.getTime();
            const seconds = Math.floor(timeDiff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const weeks = Math.floor(days / 7);
            const months = Math.floor(days / 30);
            const years = Math.floor(days / 365);

            if (seconds < 60) {
                setFormattedTime('Just now');
            } else if (minutes < 60) {
                setFormattedTime(`${minutes} minute${minutes === 1 ? '' : 's'} ago`);
            } else if (hours < 24) {
                setFormattedTime(`${hours} hour${hours === 1 ? '' : 's'} ago`);
            } else if (days < 7) {
                setFormattedTime(`${days} day${days === 1 ? '' : 's'} ago`);
            } else if (weeks < 4) {
                setFormattedTime(`${weeks} week${weeks === 1 ? '' : 's'} ago`);
            } else if (months < 12) {
                setFormattedTime(`${months} month${months === 1 ? '' : 's'} ago`)
            } else {
                setFormattedTime(`${years} week${years === 1 ? '' : 's'} ago`)
            }
        };

        calculateFormattedTime();

        const interval = setInterval(calculateFormattedTime, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [timestamp]);

    return formattedTime;
}
