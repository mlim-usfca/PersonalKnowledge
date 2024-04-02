import React from "react";

const UserPage: React.FC = () => {
    return (
        <div>
            <div className="w-full justify-between items-center mb-4">
                <h2 className="text-xl font-medium mb-5">User Page</h2>
                <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default UserPage;