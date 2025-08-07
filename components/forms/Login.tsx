'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react";
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useEffect } from "react";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [gstin, setGstin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter();

    // Auto-clear error after 3 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!gstin || !password) {
            setError("Please fill all fields");
            return;
        }

        // GSTIN validation
        if (gstin.trim().length !== 15) {
            setError("GST number must be exactly 15 characters long.");
            return;
        }
        // GST format validation
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(gstin.trim())) {
            setError("Invalid GST number format. Example: 22AAAAA0000A1Z5");
            return;
        }
        // Send plain text password to NextAuth - it will handle the hashing comparison
        const result = await signIn("credentials", {
            gstin,
            password, // Send plain text password, not hashed
            redirect: false // Prevent automatic redirect to handle errors
        });

        if (result?.error) {
            console.log("Login error:", result.error);
            alert("Invalid credentials. Please check your GST number and password.");
        } else {
            router.push("/dashboard");
        }
    }
    return (
        <>
            <Alert 
            className={error? "z-10 absolute top-5 left-1/2 transform -translate-x-1/2 w-full max-w-md": "hidden"}
            variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Credentials invalid.</AlertTitle>
                <AlertDescription>
                    <p>Please check credentials.</p>
                    <ul className="list-inside list-disc text-sm">
                        <li>{error}</li>
                    </ul>
                </AlertDescription>
            </Alert>
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
                    <div className="grid gap-3">
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
                        type="submit" className="w-full">
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
        </>
    )
}
