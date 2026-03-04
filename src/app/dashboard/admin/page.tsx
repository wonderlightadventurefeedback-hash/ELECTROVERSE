
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
  FileText,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  XCircle,
  GraduationCap
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
import { 
  useFirestore, 
  useUser, 
  errorEmitter, 
  FirestorePermissionError, 
  useCollection, 
  useMemoFirebase,
  updateDocumentNonBlocking,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking
} from "@/firebase";
import { collection, serverTimestamp, doc, collectionGroup, query, where, getDocs, setDoc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type Params = Promise<{ [key: string]: string | string[] | undefined }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function AdminDashboard({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  // Explicitly unwrap promises to comply with Next.js 15
  use(params);
  use(searchParams);

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

  // Media Management State
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [imageForm, setImageForm] = useState({
    url: "",
    altText: "",
    description: "",
    category: "homepage-carousel"
  });

  // Fetch all student profiles using collectionGroup
  const studentsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collectionGroup(db, "studentProfile"));
  }, [db]);
  const { data: students, isLoading: isStudentsLoading } = useCollection(studentsQuery);

  // Fetch all images
  const imagesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "images");
  }, [db]);
  const { data: images, isLoading: isImagesLoading } = useCollection(imagesQuery);

  const STATS = [
    { label: "Total Students", value: students?.length.toString() || "0", icon: Users, color: "text-secondary" },
    { label: "Online Now", value: students?.filter(s => s.isOnline).length.toString() || "0", icon: UserCheck, color: "text-green-400" },
    { label: "Media Assets", value: images?.length.toString() || "0", icon: ImageIcon, color: "text-purple-400" },
    { label: "Faculty Members", value: "84", icon: Briefcase, color: "text-primary" },
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
    if (!db || !editingStudent) return;
    setIsLoading(true);
    
    const studentRef = doc(db, "users", editingStudent.id, "studentProfile", editingStudent.id);
    const updateData = {
      cgpa: parseFloat(editingStudent.cgpa) || 0,
      attendancePercentage: parseFloat(editingStudent.attendancePercentage) || 0,
      semester: editingStudent.semester,
    };

    updateDocumentNonBlocking(studentRef, updateData);
    toast({ title: "Record Updated", description: "Academic stats synced." });
    setIsEditDialogOpen(false);
    setIsLoading(false);
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !resultStudent) return;
    setIsLoading(true);

    const gradeId = `${resultStudent.studentIdNumber}-${resultForm.session}-${resultForm.examType}`.replace(/\s+/g, '-').toLowerCase();
    const gradeRef = doc(db, "grades", gradeId);

    const payload = {
      regNo: resultStudent.studentIdNumber,
      studentName: `${resultStudent.firstName} ${resultStudent.lastName}`,
      session: resultForm.session,
      examType: resultForm.examType,
      results: resultForm.subjects,
      recordedDate: serverTimestamp()
    };

    setDoc(gradeRef, payload, { merge: true })
      .then(() => {
        toast({ title: "Results Published", description: `Marks for ${resultStudent.firstName} have been saved.` });
        setIsResultDialogOpen(false);
      })
      .catch(error => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: gradeRef.path, operation: 'write', requestResourceData: payload }));
      })
      .finally(() => setIsLoading(false));
  };

  const handleSaveImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setIsLoading(true);

    const data = {
      ...imageForm,
      uploadDate: serverTimestamp(),
    };

    if (editingImage) {
      const imgRef = doc(db, "images", editingImage.id);
      updateDocumentNonBlocking(imgRef, data);
      toast({ title: "Image Updated", description: "Media asset has been refreshed." });
    } else {
      const imagesRef = collection(db, "images");
      addDocumentNonBlocking(imagesRef, data);
      toast({ title: "Image Added", description: "New image added to library." });
    }

    setIsImageDialogOpen(false);
    setEditingImage(null);
    setImageForm({ url: "", altText: "", description: "", category: "homepage-carousel" });
    setIsLoading(false);
  };

  const handleDeleteImage = (id: string) => {
    if (!db) return;
    const imgRef = doc(db, "images", id);
    deleteDocumentNonBlocking(imgRef);
    toast({ title: "Image Deleted", description: "Asset removed from library." });
  };

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold text-glow">Admin Control Panel</h1>
          <p className="text-muted-foreground">Managing ElectroVerse Academic Registry & Media Library.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <Card key={i} className="bg-card border-border group hover:border-secondary transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="text-[10px] uppercase tracking-wider font-bold">{stat.label}</CardDescription>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="bg-muted/20 border border-border mb-6">
          <TabsTrigger value="students" className="gap-2">
            <Users className="h-4 w-4" /> Student Registry
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <ImageIcon className="h-4 w-4" /> Media Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle className="font-headline">Manage Student Records</CardTitle>
                <CardDescription>Update stats & Publish Results.</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search Reg No or Name..." className="pl-9 h-9 bg-background" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent>
              {isStudentsLoading ? (
                <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
              ) : (
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Reg No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            {student.isOnline ? (
                              <Badge className="bg-green-500/10 text-green-500 border-none hover:bg-green-500/20 gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground border-border gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" /> Offline
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-secondary font-bold">{student.studentIdNumber || "N/A"}</TableCell>
                          <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                          <TableCell className="text-xs uppercase font-bold tracking-tighter text-muted-foreground">{student.semester}</TableCell>
                          <TableCell className="text-right flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary hover:bg-secondary/10" onClick={() => { setEditingStudent(student); setIsEditDialogOpen(true); }}>
                              <Edit2 className="h-4 w-4 mr-2" /> Stats
                            </Button>
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10" onClick={() => { setResultStudent(student); setIsResultDialogOpen(true); }}>
                              <FileText className="h-4 w-4 mr-2" /> Results
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <CardTitle className="font-headline">Media Asset Library</CardTitle>
                <CardDescription>Manage images for the homepage carousel and gallery.</CardDescription>
              </div>
              <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => { setEditingImage(null); setImageForm({ url: "", altText: "", description: "", category: "homepage-carousel" }); setIsImageDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> Add Asset
              </Button>
            </CardHeader>
            <CardContent>
              {isImagesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Skeleton className="h-48 rounded-xl" />
                  <Skeleton className="h-48 rounded-xl" />
                  <Skeleton className="h-48 rounded-xl" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images?.map((img) => (
                    <Card key={img.id} className="bg-muted/10 border-border overflow-hidden group">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={img.url} alt={img.altText} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] uppercase font-bold text-secondary">
                            {img.category.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-1">
                          <p className="text-sm font-bold truncate">{img.altText}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{img.description}</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1 h-8" onClick={() => { setEditingImage(img); setImageForm({ url: img.url, altText: img.altText, description: img.description, category: img.category }); setIsImageDialogOpen(true); }}>
                            <Edit2 className="h-3 w-3 mr-2" /> Edit
                          </Button>
                          <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteImage(img.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {images?.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">No media assets found. Start by adding one!</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Management Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editingImage ? "Edit Media Asset" : "Add New Media Asset"}</DialogTitle>
            <DialogDescription>Images will be displayed on the public pages based on category.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveImage} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <div className="flex gap-2">
                <Input placeholder="https://unsplash.com/..." value={imageForm.url} onChange={(e) => setImageForm({...imageForm, url: e.target.value})} className="bg-background flex-1" required />
                {imageForm.url && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={imageForm.url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alt Text (Accessibility)</Label>
              <Input placeholder="Describe the image..." value={imageForm.altText} onChange={(e) => setImageForm({...imageForm, altText: e.target.value})} className="bg-background" required />
            </div>
            <div className="space-y-2">
              <Label>Caption / Description</Label>
              <Input placeholder="Short description for display..." value={imageForm.description} onChange={(e) => setImageForm({...imageForm, description: e.target.value})} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Category / Placement</Label>
              <Select value={imageForm.category} onValueChange={(val) => setImageForm({...imageForm, category: val})}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage-carousel">Homepage Hero Carousel</SelectItem>
                  <SelectItem value="gallery-achievement">Gallery - Achievement</SelectItem>
                  <SelectItem value="gallery-event">Gallery - Campus Event</SelectItem>
                  <SelectItem value="student-project">Student Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {editingImage ? "Update Asset" : "Add Asset"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Result Management Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Publish Results</DialogTitle>
            <DialogDescription>Save individual marks for {resultStudent?.firstName}'s profile.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveResult} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Academic Session</Label>
                <Select value={resultForm.session} onValueChange={(v) => setResultForm({...resultForm, session: v})}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2023-24">2023-24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exam Type</Label>
                <Select value={resultForm.examType} onValueChange={(v) => setResultForm({...resultForm, examType: v})}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semester">Semester Exam</SelectItem>
                    <SelectItem value="internal">Internal Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Subject-wise Marks</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setResultForm({...resultForm, subjects: [...resultForm.subjects, { code: "", name: "", marks: "" }]})}>
                  <Plus className="h-4 w-4 mr-2" /> Add Subject
                </Button>
              </div>
              {resultForm.subjects.map((sub, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] uppercase">Code</Label>
                    <Input placeholder="EE301" value={sub.code} onChange={(e) => {
                      const newSubs = [...resultForm.subjects];
                      newSubs[i].code = e.target.value;
                      setResultForm({...resultForm, subjects: newSubs});
                    }} className="bg-background h-8 text-xs" />
                  </div>
                  <div className="flex-[2] space-y-1">
                    <Label className="text-[10px] uppercase">Name</Label>
                    <Input placeholder="Power Systems" value={sub.name} onChange={(e) => {
                      const newSubs = [...resultForm.subjects];
                      newSubs[i].name = e.target.value;
                      setResultForm({...resultForm, subjects: newSubs});
                    }} className="bg-background h-8 text-xs" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-[10px] uppercase">Marks (%)</Label>
                    <Input type="number" placeholder="85" value={sub.marks} onChange={(e) => {
                      const newSubs = [...resultForm.subjects];
                      newSubs[i].marks = e.target.value;
                      setResultForm({...resultForm, subjects: newSubs});
                    }} className="bg-background h-8 text-xs" />
                  </div>
                  {resultForm.subjects.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      const newSubs = resultForm.subjects.filter((_, idx) => idx !== i);
                      setResultForm({...resultForm, subjects: newSubs});
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Publish Results to Portal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Student Stats Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>Update Academic Stats</DialogTitle></DialogHeader>
          {editingStudent && (
            <form onSubmit={handleSaveStudent} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current CGPA</Label>
                  <Input type="number" step="0.01" value={editingStudent.cgpa} onChange={(e) => setEditingStudent({...editingStudent, cgpa: e.target.value})} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label>Attendance (%)</Label>
                  <Input type="number" step="0.1" value={editingStudent.attendancePercentage} onChange={(e) => setEditingStudent({...editingStudent, attendancePercentage: e.target.value})} className="bg-background" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={editingStudent.semester} onValueChange={(v) => setEditingStudent({...editingStudent, semester: v})}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 8}, (_, i) => `${i+1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} Semester`).map(sem => (
                      <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Academic Stats"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
