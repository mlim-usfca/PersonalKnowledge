'use client';

import React, { useState } from 'react';
import { supabase } from "./supabase";

type NewLinkModalProps = {
  onClose: () => void;
  category: string;
};

const NewLinkModal: React.FC<NewLinkModalProps> = (props) => {
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for managing loading status

  async function addNewLink() {
    setIsLoading(true); // Start loading
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('User must be logged in to submit links.');
        setIsLoading(false); // Stop loading on error
        return;
      }

      const { data, error: extractError } = await supabase.functions.invoke('extractContent', {
        body: JSON.stringify({ url: link })
      });

      if (extractError) {
        alert("Extract content failed");
        console.error('Extract content failed:', extractError);
        setIsLoading(false); // Stop loading on error
        return;
      }
      console.log("Extracted content:", data);

      const { error: insertError } = await supabase
        .from('links')
        .insert([
          { link: link, owner: user.id, purpose: props.category, owner_email: user.email }
        ]);

      if (insertError) {
        alert("Submit1 failed");
        console.error('Submission failed:', insertError);
        setIsLoading(false); // Stop loading on error
        return;
      }

      const { error: insertError2 } = await supabase
        .from('category_link_relation')
        .insert([
          { link: link, category: props.category, creator: user.id }
        ]);

      if (insertError2) {
        alert("Submit2 failed");
        console.error('Submission2 failed:', insertError2);
        setIsLoading(false); // Stop loading on error
        return;
      }

      props.onClose(); // Close the modal after success
    } catch (error) {
      alert('Couldn\'t submit, try again');
      console.error(error);
    } finally {
      setIsLoading(false); // Stop loading after the process completes
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-10">
      <div className="relative mx-auto mx-4 px-7 py-6 border w-96 shadow-lg rounded-[12px] bg-white">
        <button className="absolute top-0 right-0 p-3" onClick={props.onClose}>
          <svg className="h-6 w-6 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-3xl font-bold leading-6 font-medium text-gray-900 mt-5 mb-3">Save New Link</h3>
        <form className="bg-white rounded pt-6 pb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Link</label>
          <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-200 rounded-md"
            placeholder="Your link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
          <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-200 rounded-md"
            placeholder={props.category}
            value={props.category}
            readOnly
          />
          <button
            className="hover:bg-indigo-700 bg-indigo-600 text-white font-semibold my-2 py-2 px-4 w-full border border-gray-300 rounded shadow"
            type="button"
            onClick={addNewLink}
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
