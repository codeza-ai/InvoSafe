"use client";

import { SessionProvider } from "next-auth/react";
import { AlertProvider } from "@/lib/alert-context";
import * as React from "react"
// import { ThemeProvider as NextThemesProvider } from "next-themes"

export function Providers({
    children
}: { children: React.ReactNode }) {
    return (
        <AlertProvider>

        <SessionProvider>
            {/* <NextThemesProvider 
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
                > */}
                {children}
            {/* </NextThemesProvider> */}
        </SessionProvider>
        </AlertProvider>
    );
}