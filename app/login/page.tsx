'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "@/components/forms/Login"
import Logo from "@/components/Logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircleIcon, InfoIcon, AlertTriangleIcon } from "lucide-react";
import { useAlert } from "@/lib/alert-context";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const { alert } = useAlert();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard"); // if already signed in, go to dashboard
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
        const baseClasses = "z-50 fixed top-5 left-1/2 transform -translate-x-1/2 w-full max-w-md shadow-lg border-2";

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
        <div className="grid min-h-svh lg:grid-cols-2">
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
            
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <div className="flex items-center gap-2 font-medium">
                        <Logo/>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
