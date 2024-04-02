'use client'

import Image from "next/image";
import { useState } from "react";
import Dashboard from "@/components/dashboard";
import Landing from "@/components/landing";
import ReduxProvider from "@/store/redux-provider";

export default function Home() {
  const isAuthenticated = true;

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
