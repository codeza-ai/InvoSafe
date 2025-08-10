import * as React from "react"
import { Plus } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    calendars: [
        {
            name: "My Calendars",
            items: ["Personal", "Work", "Family"],
        },
        {
            name: "Favorites",
            items: ["Holidays", "Birthdays"],
        },
        {
            name: "Other",
            items: ["Travel", "Reminders", "Deadlines"],
        },
    ],
}

export function SidebarRight({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible="none"
            className="sticky top-(--header-height) border-l h-[calc(100svh-var(--header-height))]"
            {...props}
        >
            <SidebarHeader className="border-sidebar-border h-16 border-b">
            </SidebarHeader>
            <SidebarContent
                className="gap-0"
            >
                <Calendar
                    mode="single"
                    captionLayout="dropdown"
                />
                <SidebarSeparator className="mx-0" />
            </SidebarContent>
            <SidebarFooter>
                {/* Page specific tips */}
            </SidebarFooter>
        </Sidebar>
    )
}
