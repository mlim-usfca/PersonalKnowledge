'use client'

import Landing from "@/components/landing";
import { useEffect, useLayoutEffect } from 'react';
import { useAuth } from '@/app/auth/provider'
import { useRouter } from 'next/navigation';
import MyLanguage from '@/app/translator/translation';
import Footer from '@/components/footer';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  useLayoutEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="h-screen bg-gray-50 r-0 flex flex-col items-stretch">
      <Landing/>
      <Footer />
    </main>
  );
}
