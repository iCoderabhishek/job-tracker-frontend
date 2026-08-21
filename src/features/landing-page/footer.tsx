import Link from "next/link";
import { GithubIcon, TwitterIcon } from "hugeicons-react";
import { SIGNUP_URL } from "@/lib/env";

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/5">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-6">
            <Link href="#features" className="text-sm leading-6 text-foreground hover:text-foreground/70 transition-colors font-medium">
              Features
            </Link>
          </div>
          <div className="pb-6">
            <Link href="#pricing" className="text-sm leading-6 text-foreground hover:text-foreground/70 transition-colors font-medium">
              Pricing
            </Link>
          </div>
          <div className="pb-6">
            <Link href="#about" className="text-sm leading-6 text-foreground hover:text-foreground/70 transition-colors font-medium">
              About
            </Link>
          </div>
          <div className="pb-6">
            <Link href={SIGNUP_URL} className="text-sm leading-6 text-foreground hover:text-foreground/70 transition-colors font-medium">
              Log in
            </Link>
          </div>
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          <Link href="https://github.com/iCoderabhishek/jtracker" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <span className="sr-only">GitHub</span>
            <GithubIcon className="h-6 w-6" aria-hidden="true" />
          </Link>
          <Link href="https://x.com/0bhishek" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <span className="sr-only">Twitter</span>
            <TwitterIcon className="h-6 w-6" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 flex flex-col items-center gap-2">
          <p className="text-center text-sm leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} jtracker Inc. All rights reserved.
          </p>
          <p className="text-center text-xs leading-5 text-muted-foreground">
            built with ♡ྀི ₊ by <a href="https://0bhishek.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-4">Abhishek</a> ✌︎㋡
          </p>
        </div>
      </div>
    </footer>
  );
}
