import {
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProfileInfoSkeleton } from '@/app/ui/skeletons';
import CustomersTable from '@/app/ui/customers/table';
// import { fetchTopCustomers } from '@/app/lib/data';
import { FormattedCustomersTable } from '@/app/lib/definitions';
import Image from 'next/image';
import { lusitana } from '@/app/ui/fonts';

export const metadata: Metadata = {
    title: 'Profile',
};

export default function Page() {
    // const topCustomers = fetchTopCustomers();
    const topCustomers: FormattedCustomersTable[] = [];
    return (
        <div className="max-w-4xl mx-auto">
            <Suspense fallback={<ProfileInfoSkeleton />}>
                <div className="relative flex flex-col md:flex-row items-center bg-gray-50 rounded-lg h-50 mt-3">
                    {/* Profile Picture */}
                    <div className="w-fit h-40 overflow-hidden flex justify-center items-center p-5">
                        {/* Profile Picture Placeholder */}
                        <Image
                            src="/profile.png"
                            alt="Profile Picture"
                            className="rounded-full"
                            width={160}
                            height={160}
                        />
                    </div>

                    {/* Profile Details */}
                    <div className="flex flex-col w-full h-full items-start justify-start p-5">
                        <div className='flex justify-between w-full'>
                            <h1 className={`${lusitana.className} text-3xl font-semibold text-gray-800 w-fit`}>John Doe</h1>
                            {/* Edit Profile Button */}
                            <button className="flex items-center text-gray-500 text-sm px-2 hover:text-gray-700 focus:outline-none">
                                Edit Profile
                                <PencilSquareIcon className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                        <p className="text-gray-600 w-fit">user@vyayam.com</p>
                        <br />
                        <p>Mumbai, India</p>
                        <code>AFIPO6644P</code>
                    </div>
                </div>
            </Suspense>

            {/* Top Customers Section */}
            <div className="mt-10">
                <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                    Top Customers
                </h1>
                <CustomersTable customers={topCustomers} />
            </div>
        </div>
    );
}
