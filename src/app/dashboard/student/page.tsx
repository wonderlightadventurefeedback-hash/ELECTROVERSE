
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GraduationCap, LayoutDashboard, FileText, User, Calendar, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SEMESTERS = Array.from({ length: 8 }, (_, i) => `${i + 1}${getOrdinal(i + 1)} Semester`);

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

const DUMMY_MARKS = [
  { subject: "Electrical Circuits", code: "EE301", marks: 85, grade: "A" },
  { subject: "Microprocessors", code: "EE302", marks: 78, grade: "B+" },
  { subject: "Power Electronics", code: "EE303", marks: 92, grade: "O" },
  { subject: "Control Systems", code: "EE304", marks: 88, grade: "A+" },
  { subject: "Electric Machines", code: "EE305", marks: 81, grade: "A" },
];

export default function StudentDashboard() {
  const [selectedSem, setSelectedSem] = useState("1st Semester");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          <div className="p-6 bg-card rounded-2xl border border-border mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <User className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Alex Johnson</h4>
                <p className="text-xs text-muted-foreground">ID: SPARKE2021</p>
              </div>
            </div>
            <Link href="/dashboard/ai-tutor">
              <Button variant="outline" className="w-full justify-start gap-2 border-secondary/30 text-secondary">
                <BrainCircuit className="h-4 w-4" /> AI Engineering Tutor
              </Button>
            </Link>
          </div>

          <Button variant="ghost" className="w-full justify-start gap-3 h-12 bg-secondary/10 text-secondary">
            <LayoutDashboard className="h-4 w-4" /> Overview
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-muted-foreground">
            <GraduationCap className="h-4 w-4" /> Course Enrollment
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-muted-foreground">
            <Calendar className="h-4 w-4" /> Attendance Record
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="font-headline text-3xl font-bold">Academic Portal</h1>
            <div className="flex items-center gap-3 bg-card p-1 rounded-lg border border-border">
              <span className="text-xs font-medium px-3 text-muted-foreground">Select Semester:</span>
              <Select defaultValue={selectedSem} onValueChange={setSelectedSem}>
                <SelectTrigger className="w-[180px] h-9 border-none bg-background">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map(sem => (
                    <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardDescription>Current CGPA</CardDescription>
                <CardTitle className="text-3xl text-secondary">8.92</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardDescription>Average Attendance</CardDescription>
                <CardTitle className="text-3xl text-secondary">94%</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardDescription>Backlogs</CardDescription>
                <CardTitle className="text-3xl text-destructive">0</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-headline">Examination Results</CardTitle>
              <CardDescription>View your detailed score sheet for {selectedSem}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="semester" className="w-full">
                <TabsList className="bg-background border border-border mb-6">
                  <TabsTrigger value="semester">Semester Results</TabsTrigger>
                  <TabsTrigger value="internal-1">1st Internal</TabsTrigger>
                  <TabsTrigger value="internal-2">2nd Internal</TabsTrigger>
                </TabsList>

                <TabsContent value="semester" className="space-y-4">
                  <div className="border border-border rounded-xl overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Course Code</TableHead>
                          <TableHead>Subject Name</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {DUMMY_MARKS.map((item) => (
                          <TableRow key={item.code}>
                            <TableCell className="font-mono text-xs">{item.code}</TableCell>
                            <TableCell className="font-medium">{item.subject}</TableCell>
                            <TableCell>{item.marks}%</TableCell>
                            <TableCell>
                              <span className="px-2 py-1 bg-primary/20 text-secondary rounded text-xs font-bold">
                                {item.grade}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" /> Download Grade Card
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="internal-1">
                  <div className="p-12 text-center text-muted-foreground border border-dashed rounded-2xl">
                    Internal assessments for {selectedSem} are being updated.
                  </div>
                </TabsContent>
                <TabsContent value="internal-2">
                  <div className="p-12 text-center text-muted-foreground border border-dashed rounded-2xl">
                    Internal assessments for {selectedSem} are being updated.
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
