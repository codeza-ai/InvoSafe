'use client';
// import { AppWindowIcon, CodeIcon } from "lucide-react"

// import { useState } from "react";
import  {InputOTPForm} from "./OTPForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export function RegisterForm() {
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
                                        <Input id="gst" type="text" placeholder="Eg. 22AAAAA0000A1Z5" required />
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
                                <Input id="password" type="text" placeholder="Must be atleast 8 characters." required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="conf-password">Confirm password</Label>
                                <Input id="conf-password" type="text" placeholder="Must match the password above." required />
                            </div>
                            <Button>Save password</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
