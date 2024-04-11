'use client';

import React, { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { supabase } from './supabase';

type NewLinkModalProps = {
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

const NewLinkModal: React.FC<NewLinkModalProps> = (props) => {

  const [link, setLink] = useState('');
  const [intent, setIntent] = useState(intents[0].name);

  const handleSubmit = () => {
    props.onClose();
  };

  async function addNewLink() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
  
      if (!user) {
        alert('User must be logged in to submit links.');
        return;
      }
  
      // Now, call the 'extractContent' edge function
      const { data: data, error: extractError } = await supabase.functions.invoke('extractContent', {
        body: JSON.stringify({ url: link }) 
      });
  
      if (extractError) {
        alert("Extract content failed");
        console.error('Extract content failed:', extractError);
        return;
      }
      console.log("Extracted content:", data);
  
      // Proceed to insert the link into the database, including the extracted content
      const { error: insertError } = await supabase
        .from('links')
        .insert([
          { link: link, owner: user.id, purpose: intent, owner_email: user.email, content: data.content }
        ]);
  
      if (insertError) {
        alert("Submit failed");
        console.error('Submission failed:', insertError);
      } else {
        // Assuming `props.onClose` is a function to close a modal or dialog
        if (props && typeof props.onClose === 'function') {
          props.onClose();
        }
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
          Save New Content
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
          <label className="block text-gray-700 text-sm font-bold my-2">
            Intent
          </label>
          {/* <input
            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 focus:outline-
            none focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-200 rounded-md"
            placeholder="Your intent"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
          /> */}
          <Listbox value={intent} onChange={setIntent}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{intent}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {intents.map((option) => (
                    <Listbox.Option
                      key={option.id}
                      value={option.name}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                              }`}
                          >
                            {option.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          <button
            className="hover:bg-indigo-700 bg-indigo-600 text-white font-semibold my-2 py-2 px-4 w-full border border-gray-300 rounded shadow"
            type="button"
            onClick={addNewLink}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewLinkModal;
