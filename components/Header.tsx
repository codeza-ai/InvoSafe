"use client"

import * as React from "react"
import Link from "next/link"
import { HomeIcon, InfoIcon, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


export function Header() {
    return (
        <header className="flex items-center justify-center p-4 border-b border-2 border-gray-200 bg-white">
            <div className="flex items-center justify-between w-2/3">
                <div>
                    <h1 className="text-2xl font-bold">InvoSafe</h1>
                </div>
                {/* <Logo/> */}
                <NavigationMenu viewport={false}>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/">Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/about">About</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/contact">Contact</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                    <div className="flex items-center space-x-5 px-5">
                        <Button><Link href="/register">Get started</Link></Button>
                        <Button variant="outline"><Link href="/login">Login</Link></Button>
                    </div>
                </NavigationMenu>
            </div>
        </header>
    )
}