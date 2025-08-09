'use client';

import { useState, useEffect } from "react";
import  {InputOTPForm} from "./OTPForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { AlertCircleIcon } from "lucide-react";
import { 
    Alert, 
    AlertTitle, 
    AlertDescription 
} from "@/components/ui/alert";
import { useAlertActions } from "@/lib/use-alert";
import { useRouter } from "next/navigation";

export function RegisterForm() {
    const router = useRouter();
    const [gstin, setGstin] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { showError, showSuccess, showWarning } = useAlertActions();


    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if(!gstin || !password || !confirmPassword) {
            showWarning("Please fill all fields");
            return;
        }

        // GSTIN validation
        if (gstin.trim().length !== 15) {
            showError("GST number must be exactly 15 characters long.");
            return;
        }
        // GST format validation
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(gstin.trim())) {
            showError("Invalid GST number format. Example: 22AAAAA0000A1Z5");
            return;
        }

        if(password !== confirmPassword) {
            showError("Passwords do not match");
            return;
        }
        // Add your form submission logic here, e.g., API call to register user
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                gstin,
                user_id : crypto.randomUUID(), // Generate a unique user ID
                password, // Send plain text password - server will hash it
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            showError(`Error: ${errorData.message}`);
            return;
        }else{
            showSuccess("Registration successful! Please login.");
            setTimeout(()=>{
                router.push("/login");
            }, 3000);
        }
    }
    return (
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Tabs defaultValue="register">
                <TabsList>
                    <TabsTrigger value="register">Register</TabsTrigger>
                    <TabsTrigger value="verification">Verification</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>GST Number</CardTitle>
                            <CardDescription>
                                An OTP will be sent to the associated mobile number for verification.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <form className="flex flex-col gap-6">
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <Input 
                                        value={gstin}
                                        onChange={(e) => setGstin(e.target.value)}
                                        id="gstin" type="text" placeholder="Eg. 22AAAAA0000A1Z5" required />
                                    </div>
                                    <Button type="submit" className="w-full">
                                        Continue
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Alreadt registered?{" "}
                                    <Link href="/login" className="underline underline-offset-4">
                                        Login
                                    </Link>
                                    {" "}now.
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="verification">
                    <Card>
                        <CardHeader>
                            <CardTitle>Verification</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="flex flex-col gap-6">
                                <InputOTPForm/>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="password">
                    <Card>
                        <CardHeader>
                            <CardTitle>Set password</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="password">Enter password</Label>
                                <Input 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password" type="password" placeholder="Must be atleast 8 characters." required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="conf-password">Confirm password</Label>
                                <Input 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                id="conf-password" type="password" placeholder="Must match the password above." required />
                            </div>
                            <Button
                                onClick={handleSubmit}
                            >Register</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
