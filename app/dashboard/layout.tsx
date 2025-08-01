'use client';

// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/sidebar/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    // const { data: session, status } = useSession();
    // const router = useRouter();

    // useEffect(() => {
    //     if (status === 'unauthenticated') {
    //         router.push('/login');
    //     }
    // }, [status, router]);

    // if (status === 'loading') return <p>Loading...</p>;
    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader/>
                <div className="flex flex-1">
                    <AppSidebar />
                    <SidebarInset>
                        <div className="flex justify-center items-start w-full py-8">
                            {children}
                        </div>
                    </SidebarInset>
                </div>
                {/* <SidebarRight /> */}
            </SidebarProvider>
        </div>
    )
}
