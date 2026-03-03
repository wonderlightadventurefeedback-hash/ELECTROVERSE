"use client";

import { useState, useEffect, use } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  User, 
  Calendar, 
  BrainCircuit, 
  Mail, 
  Award,
  BookOpen,
  PieChart,
  Edit,
  Save,
  Loader2,
  School,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useUser, useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard(props: { params: Promise<any>; searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const { user, isUserLoading: isAuthLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    studentIdNumber: "",
    collegeName: "",
    semester: ""
  });

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "studentProfile", user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        studentIdNumber: profile.studentIdNumber || "",
        collegeName: profile.collegeName || "",
        semester: profile.semester || "1st Semester"
      });
    }
  }, [profile]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    setIsSaving(true);
    const docRef = doc(db, "users", user.uid, "studentProfile", user.uid);
    setDoc(docRef, { ...formData, id: user.uid, email: user.email }, { merge: true })
      .then(() => {
        toast({ title: "Profile Updated", description: "Your details have been saved." });
        setIsEditDialogOpen(false);
      })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'write', requestResourceData: formData }));
      })
      .finally(() => setIsSaving(false));
  };

  const DUMMY_ATTENDANCE_DETAILS = [
    { subject: "Electrical Circuits", percentage: 0 },
    { subject: "Microprocessors", percentage: 0 },
  ];

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  // Use values from profile or default to 0 as requested
  const currentCGPA = profile?.cgpa || 0;
  const avgAttendance = profile?.attendancePercentage || 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 space-y-6">
          <Card className="bg-card border-border overflow-hidden shadow-2xl">
            <div className="h-24 bg-primary/20 relative">
              <div className="absolute -bottom-10 left-6">
                <div className="h-20 w-20 rounded-2xl bg-background border-4 border-card flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-secondary" />
                </div>
              </div>
            </div>
            <CardContent className="pt-14 pb-6 px-6 space-y-6">
              <div className="space-y-1">
                <h2 className="font-headline text-2xl font-bold">
                  {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.displayName || "Student User"}
                </h2>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Registration No</span>
                  <span className="text-secondary font-mono font-bold text-sm tracking-tight">{profile?.studentIdNumber || "SPARK-UNASSIGNED"}</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground"><Mail className="h-4 w-4 text-secondary" /><span>{user?.email}</span></div>
                <div className="flex items-center gap-3 text-muted-foreground"><School className="h-4 w-4 text-secondary" /><span>{profile?.collegeName || "N/A"}</span></div>
                <div className="flex items-center gap-3 text-muted-foreground"><Calendar className="h-4 w-4 text-secondary" /><span>{profile?.semester || "N/A"}</span></div>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/dashboard/ai-tutor" className="w-full"><Button variant="outline" className="w-full text-xs h-9 gap-2"><BrainCircuit className="h-3.5 w-3.5" /> AI Tutor Assistant</Button></Link>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild><Button variant="outline" className="w-full text-xs h-9 gap-2"><Edit className="h-3 w-3" /> Edit Profile Information</Button></DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader><DialogTitle>Update Profile</DialogTitle></DialogHeader>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>First Name</Label><Input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required /></div>
                        <div className="space-y-2"><Label>Last Name</Label><Input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required /></div>
                      </div>
                      <div className="space-y-2"><Label>Registration Number</Label><Input value={formData.studentIdNumber} onChange={(e) => setFormData({...formData, studentIdNumber: e.target.value})} required /></div>
                      <div className="space-y-2"><Label>College Name</Label><Input value={formData.collegeName} onChange={(e) => setFormData({...formData, collegeName: e.target.value})} required /></div>
                      <div className="space-y-2">
                        <Label>Semester</Label>
                        <Select value={formData.semester} onValueChange={(val) => setFormData({...formData, semester: val})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{Array.from({length: 8}, (_, i) => `${i+1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Semester`).map(sem => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full gap-2" disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-8">
          <div><h1 className="font-headline text-3xl font-bold">Student Academic Portal</h1><p className="text-muted-foreground italic text-sm">Welcome to your academic journey overview.</p></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardDescription>Current CGPA</CardDescription><CardTitle className="text-3xl text-secondary">{currentCGPA.toFixed(2)}</CardTitle></CardHeader>
              <CardContent><p className="text-[10px] text-muted-foreground font-bold uppercase">{currentCGPA === 0 ? 'Awaiting updates' : 'Latest snapshot'}</p></CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardDescription>Average Attendance</CardDescription><CardTitle className="text-3xl text-secondary">{avgAttendance}%</CardTitle></CardHeader>
              <CardContent><p className="text-[10px] text-muted-foreground font-bold uppercase">{avgAttendance === 0 ? 'Attendance record empty' : 'Current semester status'}</p></CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader className="pb-2"><CardDescription>Active Backlogs</CardDescription><CardTitle className="text-3xl text-destructive">0</CardTitle></CardHeader>
              <CardContent><p className="text-[10px] text-green-500 font-bold uppercase">Clean Academic Record</p></CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="font-headline text-xl">Attendance Summary</CardTitle></CardHeader>
              <CardContent><div className="space-y-5">
                  {(avgAttendance > 0 ? [{subject: "Total Attendance", percentage: avgAttendance}] : DUMMY_ATTENDANCE_DETAILS).map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium"><span>{item.subject}</span><span className="text-secondary">{item.percentage}%</span></div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden"><div className="h-full bg-secondary rounded-full" style={{ width: `${item.percentage}%` }} /></div>
                    </div>
                  ))}
              </div></CardContent>
            </Card>
            <Card className="bg-card border-border"><CardHeader><CardTitle className="font-headline text-xl">Recent Academic Updates</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground italic">Check the results section for detailed marksheets once published by administration.</p></CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}