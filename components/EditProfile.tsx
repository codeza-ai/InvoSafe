"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Mail, Phone, MapPin, Building, CreditCard, Camera } from "lucide-react";
import { useAlertActions } from "@/lib/use-alert";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";

export default function EditProfile() {
    const { data: session } = useSession();
    const { showError, showSuccess, showWarning } = useAlertActions();
    const router = useRouter();

    const user = useMemo(() => ({
        name: session?.user?.business_name || "Business Name",
        gstin: session?.user?.gstin || "00AAAAA0000A0Z0",
        avatar: session?.user?.profile_url || "",
        user_id: session?.user?.user_id || "",
        address: session?.user?.business_address || "",
        desc: session?.user?.business_description || "Description of Business",
        email: session?.user?.business_email || "",
        mobile: session?.user?.mobile_number || "",
    }), [session?.user]);

    const [newDesc, setNewDesc] = useState(user.desc || "");
    const [newEmail, setNewEmail] = useState(user.email || "");
    const [profile, setProfile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Clean up preview URL when component unmounts
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const userId = session?.user?.user_id || "";
        if (!userId) {
            showError("User not authenticated.");
            setTimeout(() => {
                router.push("/login");
            }, 3000);
            setIsLoading(false);
            return;
        }
        // Image size must not exceed 2MB
        if (profile && profile.size > 2 * 1024 * 1024) {
            showWarning("Profile picture size must not exceed 2MB.");
            setIsLoading(false);
            return;
        }
        try {
            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("description", newDesc);
            formData.append("email", newEmail);
            
            // Only append profile picture if one is selected
            if (profile) {
                formData.append("profilePicture", profile);
            }

            const response = await fetch("/api/user/update", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                showSuccess("Profile updated successfully!");
                // Optionally refresh the session to get updated data
                window.location.reload();
            } else {
                showError(result.error || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showError("An error occurred while updating profile");
        } finally {
            setIsLoading(false);
        }
    }
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
                                src={previewUrl || user.avatar || "/avatar.jpg"}
                                alt="Profile Picture"
                                className="object-cover"
                            />
                            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-white w-10 h-10 rounded-full border-1 border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                            <Camera className="w-4 h-4 text-black" />
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        setProfile(file);
                                        // Create preview URL
                                        const url = URL.createObjectURL(file);
                                        setPreviewUrl(url);
                                    }
                                }}
                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                            />
                        </div>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
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
                                <Textarea 
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                    placeholder="Enter business description"
                                    className="text-gray-700 leading-relaxed"
                                />
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
                                        <Input 
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        type="email"
                                        className="font-medium text-gray-900"/>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <Phone className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div className="cursor-not-allowed">
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
                        <div className="bg-white p-4 rounded-lg border shadow-sm cursor-not-allowed">
                            <p className="text-gray-700 leading-relaxed">
                                {user.address}
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-end gap-4 mt-4 w-full">
                        <Button
                            className="cursor-pointer"
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setNewDesc(user.desc || "");
                                setNewEmail(user.email || "");
                                setProfile(null);
                                setPreviewUrl(null);
                            }}
                            disabled={isLoading}
                        >
                            Reset
                        </Button>
                        <Button
                            className="cursor-pointer"
                            type="submit"
                            variant="default"
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Profile"}
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card >
    );
}
