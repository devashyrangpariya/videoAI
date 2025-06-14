/**
 * Providers Component
 * 
 * Wraps the application with all necessary context providers.
 * Includes NextAuth session provider and theme provider.
 */

'use client';

import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./ThemeProvider";

const urlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ImageKitProvider urlEndpoint={urlEndPoint}>
          {children}
          <Toaster position="top-right" />
        </ImageKitProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
