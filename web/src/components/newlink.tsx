'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { useAuth } from '@/app/auth/provider';
import { useRouter } from 'next/navigation';
import { SavedLink, Tags } from '@/app/interfaces';
import { addSavedLinkAsync } from '@/store/savedContentSlice';
import { selectTagByName, fetchTagsAsync } from '@/store/tagsSlice';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { pipeline } from "@xenova/transformers";
import { Document } from "langchain/document";
import { supabase } from "./supabase";
import { TokenTextSplitter } from "langchain/text_splitter";

type NewLinkModalProps = {
  onClose: () => void;
  category: string;
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
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tags, status: tagsStatus, error: tagsError } = useAppSelector(
    (state) => state.tags
  );
  const [link, setLink] = useState('');
  const [intent, setIntent] = useState(intents[0].name);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      dispatch(fetchTagsAsync('1'));
  }, [dispatch]);

  const handleSubmit = () => {
    // const tag = selectTagByName(intent);
    // const tag = useAppSelector((state) => selectTagByName(state, intent));
    const tag = { id: '10', name: 'to eat', emoji: '🍽️' }
    if (!tag) {
      throw new Error('No tag found for intent:'+ intent);
    }
    const savedLink: SavedLink = {
      id: intent + '123',
      title: link,
      url: link,
      tags: [tag]
    };
    dispatch(addSavedLinkAsync({userId: '1', savedLink}));
    props.onClose();
  };

  async function addNewLink() {
    setIsLoading(true);

    if (!user) {
      router.push('/');
    }
    
    try {
      // Now, call the 'extractContent' edge function
      const { data: data, error: extractError } = await supabase.functions.invoke('extractContent', {
        body: JSON.stringify({ url: link }) 
      });
  
      if (extractError) {
        alert("Extract content failed");
        console.error('Extract content failed:', extractError);
        setIsLoading(false);
        return;
      }
      console.log("Extracted content:", data);

      // Proceed to insert the link into the database, including the extracted content
      const { error: insertError } = await supabase
        .from('links')
        .insert([
          { link: link, owner: user?.id, purpose: intent, owner_email: user?.email}
        ]);

      // Check if the insert operation was successful and data is returned
      if (!insertError) {
        const { data: link_data} = await supabase
        .from('links')
        .select('id')
        .eq('link', link);
        // Assuming 'id' is the name of your auto-generated primary key column
        const linkId = link_data[0].id;

        await createEmbedding(data.content, linkId);
      } else {
        alert("Submit1 failed");
        console.error('Submission failed:', insertError);
        setIsLoading(false);
      }
      
      const { error: insertError2 } = await supabase
      .from('category_link_relation')
      .insert([
        { link: link, category: props.category, creator: user?.id}
      ]);
  
      if (insertError2) {
        alert("Submit2 failed");
        setIsLoading(false);
        console.error('Submission2 failed:', insertError2);
      } else {
        // Assuming `props.onClose` is a function to close a modal or dialog
        if (props && typeof props.onClose === 'function') {
          props.onClose();
        }
      }
  
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
          Save New Link
        </h3>
        {/* <p>
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
            >
              {tag.name}
            </span>
          ))}
        </p> */}
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
            placeholder={props.category}
            value={props.category}
            onChange={(e) => setLink(e.target.value)}
            readOnly
          />
          {/* <label className="block text-gray-700 text-sm font-bold my-2">
            Category
          </label>
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
          </Listbox> */}
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

async function createEmbedding(extractedContent: string, linkId: string) {
  try {
      // Split and embed the extracted content
      const splitter = new TokenTextSplitter({
          encodingName: "gpt2",
          chunkSize: 300,
          chunkOverlap: 20,
      });

      const contentChunks = await splitter.splitDocuments([
          new Document({
              pageContent: extractedContent,
              metadata: {
                  linkId: linkId,
              },
          }),
      ]);
      // Initialize the pipeline with the desired model
      const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small');

      // Process each content chunk and generate embeddings
      const embeddingsPromises = contentChunks.map(async (chunk) => {
        try {
          const content = chunk.pageContent;
          const output = await generateEmbedding(content, {
            pooling: 'mean',
            normalize: true,
          });
          const embedding = JSON.stringify(Array.from(output.data));
          return { embedding, content };
        } catch (error) {
            console.error("Error generating embedding for chunk:", error);
            throw error;
        }
      });

      // Wait for all embeddings to be generated
      const embeddings = await Promise.all(embeddingsPromises);

      await storeEmbeddings(embeddings, linkId)
      
      console.log("Embeddings created and stored successfully for link ID:", linkId);
  } catch (error) {
      console.error("Error creating and storing embeddings:", error);
      throw error;
  }
}

async function storeEmbeddings(embeddings: any[], linkId: string) {
  try {
      const { data, error } = await supabase
          .from("document_sections")
          .insert(embeddings.map(({ embedding, content }) => ({
              embedding: embedding,
              content: content,
              link_id: linkId
          })));
      if (error) {
          console.error("Error storing embeddings in Supabase:", error);
          throw error;
      }

      console.log("Embeddings stored in Supabase successfully.");
  } catch (error) {
      console.error("Error storing embeddings in Supabase:", error);
      throw error;
  }
}