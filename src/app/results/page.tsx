
"use client";

import { useState, use } from "react";
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
import { Search, FileX, GraduationCap, FileText } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";

type Params = Promise<{ [key: string]: string | string[] | undefined }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function ResultsPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  // Explicitly unwrap promises to comply with Next.js 15
  use(params);
  use(searchParams);

  const db = useFirestore();
  const [session, setSession] = useState("");
  const [examType, setExamType] = useState("");
  const [regNo, setRegNo] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [foundResult, setFoundResult] = useState<any>(null);
  const { toast } = useToast();

  const handleReset = () => {
    setSession("");
    setExamType("");
    setRegNo("");
    setSearchTriggered(false);
    setFoundResult(null);
  };

  const handleViewResult = async () => {
    if (!session || !examType || !regNo) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in Session, Exam Type, and Registration No. to search.",
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
        where("regNo", "==", regNo.trim()),
        where("session", "==", session),
        where("examType", "==", examType)
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const resultDoc = querySnapshot.docs[0].data();
        setFoundResult(resultDoc);
        toast({
          title: "Success",
          description: `Result summary found for ${resultDoc.studentName}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Not Found",
          description: "No academic records match your search criteria.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "An error occurred while retrieving data. Please try again later.",
      });
    } finally {
      setIsSearching(false);
      setSearchTriggered(true);
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#F4F7F9] dark:bg-background">
      <div className="container mx-auto px-4 py-16 space-y-8">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image 
              src="https://img.sanishtech.com/u/9f0b300f902c453fd35e891c43099af1.png"
              alt="ElectroVerse Logo"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-[#E05B3E] font-bold text-2xl uppercase tracking-tight font-headline">
            STUDENTS RESULT SUMMARY
          </h2>
        </div>

        <Card className="border-border/40 shadow-sm bg-white dark:bg-card rounded-md">
          <CardContent className="p-8">
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                    Academic Session
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

                <div className="space-y-2">
                  <label className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                    Exam Category
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

                <div className="space-y-2">
                  <label className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                    Registration No.
                  </label>
                  <Input
                    placeholder="Enter Reg No (e.g. ELECTRO2024-001)"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="bg-transparent border-slate-300 dark:border-border h-12 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={handleViewResult}
                  disabled={isSearching}
                  className="bg-[#7F56D9] hover:bg-[#6941C6] text-white px-10 h-12 rounded-md font-bold shadow-md min-w-[180px] gap-2 transition-all active:scale-95"
                >
                  {isSearching ? (
                    <div className="relative h-6 w-6 animate-spin">
                      <Image 
                        src="https://img.sanishtech.com/u/9f0b300f902c453fd35e891c43099af1.png"
                        alt="Loading"
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  View Summary
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="bg-[#344054] hover:bg-[#1D2939] text-white border-none px-10 h-12 rounded-md font-bold shadow-md transition-all active:scale-95"
                >
                  Reset Form
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {searchTriggered && foundResult && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-card border-border shadow-2xl overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/20 p-8">
                <div className="flex flex-wrap justify-between items-center gap-6">
                  <div className="space-y-1">
                    <CardTitle className="font-headline text-3xl flex items-center gap-3">
                      <GraduationCap className="h-8 w-8 text-secondary" />
                      {foundResult.studentName}
                    </CardTitle>
                    <p className="text-muted-foreground font-medium italic">ElectroVerse Academic Portal - Student Record</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="px-4 py-2 bg-background border border-border rounded-lg flex flex-col items-center min-w-[120px]">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Reg No</span>
                      <span className="font-mono text-sm text-secondary font-bold">{foundResult.regNo}</span>
                    </div>
                    <div className="px-4 py-2 bg-background border border-border rounded-lg flex flex-col items-center min-w-[120px]">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Session</span>
                      <span className="font-mono text-sm text-secondary font-bold">{foundResult.session}</span>
                    </div>
                    <div className="px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-lg flex flex-col items-center min-w-[120px]">
                      <span className="text-[10px] uppercase font-bold text-secondary">Exam Type</span>
                      <span className="font-bold text-sm uppercase">{foundResult.examType}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-b-2 border-border/50">
                      <TableHead className="pl-8 py-4 uppercase text-[11px] font-bold tracking-widest">Subject Code</TableHead>
                      <TableHead className="py-4 uppercase text-[11px] font-bold tracking-widest">Subject Name</TableHead>
                      <TableHead className="text-center py-4 uppercase text-[11px] font-bold tracking-widest">Score (%)</TableHead>
                      <TableHead className="text-right pr-8 py-4 uppercase text-[11px] font-bold tracking-widest">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foundResult.results.map((item: any, i: number) => (
                      <TableRow key={i} className="hover:bg-secondary/5 transition-colors border-b border-border/30">
                        <TableCell className="pl-8 font-mono text-sm text-muted-foreground">{item.code}</TableCell>
                        <TableCell className="font-semibold">{item.name}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-block min-w-[60px] py-1 bg-secondary/10 text-secondary rounded-full font-bold">
                            {item.marks}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end">
                            <span className={`h-8 w-8 flex items-center justify-center rounded-lg border font-bold text-xs ${
                              parseInt(item.marks) >= 80 ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                              parseInt(item.marks) >= 60 ? 'bg-blue-500/10 border-blue-500/30 text-blue-500' :
                              'bg-orange-500/10 border-orange-500/30 text-orange-500'
                            }`}>
                              {parseInt(item.marks) >= 90 ? 'O' : parseInt(item.marks) >= 80 ? 'E' : parseInt(item.marks) >= 70 ? 'A' : parseInt(item.marks) >= 60 ? 'B' : 'C'}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-8 bg-muted/10 flex justify-between items-center text-xs text-muted-foreground italic border-t border-border/30">
                  <p>Digitally signed by ElectroVerse Academics Administration.</p>
                  <p>Recorded Date: {foundResult.recordedDate ? new Date(foundResult.recordedDate.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {searchTriggered && !foundResult && (
          <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-xl border border-dashed border-border text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="p-4 bg-muted/50 rounded-full shadow-inner">
              <FileX className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Record Not Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto text-sm">
                We couldn't find any results for Registration No. <span className="text-secondary font-bold">{regNo}</span> for the selected criteria. Please check your entries and try again.
              </p>
            </div>
            <Button variant="ghost" onClick={handleReset} className="text-secondary font-bold hover:bg-secondary/10">
              Clear Search and Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
