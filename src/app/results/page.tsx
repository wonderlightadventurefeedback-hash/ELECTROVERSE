
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, FileX, GraduationCap, Calendar, User } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ResultsPage() {
  const db = useFirestore();
  const [session, setSession] = useState("");
  const [examType, setExamType] = useState("");
  const [regNo, setRegNo] = useState("");
  const [dob, setDob] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [foundResult, setFoundResult] = useState<any>(null);
  const { toast } = useToast();

  const handleReset = () => {
    setSession("");
    setExamType("");
    setRegNo("");
    setDob("");
    setSearchTriggered(false);
    setFoundResult(null);
  };

  const handleViewResult = async () => {
    if (!session || !examType || !regNo) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields (Session, Exam Type, and Reg No) to view the result.",
      });
      return;
    }

    if (!db) return;
    setIsSearching(true);
    setSearchTriggered(false);
    setFoundResult(null);

    try {
      const q = query(
        collection(db, "grades"),
        where("regNo", "==", regNo),
        where("session", "==", session),
        where("examType", "==", examType)
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Taking the most recent result if multiple exist (unlikely given filters)
        const resultDoc = querySnapshot.docs[0].data();
        setFoundResult(resultDoc);
        toast({
          title: "Result Found",
          description: `Displaying academic record for ${resultDoc.studentName}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Not Found",
          description: "No records found for the provided information.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Query Error",
        description: "There was an error accessing the database.",
      });
    } finally {
      setIsSearching(false);
      setSearchTriggered(true);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#F4F7F9] dark:bg-background">
      <div className="container mx-auto px-4 py-16 space-y-8">
        <h2 className="text-[#E05B3E] font-bold text-xl uppercase tracking-tight font-headline">
          STUDENTS RESULT SUMMARY
        </h2>

        <Card className="border-border/40 shadow-sm bg-white dark:bg-card rounded-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white dark:bg-card px-1 text-[11px] text-muted-foreground font-semibold z-10 transition-all">
                    Session
                  </label>
                  <Select value={session} onValueChange={setSession}>
                    <SelectTrigger className="w-full bg-transparent border-slate-300 dark:border-border h-12 focus:ring-0">
                      <SelectValue placeholder="Select Session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2022-23">2022-23</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <label className="absolute -top-2 left-3 bg-white dark:bg-card px-1 text-[11px] text-muted-foreground font-semibold z-10 transition-all">
                    Exam Type
                  </label>
                  <Select value={examType} onValueChange={setExamType}>
                    <SelectTrigger className="w-full bg-transparent border-slate-300 dark:border-border h-12 focus:ring-0">
                      <SelectValue placeholder="Internal / Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semester">Semester Results</SelectItem>
                      <SelectItem value="internal">Internal Results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full">
                  <Input
                    placeholder="Reg No."
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="bg-transparent border-slate-300 dark:border-border h-12 placeholder:text-slate-400"
                  />
                </div>

                <div className="w-full">
                  <Input
                    placeholder="DOB (DD-MM-YYYY) - Optional"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="bg-transparent border-slate-300 dark:border-border h-12 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button 
                  onClick={handleViewResult}
                  disabled={isSearching}
                  className="bg-[#7F56D9] hover:bg-[#6941C6] text-white px-10 h-12 rounded-md font-bold shadow-md min-w-[160px]"
                >
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
                  View Result
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="bg-[#344054] hover:bg-[#1D2939] text-white border-none px-10 h-12 rounded-md font-bold shadow-md"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {searchTriggered && foundResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-card border-border shadow-xl">
              <CardHeader className="border-b border-border bg-muted/20">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-secondary" />
                    {foundResult.studentName}
                  </CardTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="h-4 w-4" /> {foundResult.regNo}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {foundResult.session}</span>
                    <span className="flex items-center gap-1 font-bold text-secondary uppercase">{foundResult.examType}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>Subject Code</TableHead>
                      <TableHead>Subject Name</TableHead>
                      <TableHead className="text-center">Marks Obtained</TableHead>
                      <TableHead className="text-right">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foundResult.results.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{item.code}</TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center font-bold text-secondary">{item.marks}%</TableCell>
                        <TableCell className="text-right">
                          <span className="px-2 py-1 bg-primary/20 text-secondary rounded text-xs font-bold border border-primary/30">
                            {parseInt(item.marks) >= 90 ? 'O' : parseInt(item.marks) >= 80 ? 'E' : parseInt(item.marks) >= 70 ? 'A' : 'B'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {searchTriggered && !foundResult && (
          <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-xl border border-dashed border-border text-center space-y-4">
            <div className="p-4 bg-muted/50 rounded-full">
              <FileX className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">No Records Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any results for Registration No. <span className="text-secondary font-mono">{regNo}</span> in the <span className="text-secondary">{session}</span> session. Please verify your details and try again.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
