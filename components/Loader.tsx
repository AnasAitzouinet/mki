"use client";

import React from 'react'

export default function Loader() {
    return (
         <div className='fixed z-50 top-0 left-0 w-screen h-screen bg-transparent backdrop-blur-xl'>
            <div className='flex items-center justify-center h-full'>
                <div className='w-20 h-20 border-4 border-t-4 border-gray-200 rounded-full animate-spin'></div>
            </div>
         </div>
    )
}
