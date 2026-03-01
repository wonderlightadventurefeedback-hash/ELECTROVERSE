
"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Users, 
  FileText, 
  Settings, 
  ShieldCheck, 
  BarChart3, 
  Bell,
  Search,
  Plus
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

const RECENT_ACTIVITIES = [
  { user: "Dr. Sarah Smith", action: "Published internal results", time: "2 hours ago" },
  { user: "System", action: "Backup completed successfully", time: "5 hours ago" },
  { user: "Admin", action: "Updated semester dates", time: "1 day ago" },
];

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold">Admin Control Panel</h1>
          <p className="text-muted-foreground">Welcome back, Nalanda EE Admin.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="h-4 w-4" /> New Announcement
          </Button>
          <Button variant="outline" className="border-secondary/30 text-secondary">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Students</CardDescription>
              <Users className="h-4 w-4 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-bold">1,248</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Faculty Members</CardDescription>
              <Users className="h-4 w-4 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-bold">84</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Active Results</CardDescription>
              <BarChart3 className="h-4 w-4 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-bold">12 Sessions</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>System Status</CardDescription>
              <ShieldCheck className="h-4 w-4 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Healthy</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Manage Student Records</CardTitle>
              <CardDescription>Search and edit student enrollment details</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by Reg No..." className="pl-9 h-9" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reg No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">SPARK2024-00{i}</TableCell>
                    <TableCell className="font-medium">Student User {i}</TableCell>
                    <TableCell>{i % 4 + 1}th Sem</TableCell>
                    <TableCell>
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase">Active</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-secondary">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bell className="h-5 w-5 text-secondary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {RECENT_ACTIVITIES.map((activity, i) => (
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
    </div>
  );
}
