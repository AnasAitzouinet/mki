"use client"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CircleUser, Menu, Package2 } from 'lucide-react'
import ModeToggle from '../ModeToggle'
import { IsAdmin, Logout } from '@/server/Auth'



const NavItems = [
    {
        name: "Dashboard",
        href: "/",
        admin: false

    },
    {
        name: "Fiches",
        href: "/Fiches",
        admin: false
    },
    {
        name: "Ajouter un compte client",
        href: "/NewClient",
        admin: true
    },
    {
        name: "Factures",
        href: "/Factures",
        admin: false

    },
]



export default function Navbar() {
    const [isAdmin, setIsAdmin] = React.useState(false)
    React.useEffect(() => {
        IsAdmin().then((res) => {
            setIsAdmin(res)
        })
    }, [])

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:text-sm lg:gap-5">
                <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                {NavItems.map((item) => {
                    return (isAdmin && item.admin) || !item.admin ? (
                        <Button
                            key={item.name}
                            variant="ghost" size="sm" className='group'>
                            <Link
                                href={item.href}
                                className="text-muted-foreground group-hover:text-foreground"
                            >
                                {item.name}
                            </Link>
                        </Button>

                    ) : null
                })}
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        {NavItems.map((item) => (

                            <Link
                                href={item.href}
                                key={item.name}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {item.name}
                            </Link>

                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial">
                    <ModeToggle />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={async() => {
                               await Logout()
                            }}
                        >Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
