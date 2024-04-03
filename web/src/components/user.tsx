import React from "react";
import { supabase } from "./supabase";

const UserPage: React.FC = () => {
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        } else {
            // Optionally, redirect the user or update the UI upon successful sign out
            console.log('Signed out successfully');
        }
    };

    return (
        <div>
            <div className="w-full justify-between items-center mb-4">
                <h2 className="text-xl font-medium mb-5">User Page</h2>
                <button onClick={handleSignOut}className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default UserPage;