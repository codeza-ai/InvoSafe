"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { UserType } from "@/db/types/user";
import User from "@/components/User";
import { useAlertActions } from "@/lib/use-alert";
import { Search, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FindUserPage() {
    const [gst, setGst] = useState("");
    const { showError, showSuccess, showWarning } = useAlertActions();
    const [user, setUser] = useState<UserType | null>(null);
    const [isSearching, setIsSearching] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUser(null);

        // Client-side validation
        if (!gst.trim()) {
            showWarning("Please enter a GST number to search for a user.");
            return;
        }

        if (gst.trim().length !== 15) {
            showError("GST number must be exactly 15 characters long.");
            return;
        }

        // GST format validation
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(gst.trim())) {
            showError("Invalid GST number format. Example: 22AAAAA0000A1Z5");
            return;
        }

        setIsSearching(true);

        try {
            const response = await fetch("/api/user/find", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    gstin: gst.trim().toUpperCase(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                showError(data.error || "An error occurred while searching for the user.");
                return;
            }

            if (data.user) {
                setUser(data.user);
            } else {
                setUser(null);
                showError("No user found with the provided GST number.");
            }
        } catch (error) {
            console.error("Search error:", error);
            showError("Network error. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header Section */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Find User</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Search for users by their GST number to view their business profile and information.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                <Card className="shadow-sm border-0 bg-white">
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Search Bar */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="gst"
                                    value={gst}
                                    onChange={(e) => setGst(e.target.value.toUpperCase())}
                                    type="text"
                                    placeholder="Enter GST Number (e.g., 22AAAAA0000A1Z5)"
                                    maxLength={15}
                                    className={`pl-12 pr-4 py-3 text-lg h-14 rounded-xl border-2 transition-all duration-200 ${
                                        gst.length > 0 && gst.length !== 15 
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                                    }`}
                                />
                                {gst.length > 0 && (
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                        <span className={`text-sm font-medium ${
                                            gst.length === 15 ? "text-green-600" : "text-gray-500"
                                        }`}>
                                            {gst.length}/15
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Validation Message */}
                            {gst.length > 0 && gst.length !== 15 && (
                                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                    GST number must be exactly 15 characters long
                                </div>
                            )}

                            {/* Search Button */}
                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    disabled={isSearching || gst.length !== 15}
                                    size="lg"
                                    className="px-8 py-3 text-lg h-12 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                                >
                                    {isSearching ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5 mr-2" />
                                            Search User
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Results Section */}
                {user && (
                    <div className="mt-8">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
                            <p className="text-gray-600">Found user matching your search criteria</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border">
                            <User user={user} />
                        </div>
                    </div>
                )}

                {/* Empty State when no search performed */}
                {!user && !isSearching && gst.length === 0 && (
                    <div className="mt-12 text-center">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to search</h3>
                        <p className="text-gray-500">Enter a GST number above to find user information</p>
                    </div>
                )}
            </div>
        </div>
    );
}