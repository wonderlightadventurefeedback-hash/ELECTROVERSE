"use client";

import { useState, use } from "react";
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
  BarChart3, 
  Bell,
  Search,
  Plus,
  Edit2,
  Save,
  Trash2,
  Loader2,
  UserPlus,
  FileSpreadsheet,
  X,
  Activity,
  UserCheck,
  Briefcase
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";

const INITIAL_STUDENTS = [
  { id: "1", regNo: "SPARK2024-001", name: "Student User 1", semester: "2nd Semester", status: "Active", isOnline: true, cgpa: 0, attendancePercentage: 0 },
  { id: "2", regNo: "SPARK2024-002", name: "Student User 2", semester: "3rd Semester", status: "Active", isOnline: false, cgpa: 0, attendancePercentage: 0 },
];

const TAB_OPTIONS = ["All", "Online", "1st Year", "2nd Year", "3rd Year", "4th Year"];

export default function AdminDashboard(props: { params: Promise<any>; searchParams: Promise<any> }) {
  use(props.params);
  use(props.searchParams);

  const db = useFirestore();
  const { user } = useUser();
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", regNo: "", semester: "1st Semester", status: "Active" });

  const [isMarksDialogOpen, setIsMarksDialogOpen] = useState(false);
  const [selectedStudentForMarks, setSelectedStudentForMarks] = useState<any>(null);
  const [marksData, setMarksData] = useState({
    session: "2024-25",
    examType: "semester",
    subjects: [
      { code: "EE301", name: "Electrical Circuits", marks: "", grade: "A" },
    ]
  });

  const onlineCount = students.filter(s => s.isOnline).length;

  const STATS = [
    { label: "Total Students", value: "1,248", icon: Users, color: "text-secondary" },
    { label: "Online Now", value: onlineCount.toString(), icon: UserCheck, color: "text-green-500" },
    { label: "Faculty Members", value: "84", icon: Briefcase, color: "text-primary" },
    { label: "System Status", value: "Healthy", icon: ShieldCheck, color: "text-green-400" },
  ];

  const RECENT_LOGINS = [
    { user: "Student User 1", type: "student", action: "Logged in from Chrome / Windows", time: "Just now" },
    { user: "Prof. Vikram Das", type: "teacher", action: "Accessed Gradebook Portal", time: "5 mins ago" },
  ];

  const getYearFromSemester = (sem: string) => {
    if (sem.includes("1st") || sem.includes("2nd")) return "1st Year";
    if (sem.includes("3rd") || sem.includes("4th")) return "2nd Year";
    if (sem.includes("5th") || sem.includes("6th")) return "3rd Year";
    if (sem.includes("7th") || sem.includes("8th")) return "4th Year";
    return "Graduated";
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStudentsForTab = (tab: string) => {
    switch(tab) {
      case "Online": return filteredStudents.filter(s => s.isOnline);
      case "1st Year": return filteredStudents.filter(s => getYearFromSemester(s.semester) === "1st Year");
      case "2nd Year": return filteredStudents.filter(s => getYearFromSemester(s.semester) === "2nd Year");
      case "3rd Year": return filteredStudents.filter(s => getYearFromSemester(s.semester) === "3rd Year");
      case "4th Year": return filteredStudents.filter(s => getYearFromSemester(s.semester) === "4th Year");
      default: return filteredStudents;
    }
  };

  const updateSubjectField = (index: number, field: string, value: string) => {
    const newSubjects = [...marksData.subjects];
    (newSubjects[index] as any)[field] = value;
    setMarksData({ ...marksData, subjects: newSubjects });
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedStudentForMarks || !user) return;
    
    setIsLoading(true);
    const marksPayload = {
      regNo: selectedStudentForMarks.regNo,
      studentName: selectedStudentForMarks.name,
      semester: selectedStudentForMarks.semester,
      session: marksData.session,
      examType: marksData.examType,
      results: marksData.subjects,
      recordedDate: serverTimestamp(),
      teacherId: user.uid,
    };

    addDoc(collection(db, "grades"), marksPayload)
      .then(() => {
        toast({ title: "Marks Submitted", description: `Results for ${selectedStudentForMarks.name} recorded.` });
        setIsMarksDialogOpen(false);
      })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: "grades", operation: 'create', requestResourceData: marksPayload }));
      })
      .finally(() => setIsLoading(false));
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !editingStudent) return;
    setIsLoading(true);
    
    // In a real app, the ID would be the student's actual UID.
    // For this prototype, we update the StudentProfile in Firestore if possible.
    const studentRef = doc(db, "users", editingStudent.id, "studentProfile", editingStudent.id);
    const updateData = {
      firstName: editingStudent.name.split(' ')[0] || "",
      lastName: editingStudent.name.split(' ')[1] || "",
      studentIdNumber: editingStudent.regNo,
      semester: editingStudent.semester,
      cgpa: parseFloat(editingStudent.cgpa) || 0,
      attendancePercentage: parseFloat(editingStudent.attendancePercentage) || 0,
    };

    setDoc(studentRef, updateData, { merge: true })
      .then(() => {
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
        toast({ title: "Record Updated", description: `Academic stats for ${editingStudent.name} synced.` });
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
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Reg No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-mono text-xs">{student.regNo}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.semester}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-primary" onClick={() => { setEditingStudent(student); setIsEditDialogOpen(true); }}>
                        <Edit2 className="h-4 w-4" /> Manage Stats
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Student / Manage Stats Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Update Academic Summary</DialogTitle>
            <DialogDescription>Set current CGPA and Attendance for {editingStudent?.name}</DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <form onSubmit={handleSaveStudent} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current CGPA</Label>
                  <Input 
                    type="number" step="0.01" max="10"
                    value={editingStudent.cgpa} 
                    onChange={(e) => setEditingStudent({...editingStudent, cgpa: e.target.value})}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Attendance (%)</Label>
                  <Input 
                    type="number" step="0.1" max="100"
                    value={editingStudent.attendancePercentage} 
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
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
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