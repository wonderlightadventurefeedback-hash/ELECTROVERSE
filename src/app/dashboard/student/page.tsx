
"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  GraduationCap, 
  LayoutDashboard, 
  User, 
  Calendar, 
  BrainCircuit, 
  MapPin, 
  Mail, 
  Award,
  BookOpen,
  PieChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentDashboard() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const db = useFirestore();

  // Fetch student profile from Firestore
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    // Assuming profile doc ID matches user UID as per security rules requirement
    return doc(db, "users", user.uid, "studentProfile", user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const DUMMY_ATTENDANCE = [
    { subject: "Electrical Circuits", percentage: 95, status: "Good" },
    { subject: "Microprocessors", percentage: 88, status: "Average" },
    { subject: "Power Electronics", percentage: 92, status: "Good" },
    { subject: "Control Systems", percentage: 76, status: "Low" },
  ];

  const DUMMY_MARKS = [
    { subject: "Electrical Circuits", code: "EE301", marks: 85, grade: "A" },
    { subject: "Microprocessors", code: "EE302", marks: 78, grade: "B+" },
    { subject: "Power Electronics", code: "EE303", marks: 92, grade: "O" },
  ];

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full lg:w-80 space-y-6">
          <Card className="bg-card border-border overflow-hidden shadow-2xl">
            <div className="h-24 bg-primary/20 relative">
              <div className="absolute -bottom-10 left-6">
                <div className="h-20 w-20 rounded-2xl bg-background border-4 border-card flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-secondary" />
                </div>
              </div>
            </div>
            <CardContent className="pt-14 pb-6 px-6 space-y-4">
              <div>
                <h2 className="font-headline text-2xl font-bold">
                  {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.displayName || "Student User"}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="text-secondary font-mono">ID: {profile?.studentIdNumber || "N/A"}</span>
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-secondary" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-secondary" />
                  <span>{profile?.address || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-secondary" />
                  <span>{profile?.departmentName || "B.Tech Electrical Engineering"}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <Link href="/dashboard/ai-tutor" className="flex-1">
                  <Button variant="outline" className="w-full justify-start gap-2 border-secondary/30 text-secondary text-xs h-9">
                    <BrainCircuit className="h-3.5 w-3.5" /> AI Tutor
                  </Button>
                </Link>
                <Button variant="outline" className="border-border text-muted-foreground text-xs h-9">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3 h-12 bg-secondary/10 text-secondary border-r-4 border-secondary rounded-none">
              <LayoutDashboard className="h-4 w-4" /> Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-muted-foreground hover:bg-muted/50">
              <Calendar className="h-4 w-4" /> Class Schedule
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-muted-foreground hover:bg-muted/50">
              <Award className="h-4 w-4" /> Achievements
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-headline text-3xl font-bold">Student Academic Portal</h1>
              <p className="text-muted-foreground italic text-sm">Welcome back to your personalized learning dashboard.</p>
            </div>
            <div className="flex gap-4">
               <Card className="bg-card border-border px-4 py-2 flex items-center gap-3">
                 <div className="p-2 bg-secondary/10 rounded-lg">
                   <Calendar className="h-4 w-4 text-secondary" />
                 </div>
                 <div>
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Semester</p>
                   <p className="text-sm font-bold">4th Semester</p>
                 </div>
               </Card>
               <Card className="bg-card border-border px-4 py-2 flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-lg">
                   <BookOpen className="h-4 w-4 text-primary" />
                 </div>
                 <div>
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Section</p>
                   <p className="text-sm font-bold">A - Group 1</p>
                 </div>
               </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border relative overflow-hidden group">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                <Award className="h-32 w-32" />
              </div>
              <CardHeader className="pb-2">
                <CardDescription>Current CGPA</CardDescription>
                <CardTitle className="text-3xl text-secondary">8.92</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[10px] text-green-500 font-bold uppercase">+0.12 from last sem</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border relative overflow-hidden group">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                <PieChart className="h-32 w-32" />
              </div>
              <CardHeader className="pb-2">
                <CardDescription>Average Attendance</CardDescription>
                <CardTitle className="text-3xl text-secondary">94.2%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Total 124 sessions attended</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border relative overflow-hidden group">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                <LayoutDashboard className="h-32 w-32 text-destructive" />
              </div>
              <CardHeader className="pb-2">
                <CardDescription>Active Backlogs</CardDescription>
                <CardTitle className="text-3xl text-destructive">0</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[10px] text-green-500 font-bold uppercase">Clean Academic Record</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-xl">Attendance Summary</CardTitle>
                  <CardDescription>Subject-wise session tracking</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-secondary text-xs">View History</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {DUMMY_ATTENDANCE.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{item.subject}</span>
                        <span className={item.percentage < 80 ? 'text-destructive' : 'text-secondary'}>{item.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            item.percentage < 80 ? 'bg-destructive' : 'bg-secondary'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-headline text-xl">Recent Examination Results</CardTitle>
                <CardDescription>Latest scores from internal assessments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-[10px] uppercase font-bold pl-6">Subject</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-center">Score</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DUMMY_MARKS.map((item) => (
                      <TableRow key={item.code} className="hover:bg-muted/30">
                        <TableCell className="pl-6">
                          <p className="text-sm font-medium">{item.subject}</p>
                          <p className="text-[10px] font-mono text-muted-foreground">{item.code}</p>
                        </TableCell>
                        <TableCell className="text-center font-bold text-secondary">{item.marks}%</TableCell>
                        <TableCell className="text-right pr-6">
                          <span className="px-2 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[10px] font-bold">
                            {item.grade}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 flex justify-center border-t border-border">
                  <Link href="/results">
                    <Button variant="link" className="text-xs text-muted-foreground hover:text-secondary">
                      View All Results & Summary
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
