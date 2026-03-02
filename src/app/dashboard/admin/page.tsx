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
  GraduationCap,
  UserPlus
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
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", regNo: "", semester: "1st Semester", status: "Active" });

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

  const handleUpdateStats = (index: number, newValue: string) => {
    const newStats = [...stats];
    newStats[index].value = newValue;
    setStats(newStats);
    toast({
      title: "Stat Updated",
      description: `${newStats[index].label} is now ${newValue}.`,
    });
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

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="h-4 w-4" /> New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Post New Announcement</DialogTitle>
                <DialogDescription>This will be visible to all students and faculty.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input placeholder="Announcement Title" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select defaultValue="academic">
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => toast({ title: "Announcement Published" })}>Publish Announcement</Button>
              </DialogFooter>
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
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-secondary">
                      <Edit2 className="h-3 w-3" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle>Update {stat.label}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Input 
                        defaultValue={stat.value} 
                        onChange={(e) => handleUpdateStats(i, e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
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
            <Button variant="ghost" className="w-full text-xs text-muted-foreground">View All Activity Log</Button>
          </CardContent>
        </Card>
      </div>

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
