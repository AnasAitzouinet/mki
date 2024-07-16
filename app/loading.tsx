"use client";

import { LoaderCircleIcon } from 'lucide-react';
import React from 'react'

export default function Loading() {
    return (
        <div className='fixed top-1/2 left-1/2'>
            <LoaderCircleIcon className='animate-spin  w-[3rem] h-[3rem] ' />
        </div>
    )
}

 