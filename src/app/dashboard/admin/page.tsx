
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
  X
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
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const INITIAL_STUDENTS = [
  { id: "1", regNo: "SPARK2024-001", name: "Student User 1", semester: "2nd Semester", status: "Active" },
  { id: "2", regNo: "SPARK2024-002", name: "Student User 2", semester: "3rd Semester", status: "Active" },
  { id: "3", regNo: "SPARK2024-003", name: "Student User 3", semester: "4th Semester", status: "Active" },
  { id: "4", regNo: "SPARK2024-004", name: "Student User 4", semester: "1st Semester", status: "Active" },
  { id: "5", regNo: "SPARK2024-005", name: "Student User 5", semester: "6th Semester", status: "Active" },
  { id: "6", regNo: "SPARK2024-006", name: "Student User 6", semester: "8th Semester", status: "Active" },
  { id: "7", regNo: "SPARK2024-007", name: "Student User 7", semester: "5th Semester", status: "Active" },
  { id: "8", regNo: "SPARK2024-008", name: "Student User 8", semester: "7th Semester", status: "Active" },
];

const INITIAL_STATS = [
  { label: "Total Students", value: "1,248", icon: Users, color: "text-secondary" },
  { label: "Faculty Members", value: "84", icon: Users, color: "text-secondary" },
  { label: "Active Results", value: "12 Sessions", icon: BarChart3, color: "text-secondary" },
  { label: "System Status", value: "Healthy", icon: ShieldCheck, color: "text-green-500" },
];

