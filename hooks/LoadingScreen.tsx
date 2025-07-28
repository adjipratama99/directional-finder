import { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

export default function LoadingScreen() {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
        }, 500); // Ganti titik setiap 500ms
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col gap-4 h-full justify-center items-center">
                <FaSpinner className="animate-spin" size={72} color="#2b7fff" />
                <div className="text-2xl">Please wait {dots}</div>
            </div>
        </div>
    );
}
