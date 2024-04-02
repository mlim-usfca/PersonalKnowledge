'use client'

import Dashboard from "@/components/dashboard";
import Landing from "@/components/landing";
import ReduxProvider from "@/store/redux-provider";
import { useState, useEffect } from 'react';
import { supabase } from '../components/supabase'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    
  }, []);

  return (
    <ReduxProvider>
      <main className="h-screen bg-gray-50 r-0">
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <Landing />
        )}
      </main>
    </ReduxProvider>
  );
}
