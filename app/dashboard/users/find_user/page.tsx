"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { UserType } from "@/db/types/user";
import User from "@/components/User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FindUserPage() {
    const [gst, setGst] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState<UserType | null>(null);
    const [isSearching, setIsSearching] = useState(false);

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
        e.preventDefault();

        // Clear previous results
        setUser(null);
        setError("");

        // Client-side validation
        if (!gst.trim()) {
            setError("Please enter a GST number to search for a user.");
            return;
        }

        if (gst.trim().length !== 15) {
            setError("GST number must be exactly 15 characters long.");
            return;
        }

        // GST format validation
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstRegex.test(gst.trim())) {
            setError("Invalid GST number format. Example: 22AAAAA0000A1Z5");
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
                setError(data.error || "An error occurred while searching for the user.");
                return;
            }

            if (data.user) {
                setUser(data.user);
                setError("");
            } else {
                setUser(null);
                setError("No user found with the provided GST number.");
            }
        } catch (error) {
            console.error("Search error:", error);
            setError("Network error. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="flex flex-col p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 flex w-full">
                <div className="flex  w-full gap-5">
                    <div className="space-y-2 min-w-10">
                        <Input
                            id="gst"
                            value={gst}
                            onChange={(e) => setGst(e.target.value.toUpperCase())}
                            type="text"
                            placeholder="Eg. 22AAAAA0000A1Z5"
                            maxLength={15}
                            className={gst.length > 0 && gst.length !== 15 ? "border-red-500 w-full" : "w-full"}
                        />
                        {gst.length > 0 && (
                            <div className="text-xs text-gray-500">
                                {gst.length}/15 characters
                            </div>
                        )}
                    </div>
                    <Button
                        type="submit"
                        disabled={isSearching}
                    >
                        {isSearching ? "Searching..." : "Search User"}
                    </Button>
                </div>
                {/* Error Display */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}
            </form>


            {/* User Display */}
            {user && (
                <div className="w-full max-w-2xl">
                    <User user={user} />
                </div>
            )}
        </div>
    );
}