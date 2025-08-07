"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "@/db/types/user";
import { Mail, Phone, MapPin, Building, Contact } from "lucide-react";

export default function User({ user }: { user: UserType }) {
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
        <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-col space-y-6">
                    {/* Header Section */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16 border-2 border-gray-200">
                            <AvatarImage
                                src={user.profile_url || ""}
                                alt={`${user.business_name} profile`}
                            />
                            <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                                {getInitials(user.business_name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {user.business_name}
                            </h2>
                            <p className="text-sm text-gray-500 font-mono">
                                GST: {user.gstin}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Details Section */}
                    <div className="space-y-4">
                        {/* Business Description */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4 text-gray-400" />
                                <Label className="text-sm font-bold text-gray-700">
                                    Description of Business
                                </Label>
                            </div>
                            {user.business_description ? 
                                <p className="text-sm text-gray-600 ml-6">
                                    {user.business_description}
                                </p>:
                                <p className="text-sm text-gray-400 ml-6">
                                    No description provided.
                                </p>
                            }
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <Label className="text-sm font-bold text-gray-700">
                                    Address
                                </Label>
                            </div>
                            <p className="text-sm text-gray-600 ml-6">
                                {user.business_address}
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Contact className="w-4 h-4 text-gray-400" />
                                <Label className="text-sm font-bold text-gray-700">
                                    Contact Information
                                </Label>
                            </div>
                            <div className="ml-6 space-y-2">
                                {user.mobile_number && (
                                    <div className="flex items-center space-x-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {user.mobile_number}
                                        </span>
                                    </div>
                                )}
                                {user.business_email && (
                                    <div className="flex items-center space-x-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {user.business_email}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}