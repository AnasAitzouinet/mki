"use client"
import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDisplay() {
    return (
        <div className="">
            <div className="w-full flex space-x-2">
                <div className="space-y-4 w-full">
                    <Skeleton className='h-6 w-[8rem]' />                    
                    <Skeleton className='h-6 w-[10rem]' />                    
                     <div className='flex justify-between  w-full  pt-5'>
                        <div className='flex gap-2'>

                        <Skeleton className='h-8 w-[12rem]' />
                        <Skeleton className='h-8 w-[22rem]' />
                        <Skeleton className='h-8 w-[19rem]' />
                        </div>
                        <div className='flex gap-2'>
                        <Skeleton className='h-8 w-[8rem]' />
                        <Skeleton className='h-8 w-[8rem]' />
                        <Skeleton className='h-8 w-[8rem]' />

                        </div>
                     </div>

                </div>
            </div>
            <div className='my-10'>
                <Skeleton className='h-[35rem] w-full' />
            </div>
        </div>
    )
}
