import React, { useState, useEffect } from "react";
import NewLinkModal from "./newlink";
import { SavedLink } from '@/app/interfaces';
import { fetchSavedLinks } from '@/app/api';


const SavedContent: React.FC = () => {
    const [links, setLinks] = useState<SavedLink[]>([]);
    const [isNewLinkModalOpen, setIsNewLinkModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchSavedLinks('1');
                setLinks(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        loadData();
    }, []);

    return (
        <div>
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Saved Links</h2>
                <button
                    className="px-3 py-2 text-xs text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
                    onClick={() => setIsNewLinkModalOpen(true)}
                >+</button>
            </div>
            {isNewLinkModalOpen && (
                <NewLinkModal onClose={() => setIsNewLinkModalOpen(false)} />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* <div className="flex flex-wrap gap-4"> */}
                {links.map((link: SavedLink) => (
                    <div key={link.id} className="bg-white p-4 shadow rounded-md w-full">
                        <h3 className="text-lg font-medium">{link.title}</h3>
                        <a href={link.url} className="text-xs text-indigo-600">{link.url}</a>
                        <div className="flex flex-wrap justify-left items-center flex-wrap gap-1.5 mt-2">
                            {link.tags.map((tag: { id: string, emoji: string, name: string }) => (
                                <button
                                    key={tag.id}
                                    className="flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm text-gray-500 border border-gray-300 shadow-sm hover:bg-gray-100"
                                >
                                    {tag.emoji} {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default SavedContent;