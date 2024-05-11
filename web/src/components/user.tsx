import React from "react";
import { useAuth } from '@/app/auth/provider';
import { useTranslator } from '@/app/translator/provider';
import { useRouter } from 'next/navigation';
import { deleteChats } from "@/app/chats/functions";
import Footer from "./footer";

const UserPage: React.FC = () => {
    const router = useRouter();
    const { t } = useTranslator();
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
                    <img src={user?.user_metadata.avatar_url} alt="User Avatar" width={300} height={300} className="rounded-full" />
                </div>
                <h2 className="text-xl font-medium my-3">Hi, {user?.user_metadata.full_name}!</h2>
                <button onClick={handleSignOut} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                {t('signout')}
                </button>
            </div>
            <Footer/>
        </div>
    );
};

export default UserPage;