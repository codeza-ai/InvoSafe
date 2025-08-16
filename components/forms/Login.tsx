'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react";
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useAlertActions } from "@/lib/use-alert";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const { showError, showSuccess, showWarning } = useAlertActions();
    const [verified, setVerified] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [gstin, setGstin] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();

    const verifyGstin = async (e: React.MouseEvent) => {
        e.preventDefault();
        setProcessing(true);
        if (!gstin) {
            showWarning("Please enter a GST number to login.");
            setProcessing(false);
            return;
        }

        // GSTIN validation
        if (gstin.trim().length !== 15) {
            showError("GST number must be exactly 15 characters long.");
            setProcessing(false);
            return;
        }

        // GST format validation
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(gstin.trim())) {
            showError("Invalid GST number format. Example: 22AAAAA0000A1Z5");
            setProcessing(false);
            return;
        }
        try {
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    gstin,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                showError(data.error || "An error occurred while verifying the GST number.");
                setProcessing(false);
                return;
            }
            // Store key attributes in localStorage
            localStorage.setItem("keyAttributes", JSON.stringify(data.keyAttributes));
            showSuccess("GST number verified successfully!");
            setVerified(true);
        } catch (error) {
            console.error("Login error:", error);
            showError("An unexpected error occurred. Please try again.");
        }

        setVerified(true);
        setProcessing(false);
    };

    // Auto-clear error after 3 seconds
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setProcessing(true);
        if (!gstin || !password) {
            showWarning("Please fill all fields");
            setProcessing(false);
            return;
        }

        // GSTIN validation
        if (gstin.trim().length !== 15) {
            showError("GST number must be exactly 15 characters long.");
            setProcessing(false);
            return;
        }
        // GST format validation
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(gstin.trim())) {
            showError("Invalid GST number format. Example: 22AAAAA0000A1Z5");
            setProcessing(false);
            return;
        }
        
        try {
            // Send plain text password to NextAuth - it will handle the hashing comparison
            const result = await signIn("credentials", {
                gstin,
                password, // Send plain text password, not hashed
                redirect: false // Prevent automatic redirect to handle errors
            });

            if (result?.error) {
                console.log("Login error:", result.error);
                showError("Invalid credentials. Please check your GST number and password.");
                setProcessing(false);
                return;
            }
            showSuccess("Login successful! Redirecting...");
            setTimeout(() => {
                router.push("/dashboard");
            }, 3000);
        } catch (error) {
            console.error("Login error:", error);
            showError("An unexpected error occurred. Please try again.");
        }
    }
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to InvoSafe</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your GST number below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="gst">GST Number</Label>
                    <Input
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        id="gst" type="text" placeholder="Eg. 22AAAAA0000A1Z5" required />
                </div>
                <div
                    className={verified ? "hidden" : "block"}
                >
                    <Button
                        onClick={verifyGstin}
                        className="w-full">
                        Verify
                    </Button>
                </div>
                <div className={cn("grid gap-3", verified ? "block" : "hidden")}>
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                            Forgot your password?
                        </a>
                    </div>
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password" type="password" required />
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={!verified || processing}
                    className={cn("w-full", processing ? "opacity-50 cursor-not-allowed" : "")}
                >
                    Login
                </Button>
            </div>
            <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="underline underline-offset-4">
                    Register
                </Link>
                {" "}now.
            </div>
        </form>
    )
}
