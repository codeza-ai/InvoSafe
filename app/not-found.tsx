'use client';

import { Button } from '@/components/ui/button';
import { MoveLeftIcon, CloudAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <div className='text-center h-fit w-fit p-5 gap-5'>
                <div className="p-4">
                    <CloudAlert className='w-16 h-16 mx-auto' />
                </div>
                <h2>Not Found</h2>
                <p>Could not find requested resource</p>
                <Button
                    onClick={() => router.back()}
                >
                    <MoveLeftIcon className='mr-2' />
                    Go Back
                </Button>
            </div>
        </div>
    )
}