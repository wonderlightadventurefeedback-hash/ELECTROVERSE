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
  Plus,
  Trash2,
  FileText
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
import { collection, addDoc, serverTimestamp, doc, setDoc, collectionGroup, query, where, getDocs } from "firebase/firestore";
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

  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [resultStudent, setResultStudent] = useState<any>(null);
  const [resultForm, setResultForm] = useState({
    session: "2024-25",
    examType: "semester",
    subjects: [{ code: "", name: "", marks: "" }]
  });

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

  const handleAddSubject = () => {
    setResultForm({
      ...resultForm,
      subjects: [...resultForm.subjects, { code: "", name: "", marks: "" }]
    });
  };

  const handleRemoveSubject = (index: number) => {
    const newSubjects = resultForm.subjects.filter((_, i) => i !== index);
    setResultForm({ ...resultForm, subjects: newSubjects });
  };

  const handleSubjectChange = (index: number, field: string, value: string) => {
    const newSubjects = [...resultForm.subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };
    setResultForm({ ...resultForm, subjects: newSubjects });
  };

  const handleSaveResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !resultStudent || !user) return;
    setIsLoading(true);

    const gradesRef = collection(db, "grades");
    const resultData = {
      regNo: resultStudent.studentIdNumber,
      studentId: resultStudent.id,
      studentName: `${resultStudent.firstName} ${resultStudent.lastName}`,
      session: resultForm.session,
      examType: resultForm.examType,
      results: resultForm.subjects,
      recordedDate: serverTimestamp(),
      teacherId: user.uid
    };

    try {
      const q = query(
        gradesRef,
        where("regNo", "==", resultStudent.studentIdNumber),
        where("session", "==", resultForm.session),
        where("examType", "==", resultForm.examType)
      );
      const existing = await getDocs(q);
      
      if (!existing.empty) {
        const docRef = doc(db, "grades", existing.docs[0].id);
        await setDoc(docRef, resultData, { merge: true });
      } else {
        await addDoc(gradesRef, resultData);
      }

      toast({ 
        title: "Results Published", 
        description: `Examination results for ${resultStudent.firstName} have been saved.` 
      });
      setIsResultDialogOpen(false);
    } catch (error: any) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({ 
        path: 'grades', 
        operation: 'write', 
        requestResourceData: resultData 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold text-glow">Admin Control Panel</h1>
          <p className="text-muted-foreground">Managing SparkLux Academic Registry & Results.</p>
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
            <CardDescription>Update stats (CGPA, Attendance) & Publish Results by Registration No.</CardDescription>
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
                      <TableCell className="font-mono text-xs text-secondary font-bold">{student.studentIdNumber || "N/A"}</TableCell>
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
                          <Edit2 className="h-4 w-4 mr-2" /> Stats
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary hover:bg-primary/10" 
                          onClick={() => { 
                            setResultStudent(student); 
                            setIsResultDialogOpen(true); 
                            setResultForm({
                              session: "2024-25",
                              examType: "semester",
                              subjects: [{ code: "", name: "", marks: "" }]
                            });
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" /> Results
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

      {/* Edit Student Stats Dialog */}
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

      {/* Manage Results Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Publish Detailed Results</DialogTitle>
            <DialogDescription>Add subject-wise marks for Reg No: {resultStudent?.studentIdNumber}</DialogDescription>
          </DialogHeader>
          {resultStudent && (
            <form onSubmit={handleSaveResults} className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Academic Session</Label>
                  <Select value={resultForm.session} onValueChange={(val) => setResultForm({...resultForm, session: val})}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2022-23">2022-23</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Exam Category</Label>
                  <Select value={resultForm.examType} onValueChange={(val) => setResultForm({...resultForm, examType: val})}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semester">Semester Results</SelectItem>
                      <SelectItem value="internal">Internal Results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-bold">Subject Marks</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddSubject} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Subject
                  </Button>
                </div>
                
                {resultForm.subjects.map((sub, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 items-end p-4 bg-muted/20 rounded-lg border border-border">
                    <div className="col-span-3 space-y-1">
                      <Label className="text-[10px] uppercase">Code</Label>
                      <Input 
                        placeholder="EE101" 
                        value={sub.code} 
                        onChange={(e) => handleSubjectChange(idx, "code", e.target.value)}
                        className="bg-background h-9"
                      />
                    </div>
                    <div className="col-span-5 space-y-1">
                      <Label className="text-[10px] uppercase">Subject Name</Label>
                      <Input 
                        placeholder="Power Systems" 
                        value={sub.name} 
                        onChange={(e) => handleSubjectChange(idx, "name", e.target.value)}
                        className="bg-background h-9"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label className="text-[10px] uppercase">Marks (%)</Label>
                      <Input 
                        type="number" 
                        placeholder="85" 
                        value={sub.marks} 
                        onChange={(e) => handleSubjectChange(idx, "marks", e.target.value)}
                        className="bg-background h-9"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end pb-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveSubject(idx)}
                        disabled={resultForm.subjects.length === 1}
                        className="text-destructive hover:bg-destructive/10 h-9 w-9"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter className="pt-6">
                <Button type="submit" className="w-full gap-2 bg-primary hover:bg-primary/90 py-6 text-lg" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Publish Marks Summary
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
