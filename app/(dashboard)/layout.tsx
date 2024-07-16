"use client"
import Navbar from '@/components/Dashboard/Navbar'
import React from 'react'
import { Toaster } from "@/components/ui/toaster"


export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen w-full flex-col" suppressHydrationWarning>
            <Navbar />
            <main className="flex flex-1 h-full flex-col gap-4 p-4 md:gap-8 md:p-8">
                {children}
            </main>
        </div>
    )
}
