
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

export default function ResultsPage() {
  const [session, setSession] = useState("");
  const [regNo, setRegNo] = useState("");
  const [dob, setDob] = useState("");

  const handleReset = () => {
    setSession("");
    setRegNo("");
    setDob("");
  };

  return (
    <div className="min-h-[80vh] bg-[#F4F7F9] dark:bg-background">
      <div className="container mx-auto px-4 py-16 space-y-6">
        <h2 className="text-[#E05B3E] font-bold text-xl uppercase tracking-tight font-headline">
          STUDENTS RESULT SUMMARY
        </h2>

        <Card className="border-border/40 shadow-sm bg-white dark:bg-card rounded-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-end gap-6">
              {/* Session Field */}
              <div className="flex-1 w-full relative">
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

              {/* Reg No Field */}
              <div className="flex-1 w-full">
                <Input
                  placeholder="Reg No."
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="bg-transparent border-slate-300 dark:border-border h-12 placeholder:text-slate-400"
                />
              </div>

              {/* DOB Field */}
              <div className="flex-1 w-full">
                <Input
                  placeholder="DOB"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-transparent border-slate-300 dark:border-border h-12 placeholder:text-slate-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button className="bg-[#7F56D9] hover:bg-[#6941C6] text-white px-10 h-12 rounded-md font-bold">
                  View
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="bg-[#344054] hover:bg-[#1D2939] text-white border-none px-10 h-12 rounded-md font-bold"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pt-4 border-t border-slate-200 dark:border-border">
          <p className="text-sm text-[#3E6BEC] font-medium">
            For any query: Please email at :{" "}
            <a href="mailto:students@bput.ac.in" className="hover:underline">
              students@bput.ac.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
