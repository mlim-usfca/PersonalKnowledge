'use client';

import React, { useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Tab } from '@headlessui/react';
import Chat from '@/app/chats/chat';
import { useAuth } from '@/app/auth/provider';
import SavedContent from '@/components/savedcontent';
import UserPage from '@/components/user';
import { UserIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, []);

  return (
    <div className="flex flex-col px-4 sm:px-10 md:px-24 h-screen overflow-hidden">
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="flex-none mt-12 sm:mt-16 mb-8">
        <Image src="/DragonAI.png" alt="DragonAI Logo" width={200} height={200} />
      </div>
      <Tab.Group>
        <Tab.Panels className="h-full grow overflow-auto">
          <Tab.Panel className="h-full"><SavedContent /></Tab.Panel>
          <Tab.Panel className="h-full"><Chat /></Tab.Panel>
          <Tab.Panel className="h-full"><UserPage /></Tab.Panel>
        </Tab.Panels>
        <div className='flex-none w-full mx-auto mt-3 pb-4'>
          <Tab.List className="grid grid-cols-5 gap-1 w-full bg-gray-100 rounded-lg px-1 text-center">
          <Tab className={({ selected }) =>
              classNames(
                "col-span-2 rounded-lg px-1 my-1",
                selected
                  ? 'bg-white text-indigo-700 shadow'
                  : 'hover:bg-white/[0.12] hover:text-indigo-500'
              )
            }>Saves</Tab>
            <Tab className={({ selected }) =>
              classNames(
                "col-span-2 rounded-lg px-1 my-1",
                selected
                  ? 'bg-white text-indigo-700 shadow'
                  : 'hover:bg-white/[0.12] hover:text-indigo-500'
              )
            }>Chat</Tab>
            <Tab className={({ selected }) =>
              classNames(
                "col-span-1 rounded-lg my-1",
                selected
                  ? 'bg-white text-indigo-700 shadow'
                  : 'hover:bg-white/[0.12] hover:text-indigo-500'
              )
            }>
              <UserIcon className="h-5 w-5 mx-auto"/>
            </Tab>
          </Tab.List>
        </div>
      </Tab.Group>
    </div>
  );
};

export default Dashboard;
