
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Zap, Mail, Lock, GraduationCap, Briefcase, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for Firebase Auth will go here
    console.log("Login attempted for role:", role, "with email:", email);
  };

  return (
    <div className="container mx-auto px-4 min-h-[80vh] flex items-center justify-center py-12">
      <Card className="w-full max-w-lg bg-card border-border shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Zap className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <CardTitle className="font-headline text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your SparkLux portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3 pb-2">
              <Label className="text-sm font-medium">Select Your Role</Label>
              <RadioGroup 
                defaultValue="student" 
                className="grid grid-cols-3 gap-4"
                onValueChange={(value) => setRole(value)}
              >
                <div>
                  <RadioGroupItem value="student" id="student-login" className="peer sr-only" />
                  <Label
                    htmlFor="student-login"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary [&:has([data-state=checked])]:border-secondary cursor-pointer transition-all"
                  >
                    <GraduationCap className="mb-1 h-5 w-5 text-secondary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Student</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="teacher" id="teacher-login" className="peer sr-only" />
                  <Label
                    htmlFor="teacher-login"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary [&:has([data-state=checked])]:border-secondary cursor-pointer transition-all"
                  >
                    <Briefcase className="mb-1 h-5 w-5 text-secondary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Teacher</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="admin" id="admin-login" className="peer sr-only" />
                  <Label
                    htmlFor="admin-login"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary [&:has([data-state=checked])]:border-secondary cursor-pointer transition-all"
                  >
                    <ShieldAlert className="mb-1 h-5 w-5 text-secondary" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Admin</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="name@sparklux.edu" 
                  className="pl-10 bg-background"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link href="#" className="text-xs text-secondary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 bg-background"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-lg accent-glow">
              Sign In
            </Button>
          </form>
          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-secondary font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
