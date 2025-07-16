"use client"

import * as React from "react"
import {
    LayoutDashboard,
    FileVolume,
    FileClock,
    FileWarning,
    BadgeIndianRupee,
    FileInput,
    Files,
    Command,
    LifeBuoy,
    Send,
    CircleUser,
    Users,
    UserPen,
    UserSearch
} from "lucide-react"

import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Logo from "../Logo"

const data = {
    user: {
        name: "Darshan Odedara",
        gstn: "22AAHFO1234F1Z5",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Invoices",
            url: "/dashboard/invoices",
            icon: Files,
            items: [
                {
                    title: "Payments",
                    url: "/dashboard/invoices/payments",
                    icon: BadgeIndianRupee,
                },
                {
                    title: "Pending",
                    url: "/dashboard/invoices/pending",
                    icon: FileWarning,
                },
                {
                    title: "Requests",
                    url: "/dashboard/invoices/requests",
                    icon: FileInput,
                },
                {
                    title: "Sent",
                    url: "/dashboard/invoices/sent",
                    icon: FileVolume,
                },
                {
                    title: "History",
                    url: "/dashboard/invoices/history",
                    icon: FileClock,
                }
            ],
        },
        {
            title: "Users",
            url: "/dashboard/users",
            icon: Users,
            items: [
                {
                    title: "Find User",
                    url: "/dashboard/users/find_user",
                    icon: UserSearch,
                },
            ]
        },
        {
            title: "Profile",
            url: "/dashboard/profile",
            icon: CircleUser,
            items: [
                {
                    title: "Update Profile",
                    url: "/dashboard/profile/update",
                    icon: UserPen,
                },
            ]
        },
    ],
    navSecondary: [
        {
            title: "Support",
            url: "/dashboard/support",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "/dashboard/feedback",
            icon: Send,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Logo/>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
