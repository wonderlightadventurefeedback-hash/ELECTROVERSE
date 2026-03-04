
"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image 
                  src="https://img.sanishtech.com/u/9f0b300f902c453fd35e891c43099af1.png"
                  alt="ElectroVerse Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-headline text-xl font-bold">ELECTROVERSE</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Empowering the next generation of electrical engineers with world-class facilities and innovative pedagogy at ElectroVerse.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-background rounded-full hover:text-secondary transition-colors">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-background rounded-full hover:text-secondary transition-colors">
                <Twitter className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-background rounded-full hover:text-secondary transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-secondary">About Department</Link></li>
              <li><Link href="/news" className="hover:text-secondary">Academic Calendar</Link></li>
              <li><Link href="/gallery" className="hover:text-secondary">Achievement Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-secondary">Help & Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6">Academic Portal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/auth/login" className="hover:text-secondary">Student Dashboard</Link></li>
              <li><Link href="/auth/login" className="hover:text-secondary">Faculty Portal</Link></li>
              <li><Link href="/news" className="hover:text-secondary">Research Papers</Link></li>
              <li><Link href="/gallery" className="hover:text-secondary">Innovation Lab</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>123 Tech Avenue, Innovation City, 560001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-secondary" />
                <span>+1 (555) 012-3456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-secondary" />
                <span>info@electroverse.edu</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-16 pt-8 text-center text-xs text-muted-foreground">
          &copy; {year || "..."} ElectroVerse Academics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
