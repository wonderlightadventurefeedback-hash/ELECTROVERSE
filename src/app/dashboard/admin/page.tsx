
"use client";

import { useState, use, useMemo } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Users, 
  Settings, 
  ShieldCheck, 
  Search,
  Edit2,
  Save,
  Loader2,
  UserCheck,
  Briefcase,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFirestore, useUser, errorEmitter, FirestorePermissionError, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, collectionGroup, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard(props: { params: Promise<any>; searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const db = useFirestore();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch all student profiles using collectionGroup
  const studentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collectionGroup(db, "studentProfile"));
  }, [db]);

  const { data: students, isLoading: isStudentsLoading } = useCollection(studentsQuery);

  const onlineCount = students?.filter(s => s.isOnline).length || 0;

  const STATS = [
    { label: "Total Students", value: students?.length.toString() || "0", icon: Users, color: "text-secondary" },
    { label: "Online Now", value: onlineCount.toString(), icon: UserCheck, color: "text-green-500" },
    { label: "Faculty Members", value: "84", icon: Briefcase, color: "text-primary" },
    { label: "System Status", value: "Healthy", icon: ShieldCheck, color: "text-green-400" },
  ];

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(s => {
      const name = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();
      const regNo = (s.studentIdNumber || "").toLowerCase();
      const search = searchQuery.toLowerCase();
      return name.includes(search) || regNo.includes(search);
    });
  }, [students, searchQuery]);

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !editingStudent || !editingStudent.id) return;
    setIsLoading(true);
    
    // The student ID is the userId because of our path structure /users/{userId}/studentProfile/{userId}
    const studentRef = doc(db, "users", editingStudent.id, "studentProfile", editingStudent.id);
    const updateData = {
      firstName: editingStudent.firstName,
      lastName: editingStudent.lastName,
      studentIdNumber: editingStudent.studentIdNumber,
      semester: editingStudent.semester,
      collegeName: editingStudent.collegeName,
      cgpa: parseFloat(editingStudent.cgpa) || 0,
      attendancePercentage: parseFloat(editingStudent.attendancePercentage) || 0,
    };

    setDoc(studentRef, updateData, { merge: true })
      .then(() => {
        toast({ title: "Record Updated", description: `Academic stats for ${editingStudent.firstName} synced.` });
        setIsEditDialogOpen(false);
      })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: studentRef.path, operation: 'update', requestResourceData: updateData }));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold">Admin Control Panel</h1>
          <p className="text-muted-foreground">Managing SparkLux Academic Registry & User Sessions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-secondary/30 text-secondary">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <Card key={i} className="bg-card border-border group hover:border-secondary transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs uppercase tracking-wider font-bold">{stat.label}</CardDescription>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-headline">Manage Student Records</CardTitle>
            <CardDescription>Update academic summary stats (CGPA, Attendance)</CardDescription>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-9 h-9 bg-background" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {isStudentsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>Reg No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs">{student.studentIdNumber || "N/A"}</TableCell>
                      <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                      <TableCell>{student.semester}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{student.collegeName || "N/A"}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-secondary hover:text-secondary hover:bg-secondary/10" 
                          onClick={() => { setEditingStudent(student); setIsEditDialogOpen(true); }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" /> Manage Stats
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No students found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Student / Manage Stats Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Update Academic Summary</DialogTitle>
            <DialogDescription>Set current CGPA and Attendance for {editingStudent?.firstName} {editingStudent?.lastName}</DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <form onSubmit={handleSaveStudent} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current CGPA</Label>
                  <Input 
                    type="number" step="0.01" max="10"
                    value={editingStudent.cgpa || 0} 
                    onChange={(e) => setEditingStudent({...editingStudent, cgpa: e.target.value})}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Attendance (%)</Label>
                  <Input 
                    type="number" step="0.1" max="100"
                    value={editingStudent.attendancePercentage || 0} 
                    onChange={(e) => setEditingStudent({...editingStudent, attendancePercentage: e.target.value})}
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={editingStudent.semester} onValueChange={(val) => setEditingStudent({...editingStudent, semester: val})}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 8}, (_, i) => `${i+1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Semester`).map(sem => (
                      <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Academic Stats
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
