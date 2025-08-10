"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { Mail, Phone, MapPin, Building, CreditCard, UserPen } from "lucide-react";

export default function ProfileCard() {
    const { data: session } = useSession();
        
    const user = useMemo(() => ({
        name: session?.user?.business_name || "Business Name",
        gstin: session?.user?.gstin || "00AAAAA0000A0Z0",
        avatar: session?.user?.profile_url || "",
        user_id: session?.user?.user_id || "",
        address: session?.user?.business_address || "",
        desc: session?.user?.business_description || "No description available",
        email: session?.user?.business_email || "No email",
        mobile: session?.user?.mobile_number || "",
    }), [session?.user]);

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="pb-0">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    {/* Avatar Section */}
                    <div className="relative">
                        <Avatar className="w-32 h-32 border-1 ring-1 ring-gray-200">
                            <AvatarImage 
                                src={user.avatar} 
                                alt="Profile Picture" 
                                className="object-cover"
                            />
                            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Business Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                {user.name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-sm font-mono bg-blue-50 text-blue-700 border-blue-200">
                                        <CreditCard className="w-3 h-3 mr-1" />
                                        GST: {user.gstin}
                                    </Badge>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                        Verified Business
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        
                        {/* Quick Stats */}
                        {/* <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                                <div className="text-2xl font-bold text-blue-600">2000+</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Locations</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                                <div className="text-2xl font-bold text-green-600">5★</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Rating</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm border">
                                <div className="text-2xl font-bold text-purple-600">24/7</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Support</div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                <Separator className="mb-6" />
                
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Business Description */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Building className="w-5 h-5 text-blue-600" />
                            <Label className="text-lg font-semibold text-gray-900">
                                Desription
                            </Label>
                        </div>
                        <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <p className="text-gray-700 leading-relaxed">
                                {user.desc}
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Phone className="w-5 h-5 text-blue-600" />
                            <Label className="text-lg font-semibold text-gray-900">
                                Contact Information
                            </Label>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{user.email}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <Phone className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{user.mobile}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <Label className="text-lg font-semibold text-gray-900">
                            Address
                        </Label>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <p className="text-gray-700 leading-relaxed">
                            {user.address}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
