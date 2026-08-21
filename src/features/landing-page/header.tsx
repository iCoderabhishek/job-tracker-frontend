"use client";

import Link from "next/link";
import { Menu01Icon } from "hugeicons-react";
import { useState } from "react";
import { SIGNUP_URL } from "@/lib/env";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b border-black/5">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                        <span className="sr-only">jtracker</span>
                        {/* Custom SVG Logo */}
                        <img src="/assets/logo.svg" alt="jtracker Logo" width={32} height={32} />
                        <span className="font-serif text-2xl font-bold tracking-tight">jtracker</span>
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu01Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <Link href="#features" className="text-sm font-medium leading-6 text-foreground hover:text-foreground/70 transition-colors">
                        Features
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium leading-6 text-foreground hover:text-foreground/70 transition-colors">
                        Pricing
                    </Link>
                    <Link href="#about" className="text-sm font-medium leading-6 text-foreground hover:text-foreground/70 transition-colors">
                        About
                    </Link>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
                    <Link href="/login" className="text-sm font-medium leading-6 text-foreground hover:text-foreground/70 transition-colors">
                        Log in
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>
            {/* Mobile Menu Simplified for demo */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-0 left-0 w-full bg-background border-b border-black/5 p-6 z-50">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-serif text-2xl font-bold">jtracker</Link>
                        <button onClick={() => setMobileMenuOpen(false)}>Close</button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6 flex flex-col">
                                <Link href="#features" className="block px-3 py-2 text-base font-medium text-foreground">Features</Link>
                                <Link href="#pricing" className="block px-3 py-2 text-base font-medium text-foreground">Pricing</Link>
                                <Link href="#about" className="block px-3 py-2 text-base font-medium text-foreground">About</Link>
                            </div>
                            <div className="py-6 flex flex-col gap-2">
                                <Link href="/login" className="block px-3 py-2.5 text-base font-medium text-foreground">Log in</Link>
                                <Link href="/login" className="block px-3 py-2.5 text-base font-medium bg-primary text-primary-foreground rounded-full text-center">Get Started</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
