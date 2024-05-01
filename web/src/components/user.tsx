import React from "react";
import { useAuth } from '@/app/auth/provider';
import { useRouter } from 'next/navigation';
import { deleteChats } from "@/app/chats/functions";
import Image from "next/image";

const UserPage: React.FC = () => {
    const router = useRouter();
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        if (user) await deleteChats(user);
        router.push('/');
    };

    return (
        <div>
            <div className="w-full flex flex-col items-center justify-center mb-4">
                <div className="h-28 w-28 flex items-center justify-center">
                    <Image src={user?.user_metadata.avatar_url} alt="User Avatar" width={300} height={300} className="rounded-full" />
                </div>
                <h2 className="text-xl font-medium my-3">Hi, {user?.user_metadata.full_name}!</h2>
                <button onClick={handleSignOut} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default UserPage;