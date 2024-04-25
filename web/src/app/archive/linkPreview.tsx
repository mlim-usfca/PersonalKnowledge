import React, { useEffect, useState } from 'react';

type PreviewData = {
    title?: string;
    description?: string;
    image?: string;
};

interface LinkPreviewProps {
    link: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ link }) => {
    const [previewData, setPreviewData] = useState<PreviewData>({});

    useEffect(() => {
        // Simple function to convert URL slug to title
        const urlToTitle = (url: string) => {
            try {
                // Extract the hostname and path from the URL
                const { hostname, pathname } = new URL(url);
                // Split the path by slashes and hyphens, and decode URI components
                const titleParts = pathname.split(/\/|-|_/).map(part => decodeURIComponent(part));
                // Filter out empty parts and common non-title elements like 'www'
                const filteredParts = titleParts.filter(part => part && part !== 'www');
                // Capitalize the first letter of each part and join them with spaces
                const title = filteredParts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
                if (title) {
                    return `${hostname} | ${title}`;
                }
                return hostname;
            } catch (e) {
                console.error('Error converting URL to title:', e);
                return '';
            }
        };

        // Attempt to create a title from the URL
        const titleFromUrl = urlToTitle(link);

        setPreviewData({
            title: titleFromUrl,
        });
    }, [link]);

    return (
        <div className='bg-yellow-50 hover:bg-orange-50 p-1 shadow rounded-md w-full drop-shadow shadow-md'>
            <a href={link} target="_blank" className="fit-content">
                <div className="rounded-xl p-1">
                    <h3 className="text-md font-medium text-black break-words text-orange-800">
                        {previewData.title}
                    </h3>
                </div>
            </a>
        </div>
    );
};

export default LinkPreview;
