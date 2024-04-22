import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { useAuth } from '@/app/auth/provider';
import { useRouter } from 'next/navigation';
import NewLinkModal from "./newlink";
import NewCategoryModal from "./newcategory";
import { Category } from '@/app/interfaces';
import { addLinkToCategory, fetchCategoriesAsync } from '@/app/archive/categorySlice';
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import LinkPreview from "../app/archive/linkPreview";

const SavedContent: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const router = useRouter();
    const categories = useAppSelector((state) => state.categories.categories);
    const [isNewLinkModalOpen, setIsNewLinkModalOpen] = useState(false);
    const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/');
            return;
        }
        const loadData = async () => {
            try {
                await dispatch(fetchCategoriesAsync(user?.id));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        loadData();
    }, []);

    const handleClick = (name: string) => {
        setSelectedCategory(name);
        setIsNewLinkModalOpen(true);
    };

    const handleNewLink = async (link: string, category: string) => {
        if (!user) return;
        await dispatch(addLinkToCategory({ link, user, category }));
    }

    return (
        <div>
            <div className="w-full flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Categories</h2>
                <button
                    className="px-3 py-2 text-xs text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
                    onClick={() => setIsNewCategoryModalOpen(true)}
                >New Category</button>
                {isNewCategoryModalOpen && (
                    <NewCategoryModal onClose={() => setIsNewCategoryModalOpen(false)} />
                )}
                {isNewLinkModalOpen && (
                    <NewLinkModal 
                        onClose={() => setIsNewLinkModalOpen(false)} 
                        category={selectedCategory}
                        handleNewLink={(link: string) => handleNewLink(link, selectedCategory)}
                    />
                )}
            </div>
            <div className="mt-5">
                <div className="w-full">
                    <div className="grid grid-flow-rows gap-3 mx-auto w-full rounded-2xl bg-indigo-200 p-2 drop-shadow shadow-lg">                
                        {categories.map((category: Category) => (
                            <div key={category.id}>
                                <Disclosure>
                                    {({ open }) => (
                                        <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-indigo-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                            <div className="my-auto">{category.name}</div>
                                            <div className="flex gap-4">
                                                <div
                                                    className="text-md px-3 py-1 rounded-full bg-purple-200 hover:bg-white"
                                                    onClick={() => handleClick(category.name)}
                                                >Add New Link +</div>
                                                <ChevronUpIcon className={`${
                                                        open ? 'rotate-180 transform' : ''
                                                    } h-5 w-5 my-auto text-purple-500`}
                                                />
                                            </div>
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="grid gap-3 px-3 pb-2 pt-4 text-sm text-gray-500">
                                            {category.links.map((link: string, index) => (
                                                <LinkPreview key={index} link={link} />
                                            ))}
                                            {category.links.length === 0 && (
                                                <div className="text-center text-gray-700">No links saved in this category yet... Add one now! </div>
                                            )}
                                        </Disclosure.Panel>
                                        </>
                                    )}
                                </Disclosure>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedContent;