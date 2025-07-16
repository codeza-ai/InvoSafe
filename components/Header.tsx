"use client"

import * as React from "react"
import Link from "next/link"
// import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "./ModeToggle"
import Logo from "./Logo";

export function Header() {
    return (
        <header className="flex items-center justify-center p-4 border-b border-2 border-gray-200 bg-white">
            <div className="flex items-center justify-between w-2/3">
                <Logo/>
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
                    <span className="border-1 bg-gray-300 h-8 flex mr-5"></span>
                    <ModeToggle />
                </NavigationMenu>
            </div>
        </header>
    )
}