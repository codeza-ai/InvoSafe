"use client"

import { SidebarIcon } from "lucide-react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/ModeToggle"
import { signOut } from "next-auth/react"

export function SiteHeader() {
    const { toggleSidebar } = useSidebar()
    // Get the current pathname from Next.js router
    // and split it into segments for breadcrumb navigation
    const pathname = usePathname()
    const pathSegments = pathname.split("/").filter(Boolean)

    // Handle logout with key cleanup
    const handleLogout = async () => {
        try {
            
            // Sign out from NextAuth
            await signOut({
                callbackUrl: "/login",
                redirect: true
            });
        } catch (error) {
            console.error("Error during logout:", error);
            // Still attempt to sign out even if key clearing fails
            await signOut({
                callbackUrl: "/login",
                redirect: true
            });
        }
    };

    return (
        <header className="text-xl bg-background sticky top-0 z-50 flex w-full items-center border-b">
            <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
                <Button
                    className="h-8 w-8"
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                >
                    <SidebarIcon />
                </Button>
                <Separator orientation="vertical" className="mr-2 h-4" />

                <Breadcrumb className="hidden sm:block">
                    <BreadcrumbList>
                        {pathSegments.length === 0 ? (
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        ) : (
                            pathSegments.map((segment, idx) => (
                                <div className="flex items-center gap-2" key={idx}>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {idx < pathSegments.length - 1 ? (
                                            <BreadcrumbLink href={"/" + pathSegments.slice(0, idx + 1).join("/")}>
                                                {segment.charAt(0).toUpperCase() + segment.slice(1)}
                                            </BreadcrumbLink>
                                        ) : (
                                            <BreadcrumbPage>
                                                {segment.charAt(0).toUpperCase() + segment.slice(1)}
                                            </BreadcrumbPage>
                                        )}
                                    </BreadcrumbItem>
                                </div>
                            ))
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex h-(--header-height) w-fit items-center gap-2 px-4">
                <Button 
                onClick={handleLogout}
                variant={"default"}>
                    Log Out
                </Button>
                <Separator orientation="vertical" className="m-2 h-4" />
                <ModeToggle/>
            </div>
        </header>
    );
}
