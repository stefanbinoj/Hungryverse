"use client";

import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { MobileSidebar } from "@/app/dashboard/components/mobile-sidebar";
export default function Header() {
    return (
        <header className="flex h-[55px]  items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center">
                <div className="md:hidden">
                    <MobileSidebar />
                </div>
                <Link href="/" className="text-2xl font-bold">
                    hungryverse
                </Link>
            </div>
            <div className=" items-center">
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </header>
    );
}
