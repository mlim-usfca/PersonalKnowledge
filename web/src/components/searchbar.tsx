import React, { useState, useEffect } from 'react';
import ArrowRight from '../components/icons/IconArrowRight';
import { Tags } from '@/app/interfaces';
import { fetchTags } from '@/app/api';

type SearchbarProps = {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: (message: string) => void;
};

const Searchbar: React.FC<SearchbarProps> = ({message, setMessage, sendMessage}) => {
    const [tags, setTags] = useState<Tags[]>([]);

    useEffect(() => {
        const loadData = async () => {
          try {
            const data = await fetchTags();
            setTags(data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        loadData();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(message);
        setMessage('');
    }

    return (
        <div>
          <div className="text-gray-500 font-medium text-left text-xs my-2">
            Elaborate with...
          </div>
          <div className="flex justify-left items-center flex-wrap gap-1.5">
            {tags.map((tag) => (
              <button
                key={tag.id}
                className="flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm text-gray-500 border border-gray-300 shadow-sm hover:bg-gray-100"
                onClick={() => sendMessage(`${tag.name}`)}
              >
                {tag.emoji} {tag.name}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex relative mt-2">
            <input
              type="text"
              placeholder="Search something..."
              className="mt-1 px-3 py-1.5 md:py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-100 focus:ring focus:ring-indigo-100 focus:ring-opacity-50"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-14 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" height="15px" width="15px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="m495,466.1l-119.2-119.2c29.1-35.5 46.5-80.8 46.5-130.3 0-113.5-92.1-205.6-205.6-205.6-113.6,0-205.7,92.1-205.7,205.7s92.1,205.7 205.7,205.7c49.4,0 94.8-17.4 130.3-46.5l119.1,119.1c8,8 20.9,8 28.9,0 8-8 8-20.9 0-28.9zm-443.2-249.4c-1.42109e-14-91 73.8-164.8 164.8-164.8 91,0 164.8,73.8 164.8,164.8s-73.8,164.8-164.8,164.8c-91,0-164.8-73.8-164.8-164.8z"/>
              </svg>
            </div>
            <button type="submit" className='rounded-full w-auto bg-white shadow ml-2 px-2'>
               <ArrowRight />
            </button>
          </form>
        </div>
    );
};

export default Searchbar;