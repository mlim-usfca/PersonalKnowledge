'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/auth/provider';
import { useRouter } from 'next/navigation';
import { addNewLink } from '@/app/archive/functions';

type NewLinkModalProps = {
  onClose: () => void;
  category: string;
  handleNewLink: (link: string) => void;
};

const NewLinkModal: React.FC<NewLinkModalProps> = ({ onClose, category, handleNewLink }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [link, setLink] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!user) {
      router.push('/');
      return;
    }

    const error = await addNewLink(
      link,
      user,
      category
    );
    if (!error) {
      handleNewLink(link);
      console.log('New link added');
    }
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-10">
      <div className="relative mx-auto mx-4 px-7 py-6 border w-96 shadow-lg rounded-[12px] bg-white">
        <button
          className="absolute top-0 right-0 p-3"
          onClick={onClose}
        >
          <svg
            className="h-6 w-6 text-gray-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-3xl font-bold leading-6 font-medium text-gray-900 mt-5 mb-3">
          Save New Link
        </h3>
        <form
          className="bg-white rounded pt-6 pb-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Link
          </label>
          <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 focus:outline-
            none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-200 rounded-md"
            placeholder="Your link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 focus:outline-
            none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-200 rounded-md"
            placeholder={category}
            value={category}
            onChange={(e) => setLink(e.target.value)}
            readOnly
          />
          <button
            className="hover:bg-indigo-700 bg-indigo-600 text-white font-semibold my-2 py-2 px-4 w-full border border-gray-300 rounded shadow"
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewLinkModal;