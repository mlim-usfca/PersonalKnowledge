import React from "react";
// import { supabase } from "./supabase";
import { useAuth } from '@/app/auth/provider';
import { useRouter } from 'next/navigation';

const UserPage: React.FC = () => {
    const router = useRouter();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div>
            <div className="w-full justify-between items-center mb-4">
                <h2 className="text-xl font-medium mb-1">User Page</h2>
                <div className="text-lg mb-5">{user?.email}</div>
                <button onClick={handleSignOut}className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default UserPage;