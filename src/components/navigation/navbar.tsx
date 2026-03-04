
"use client";

import Link from "next/link";
import { Menu, UserCircle, Search, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import GooeyNav from "@/components/ui/gooey-nav";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "News", href: "/news" },
  { name: "Gallery", href: "/gallery" },
  { name: "Results", href: "/results" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
      toast({
        title: "Logged Out",
        description: "You have been successfully signed out.",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message,
      });
    }
  };

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image 
                src="https://img.sanishtech.com/u/9f0b300f902c453fd35e891c43099af1.png"
                alt="ElectroVerse Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-headline text-2xl font-bold tracking-tight text-glow">
              ELECTRO<span className="text-secondary">VERSE</span>
            </span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 group-hover:scale-110 transition-transform">
            <Image 
              src="https://img.sanishtech.com/u/9f0b300f902c453fd35e891c43099af1.png"
              alt="ElectroVerse Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-glow">
            ELECTRO<span className="text-secondary">VERSE</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-4">
          <GooeyNav 
            items={NAV_LINKS.map(link => ({ label: link.name, href: link.href }))} 
          />
          <div className="h-6 w-px bg-border mx-2" />
          <div className="flex items-center gap-2">
            {user ? (
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="hover:bg-destructive/10 text-destructive hover:text-destructive text-xs h-9 gap-2"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </Button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden flex items-center gap-4">
          <Link href={user ? "/dashboard/student" : "/auth/login"}>
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
                <SheetTitle className="font-headline text-2xl text-left flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <Image 
                      src="https://img.sanishtech.com/u/9f0b300f902c453fd35e891c43099af1.png"
                      alt="ElectroVerse Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  ELECTROVERSE
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
                  {user ? (
                    <Button 
                      onClick={handleLogout}
                      className="w-full bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white transition-all gap-2 h-12"
                    >
                      <LogOut className="h-5 w-5" /> Logout from Portal
                    </Button>
                  ) : (
                    <Link href="/auth/login" onClick={() => setIsOpen(false)} className="block">
                      <Button className="w-full bg-primary accent-glow h-12">Sign In / Sign Up</Button>
                    </Link>
                  )}
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/results" onClick={() => setIsOpen(false)} className="block">
                      <Button variant="outline" className="w-full border-secondary/30 text-secondary gap-2">
                        <FileText className="h-4 w-4" /> Check Exam Results
                      </Button>
                    </Link>
                    <Link href="/dashboard/ai-tutor" onClick={() => setIsOpen(false)} className="block">
                      <Button variant="outline" className="w-full border-secondary/30 text-secondary">
                        Access AI Tutor
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
