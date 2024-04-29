'use client'

import ReduxProvider from "@/store/redux-provider";
import { AuthProvider } from '@/app/auth/provider';
import { TranslationProvider } from "@/app/contexts/translationProvider";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AuthProvider>
            <TranslationProvider>
              {children}
            </TranslationProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
