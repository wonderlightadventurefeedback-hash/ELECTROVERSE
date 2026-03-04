
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

const NEWS_ITEMS = [
  {
    title: "International Seminar on Quantum Smart Grids",
    date: "Oct 24, 2023",
    category: "Event",
    desc: "Join global experts as they discuss the integration of quantum computing in modern power distribution.",
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "National Solar Innovation Challenge Winners",
    date: "Oct 18, 2023",
    category: "Achievement",
    desc: "Our final year team 'SparkLabs' secured the first prize in the national-level innovation contest.",
    image: "https://images.unsplash.com/photo-1509391366360-fe5bb58583bb?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Semester Registrations 2024-25 Open",
    date: "Oct 12, 2023",
    category: "Academic",
    desc: "Registration portal is now open for the upcoming spring semester. Enroll before the deadline.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "New Advanced Robotics Lab Inauguration",
    date: "Sep 28, 2023",
    category: "Infrastructure",
    desc: "The department welcomes a new suite of KUKA industrial robots for the automation research track.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595f?auto=format&fit=crop&q=80&w=800"
  }
];

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="max-w-3xl space-y-4">
        <h1 className="font-headline text-5xl font-bold">News & Announcements</h1>
        <p className="text-muted-foreground text-lg italic">Stay updated with the latest events and academic milestones at ElectroVerse.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {NEWS_ITEMS.map((item, i) => (
          <Card key={i} className="bg-card border-border overflow-hidden hover:border-secondary transition-all group">
            <div className="aspect-[21/9] overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-secondary/10 text-secondary border-none">{item.category}</Badge>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </div>
              </div>
              <CardTitle className="font-headline text-2xl group-hover:text-secondary transition-colors">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              <button className="flex items-center gap-2 text-secondary text-sm font-bold hover:underline">
                Read Full Story <ArrowRight className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
