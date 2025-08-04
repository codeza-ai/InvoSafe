"use client";

import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

export default function ProfileCard() {
    const { data: session } = useSession();
        
    const user = useMemo(() => ({
        name: session?.user?.business_name || "",
        gstin: session?.user?.gstin || "",
        avatar: session?.user?.profile_url || "",
    }), [session?.user]);
    return (
        <Card className="border-1 border-gray-300 p-6 w-full">
            <CardContent className="flex flex-col gap-4">
                {/* <h2 className="text-2xl text-gray-500 font-semibold">Your Business Profile</h2> */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-col justify-evenly h-40">
                        <div>
                            <Label className="text-black text-4xl ">{user.name}</Label>
                        </div>
                        <div>
                            <Label className="text-gray-500 text-3xl ">{user.gstin}</Label>
                        </div>
                    </div>
                    <Avatar className="border-2 border-gray-200 w-40 h-40">
                        <AvatarImage src="/avatar.jpg" alt="Profile Picture" />
                        <AvatarFallback className="rounded-e-full text-gray-300 text-4xl">DS</AvatarFallback>
                    </Avatar>
                </div>
                <span className="border-1 border-gray-200 w-full"></span>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3 py-3">
                        <Label className="text-black text-l">Description of Business</Label>
                        <p className="text-xl text-gray-500">Domestic courier service with over 2000+ service locations. Nation-wide fast and reliable courier service.</p>
                    </div>
                    <div className="flex flex-col gap-3 py-3">
                        <Label className="text-black text-l">Address</Label>
                        <p className="text-xl text-gray-500">Jayraj Vasahat, Near Canara Bank, Hazira, Surat, Gujarat, 394510</p>
                    </div>
                    <div className="flex flex-col gap-3 py-3">
                        <Label className="text-black text-l">Contact Information</Label>
                        <ul className="text-xl text-gray-500">
                            <li>darshan.odedara@gmail.com</li>
                            <li>6351382297</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