export default function AdminDashboard() {
  const db = useFirestore();
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [stats, setStats] = useState(INITIAL_STATS);
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
      { code: "EE302", name: "Microprocessors", marks: "", grade: "B" },
    ]
  });

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

  const studentsByYear = {
    "All": filteredStudents,
    "1st Year": filteredStudents.filter(s => getYearFromSemester(s.semester) === "1st Year"),
    "2nd Year": filteredStudents.filter(s => getYearFromSemester(s.semester) === "2nd Year"),
    "3rd Year": filteredStudents.filter(s => getYearFromSemester(s.semester) === "3rd Year"),
    "4th Year": filteredStudents.filter(s => getYearFromSemester(s.semester) === "4th Year"),
  };

  const addSubjectRow = () => {
    setMarksData({
      ...marksData,
      subjects: [...marksData.subjects, { code: "", name: "", marks: "", grade: "A" }]
    });
  };

  const removeSubjectRow = (index: number) => {
    const newSubjects = [...marksData.subjects];
    newSubjects.splice(index, 1);
    setMarksData({ ...marksData, subjects: newSubjects });
  };

  const updateSubjectField = (index: number, field: string, value: string) => {
    const newSubjects = [...marksData.subjects];
    (newSubjects[index] as any)[field] = value;
    setMarksData({ ...marksData, subjects: newSubjects });
  };

  const handleSaveMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !selectedStudentForMarks) return;
    setIsLoading(true);

    try {
      await addDoc(collection(db, "grades"), {
        regNo: selectedStudentForMarks.regNo,
        studentName: selectedStudentForMarks.name,
        semester: selectedStudentForMarks.semester,
        session: marksData.session,
        examType: marksData.examType,
        results: marksData.subjects,
        recordedDate: serverTimestamp(),
      });

      toast({
        title: "Marks Stored",
        description: `Results for ${selectedStudentForMarks.name} have been published.`,
      });
      setIsMarksDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to store marks. Please check permissions.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
      toast({
        title: "Record Updated",
        description: `Student ${editingStudent.name} has been updated successfully.`,
      });
      setIsLoading(false);
      setIsEditDialogOpen(false);
    }, 800);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const studentToAdd = {
        ...newStudent,
        id: (students.length + 1).toString(),
      };
      setStudents(prev => [...prev, studentToAdd]);
      toast({
        title: "Student Enrolled",
        description: `${newStudent.name} has been added to the database.`,
      });
      setIsLoading(false);
      setIsAddDialogOpen(false);
      setNewStudent({ name: "", regNo: "", semester: "1st Semester", status: "Active" });
    }, 800);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    toast({
      variant: "destructive",
      title: "Record Deleted",
      description: "The student record has been removed.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold">Admin Control Panel</h1>
          <p className="text-muted-foreground">Welcome back, Nalanda EE Admin.</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2">
                <UserPlus className="h-4 w-4" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Enroll New Student</DialogTitle>
                <DialogDescription>Add a new student record to the academic registry.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input 
                    placeholder="SPARK2024-XXX" 
                    className="bg-background"
                    value={newStudent.regNo}
                    onChange={(e) => setNewStudent({...newStudent, regNo: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    placeholder="Enter student's full name" 
                    className="bg-background"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select 
                    value={newStudent.semester} 
                    onValueChange={(val) => setNewStudent({...newStudent, semester: val})}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 8}, (_, i) => `${i+1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Semester`).map(sem => (
                        <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="gap-2" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Confirm Enrollment
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="border-secondary/30 text-secondary">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-card border-border group hover:border-secondary transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{stat.label}</CardDescription>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-3 bg-card border-border">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-headline">Manage Student Records</CardTitle>
              <CardDescription>Records categorized by academic year</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students..." 
                className="pl-9 h-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="All" className="w-full">
              <TabsList className="bg-muted/50 border border-border mb-6 flex flex-wrap h-auto p-1">
                {Object.keys(studentsByYear).map(year => (
                  <TabsTrigger key={year} value={year} className="flex-1 py-2">
                    {year}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(studentsByYear).map(([year, list]) => (
                <TabsContent key={year} value={year} className="mt-0">
                  <div className="rounded-md border border-border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead>Reg No</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Semester</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.length > 0 ? (
                          list.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-mono text-xs">{student.regNo}</TableCell>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>{student.semester}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  student.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                }`}>
                                  {student.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-secondary"
                                  title="Add Marks"
                                  onClick={() => {
                                    setSelectedStudentForMarks(student);
                                    setIsMarksDialogOpen(true);
                                  }}
                                >
                                  <FileSpreadsheet className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-primary"
                                  onClick={() => {
                                    setEditingStudent(student);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteStudent(student.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                              No students found for this category.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-secondary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { user: "Dr. Sarah Smith", action: "Published internal results", time: "2 hours ago" },
              { user: "System", action: "Backup completed successfully", time: "5 hours ago" },
              { user: "Admin", action: "Updated semester dates", time: "1 day ago" },
            ].map((activity, i) => (
              <div key={i} className="flex flex-col gap-1 border-l-2 border-primary/30 pl-4 py-1">
                <span className="text-xs text-muted-foreground">{activity.time}</span>
                <p className="text-sm font-medium">{activity.action}</p>
                <span className="text-[10px] text-secondary font-bold uppercase">{activity.user}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Manage Marks Dialog */}
      <Dialog open={isMarksDialogOpen} onOpenChange={setIsMarksDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Student Marks</DialogTitle>
            <DialogDescription>Record academic results for {selectedStudentForMarks?.name}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMarks} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Session</Label>
                <Select 
                  value={marksData.session} 
                  onValueChange={(val) => setMarksData({...marksData, session: val})}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2023-24">2023-24</SelectItem>
                    <SelectItem value="2022-23">2022-23</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select 
                  value={marksData.examType} 
                  onValueChange={(val) => setMarksData({...marksData, examType: val})}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semester">Semester Results</SelectItem>
                    <SelectItem value="internal">Internal Results</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-secondary font-bold uppercase tracking-widest text-xs">Subject Scores</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addSubjectRow}
                  className="h-8 gap-2 text-xs border-secondary/30 text-secondary"
                >
                  <Plus className="h-3 w-3" /> Add Subject
                </Button>
              </div>
              
              <div className="space-y-3">
                {marksData.subjects.map((subject, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end bg-muted/20 p-3 rounded-lg border border-border relative group">
                    <div className="col-span-3 space-y-1">
                      <Label className="text-[10px]">Code</Label>
                      <Input 
                        value={subject.code} 
                        onChange={(e) => updateSubjectField(index, 'code', e.target.value)}
                        className="bg-background h-8 text-xs" 
                        placeholder="EE301"
                        required
                      />
                    </div>
                    <div className="col-span-5 space-y-1">
                      <Label className="text-[10px]">Subject</Label>
                      <Input 
                        value={subject.name} 
                        onChange={(e) => updateSubjectField(index, 'name', e.target.value)}
                        className="bg-background h-8 text-xs" 
                        placeholder="Subject Name"
                        required
                      />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <Label className="text-[10px]">Marks (%)</Label>
                      <Input 
                        type="number" 
                        placeholder="0-100" 
                        className="bg-background h-8 text-xs"
                        value={subject.marks}
                        onChange={(e) => updateSubjectField(index, 'marks', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-1 flex justify-center pb-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeSubjectRow(index)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        disabled={marksData.subjects.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border">
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Publish Results
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Edit Student Record</DialogTitle>
            <DialogDescription>Modify enrollment details for {editingStudent?.regNo}</DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <form onSubmit={handleSaveStudent} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={editingStudent.name} 
                  onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  className="bg-background"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select 
                    value={editingStudent.semester} 
                    onValueChange={(val) => setEditingStudent({...editingStudent, semester: val})}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 8}, (_, i) => `${i+1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Semester`).map(sem => (
                        <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={editingStudent.status} 
                    onValueChange={(val) => setEditingStudent({...editingStudent, status: val})}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Graduated">Graduated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="gap-2" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
