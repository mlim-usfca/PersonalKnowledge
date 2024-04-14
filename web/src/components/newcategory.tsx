'use client';

import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { supabase } from './supabase';

type NewCategoryModalProps = {
  onClose: () => void;
};

// type for intent options
type IntentOption = {
  id: number;
  name: string;
};

const intents = [
  { id: 1, name: 'To visit' },
  { id: 2, name: 'To eat' }
]

const NewCategoryModal: React.FC<NewCategoryModalProps> = (props) => {

  const [category, setCategory] = useState('');

  const handleSubmit = () => {
    props.onClose();
  };

  async function addNewCategory() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('User must be logged in to submit links.');
        return;
      }
      const { error: insertError } = await supabase
        .from('categories')
        .insert([
            {category_name: category, user_id: user.id}
        ])
      
      if (insertError) {
          throw new Error('Submission failed');
      } else {
          props.onClose();
      }
    } catch (error) {
      alert('Couldn\'t submit, try again');
      console.error(error);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-10">
      <div className="relative mx-auto mx-4 px-7 py-6 border w-96 shadow-lg rounded-[12px] bg-white">
        <button
          className="absolute top-0 right-0 p-3"
          onClick={props.onClose}
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
          Save New Category
        </h3>
        <form
          className="bg-white rounded pt-6 pb-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 focus:outline-
            none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-200 rounded-md"
            placeholder="Your category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button
            className="hover:bg-indigo-700 bg-indigo-600 text-white font-semibold my-2 py-2 px-4 w-full border border-gray-300 rounded shadow"
            type="button"
            onClick={addNewCategory}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewCategoryModal;
