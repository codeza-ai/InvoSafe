import * as React from "react"
import { Plus } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarSeparator,
} from "@/components/ui/sidebar"

// import Link from "next/link";
// import { BellRing } from "lucide-react";
// This is sample data.

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
                <div className="text-sm flex items-center justify-between h-full px-4">
                    {/* <Link
                        href="/dashboard/notifications"
                        className="flex items-center gap-2 px-4 font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                        <BellRing />
                        Notifications
                    </Link> */}
                </div>
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
