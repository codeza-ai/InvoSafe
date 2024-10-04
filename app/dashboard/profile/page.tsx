// import Image from 'next/image';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProfileInfoSkeleton } from '@/app/ui/skeletons';
export const metadata: Metadata = {
    title: 'Profile',
};

export default function Page() {
    return (
        <div>
            <Suspense fallback={<ProfileInfoSkeleton />}>
                <div className='w-full rounded-lg bg-gray-10 h-60'>
                    <div className='w-40 h-40 bg-gray-50 rounded-full'>
                        {/* <Image
                    alt="Profile Picture"
                    className="rounded-full"
                    width={100}
                    height={100}
                /> */}
                    </div>
                </div>
            </Suspense>
            <div className='mt-5 w-full'>
                <h1>Top customers</h1>
                <div>

                </div>
            </div>
        </div>
    );
}