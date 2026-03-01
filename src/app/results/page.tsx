
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, FileX } from "lucide-react";

export default function ResultsPage() {
  const [session, setSession] = useState("");
  const [examType, setExamType] = useState("");
  const [regNo, setRegNo] = useState("");
  const [dob, setDob] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const { toast } = useToast();

  const handleReset = () => {
    setSession("");
    setExamType("");
    setRegNo("");
    setDob("");
    setSearchTriggered(false);
  };

  const handleViewResult = () => {
    if (!session || !examType || !regNo || !dob) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields to view the result.",
      });
      return;
    }

    setIsSearching(true);
    setSearchTriggered(false);

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      setSearchTriggered(true);
      toast({
        title: "Search Complete",
        description: "No records found for the provided information.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] bg-[#F4F7F9] dark:bg-background">
      <div className="container mx-auto px-4 py-16 space-y-6">
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
                    placeholder="DOB (DD-MM-YYYY)"
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

        {searchTriggered && (
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
