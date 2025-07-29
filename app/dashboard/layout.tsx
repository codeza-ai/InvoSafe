import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/sidebar/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="[--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex flex-col">
                <SiteHeader/>
                <div className="flex flex-1">
                    <AppSidebar />
                    <SidebarInset>
                        <div className="flex justify-center items-start w-full py-8">
                            <div className="w-3/4">
                                {children}
                            </div>
                        </div>
                    </SidebarInset>
                </div>
                {/* <SidebarRight /> */}
            </SidebarProvider>
        </div>
    )
}
