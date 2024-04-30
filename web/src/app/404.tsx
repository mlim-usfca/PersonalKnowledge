// pages/404.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Custom404 = () => {
    const router = useRouter();
    
    useEffect(() => {
        setTimeout(() => {
            router.push('/');
        }, 5000);
    }, [router]);

    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        </div>
    );
};

export default Custom404;
