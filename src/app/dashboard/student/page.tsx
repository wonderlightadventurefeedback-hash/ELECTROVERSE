
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
  User, 
  Calendar, 
  BrainCircuit, 
  Mail, 
  Edit,
  Save,
  Loader2,
  School,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
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

type Params = Promise<{ [key: string]: string | string[] | undefined }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function StudentDashboard({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  // Explicitly unwrap params and searchParams to avoid enumeration errors in Next.js 15
  use(params);
  use(searchParams);

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
    semester: "1st Semester"
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
    // Keep internal stats (cgpa, attendance) and set ID/Email for admin visibility
    const payload = { 
      ...formData, 
      id: user.uid, 
      email: user.email,
      cgpa: profile?.cgpa || 0,
      attendancePercentage: profile?.attendancePercentage || 0,
      lastLogin: new Date().toISOString(),
      isOnline: true
    };

    setDoc(docRef, payload, { merge: true })
      .then(() => {
        toast({ title: "Profile Updated", description: "Your details have been saved." });
        setIsEditDialogOpen(false);
      })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'write', requestResourceData: payload }));
      })
      .finally(() => setIsSaving(false));
  };

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
                <div className="flex items-center gap-3 text-muted-foreground"><School className="h-4 w-4 text-secondary" /><span>{profile?.collegeName || "Not set"}</span></div>
                <div className="flex items-center gap-3 text-muted-foreground"><Calendar className="h-4 w-4 text-secondary" /><span>{profile?.semester || "1st Semester"}</span></div>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/dashboard/ai-tutor" className="w-full">
                  <Button variant="outline" className="w-full text-xs h-9 gap-2 border-secondary/20 hover:bg-secondary/10">
                    <BrainCircuit className="h-3.5 w-3.5" /> AI Tutor Assistant
                  </Button>
                </Link>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full text-xs h-9 gap-2 bg-primary hover:bg-primary/90">
                      <Edit className="h-3 w-3" /> Edit Profile Information
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-md">
                    <DialogHeader><DialogTitle>Update Profile Details</DialogTitle></DialogHeader>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>First Name</Label><Input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required className="bg-background" /></div>
                        <div className="space-y-2"><Label>Last Name</Label><Input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required className="bg-background" /></div>
                      </div>
                      <div className="space-y-2"><Label>Registration Number</Label><Input value={formData.studentIdNumber} onChange={(e) => setFormData({...formData, studentIdNumber: e.target.value})} required className="bg-background" /></div>
                      <div className="space-y-2"><Label>College Name</Label><Input value={formData.collegeName} onChange={(e) => setFormData({...formData, collegeName: e.target.value})} required className="bg-background" /></div>
                      <div className="space-y-2">
                        <Label>Semester</Label>
                        <Select value={formData.semester} onValueChange={(val) => setFormData({...formData, semester: val})}>
                          <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                          <SelectContent>{Array.from({length: 8}, (_, i) => `${i+1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Semester`).map(sem => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full gap-2 bg-primary hover:bg-primary/90 mt-4" disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Academic Profile
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Activity className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h1 className="font-headline text-3xl font-bold">Academic Portal</h1>
              <p className="text-muted-foreground italic text-sm">Live overview of your performance and credentials.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border shadow-md border-t-4 border-t-secondary">
              <CardHeader className="pb-2"><CardDescription className="uppercase text-[10px] font-bold tracking-widest">Current CGPA</CardDescription><CardTitle className="text-4xl text-secondary">{currentCGPA.toFixed(2)}</CardTitle></CardHeader>
              <CardContent><p className="text-[10px] text-muted-foreground font-bold uppercase">{currentCGPA === 0 ? 'Admin update required' : 'Verified Academic Score'}</p></CardContent>
            </Card>
            <Card className="bg-card border-border shadow-md border-t-4 border-t-primary">
              <CardHeader className="pb-2"><CardDescription className="uppercase text-[10px] font-bold tracking-widest">Attendance</CardDescription><CardTitle className="text-4xl text-primary">{avgAttendance}%</CardTitle></CardHeader>
              <CardContent><p className="text-[10px] text-muted-foreground font-bold uppercase">{avgAttendance === 0 ? 'Record pending' : 'Classroom participation'}</p></CardContent>
            </Card>
            <Card className="bg-card border-border shadow-md border-t-4 border-t-destructive">
              <CardHeader className="pb-2"><CardDescription className="uppercase text-[10px] font-bold tracking-widest">Backlogs</CardDescription><CardTitle className="text-4xl text-destructive">0</CardTitle></CardHeader>
              <CardContent><p className="text-[10px] text-green-500 font-bold uppercase">Clear Record</p></CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="font-headline text-xl">Attendance Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span>Total Participation</span>
                      <span className="text-secondary">{avgAttendance}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full transition-all duration-1000" style={{ width: `${avgAttendance}%` }} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Detailed subject-wise breakdown will be available in the upcoming semester update.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardHeader><CardTitle className="font-headline text-xl">Admin Announcements</CardTitle></CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/20 border border-border rounded-lg text-sm italic text-muted-foreground">
                  "Students must ensure their Registration Numbers are correct. CGPA and Attendance stats are updated weekly by the department office."
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
