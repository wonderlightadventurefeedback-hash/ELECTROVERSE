"use client";

import Link from "next/link";
import { Zap, Menu, UserCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import GooeyNav from "@/components/ui/gooey-nav";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "News", href: "/news" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Zap className="h-8 w-8 text-secondary group-hover:scale-110 transition-transform" />
          <span className="font-headline text-2xl font-bold tracking-tight text-glow">
            SPARK<span className="text-secondary">LUX</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-4">
          <GooeyNav 
            items={NAV_LINKS.map(link => ({ label: link.name, href: link.href }))} 
          />
          <div className="h-6 w-px bg-border mx-2" />
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" className="hover:bg-primary/20 text-xs h-9">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90 accent-glow text-xs h-9">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden flex items-center gap-4">
          <Link href="/auth/login">
            <UserCircle className="h-6 w-6 text-secondary" />
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l-border">
              <SheetHeader>
                <SheetTitle className="font-headline text-2xl text-left">
                  SPARKLUX
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-12">
                <div className="relative flex items-center">
                  <Input 
                    placeholder="Search records..." 
                    className="bg-card border-border pr-10 focus-visible:ring-secondary/50"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-1 text-muted-foreground hover:text-secondary"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium hover:text-secondary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <hr className="border-border" />
                
                <div className="space-y-4">
                  <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="block">
                    <Button className="w-full bg-primary accent-glow">Join Now</Button>
                  </Link>
                  <Link href="/dashboard/ai-tutor" onClick={() => setIsOpen(false)} className="block">
                    <Button variant="outline" className="w-full border-secondary/30 text-secondary">
                      Access AI Tutor
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
