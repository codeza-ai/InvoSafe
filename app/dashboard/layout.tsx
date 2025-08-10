'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/sidebar/site-header"
import { SidebarRight } from "@/components/sidebar/sidebar-right"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircleIcon, InfoIcon, AlertTriangleIcon } from "lucide-react";
import { AlertProvider, useAlert } from "@/lib/alert-context";

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const { alert } = useAlert();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // Get icon based on variant
    const getAlertIcon = () => {
        switch (alert.variant) {
            case 'destructive':
                return <AlertCircleIcon className="h-4 w-4" />;
            case 'success':
                return <CheckCircleIcon className="h-4 w-4" />;
            case 'warning':
                return <AlertTriangleIcon className="h-4 w-4" />;
            default:
                return <InfoIcon className="h-4 w-4" />;
        }
    };

    // Get alert title based on variant
    const getAlertTitle = () => {
        switch (alert.variant) {
            case 'destructive':
                return 'Error!';
            case 'success':
                return 'Success!';
            case 'warning':
                return 'Warning!';
            default:
                return 'Info';
        }
    };
    // Get alert styling based on variant
    const getAlertStyling = () => {
        const baseClasses = "z-100 fixed top-5 left-1/2 transform -translate-x-1/2 w-full max-w-md shadow-lg border-2";
        
        switch (alert.variant) {
            case 'success':
                return `${baseClasses} border-green-200 bg-green-50`;
            case 'warning':
                return `${baseClasses} border-yellow-200 bg-yellow-50`;
            case 'destructive':
                return `${baseClasses} border-red-200 bg-red-50`;
            default:
                return `${baseClasses} border-blue-200 bg-blue-50`;
        }
    };

    // Map custom variants to available Alert variants
    const getAlertVariant = () => {
        switch (alert.variant) {
            case 'destructive':
                return 'destructive';
            case 'success':
            case 'warning':
            case 'default':
            default:
                return 'default';
        }
    };

    return (
        <>
            {/* Alert Display */}
            <Alert
                className={alert.isVisible ? getAlertStyling() : "hidden"}
                variant={getAlertVariant()}>
                {getAlertIcon()}
                <AlertTitle>{getAlertTitle()}</AlertTitle>
                <AlertDescription>
                    {alert.message}
                </AlertDescription>
            </Alert>

            {/* Main Layout */}
            <div className="[--header-height:calc(--spacing(14))]">
                <SidebarProvider className="flex flex-col">
                    <SiteHeader />
                    <div className="flex flex-1">
                        <AppSidebar />
                        <SidebarInset>
                            <div className="flex justify-center items-start w-full py-8">
                                {children}
                            </div>
                        </SidebarInset>
                        <SidebarRight/>
                    </div>
                </SidebarProvider>
            </div>
        </>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AlertProvider>
            <DashboardContent>{children}</DashboardContent>
        </AlertProvider>
    );
}
