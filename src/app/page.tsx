
import { HeroCarousel } from "@/components/home/hero-carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Award, Users, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    title: "Advanced Laboratories",
    description: "State-of-the-art power systems and microgrid simulation labs.",
    icon: Zap,
  },
  {
    title: "Industry Partnerships",
    description: "Strong ties with global leaders for internships and placements.",
    icon: Award,
  },
  {
    title: "Research Excellence",
    description: "Join pioneering research in renewable energy and smart grids.",
    icon: BookOpen,
  },
  {
    title: "Vibrant Community",
    description: "Over 500+ active students and elite faculty members.",
    icon: Users,
  },
];

const NEWS = [
  {
    date: "Oct 24, 2023",
    title: "Department hosts International Seminar on Quantum Grids",
    category: "Event",
  },
  {
    date: "Oct 18, 2023",
    title: "Final Year Students win National Solar Innovation Challenge",
    category: "Achievement",
  },
  {
    date: "Oct 12, 2023",
    title: "New Semester Registrations opening next week",
    category: "Academic",
  },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-20">
      <HeroCarousel />

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <Card key={i} className="bg-card/50 border-border hover:border-secondary/50 transition-all hover:translate-y-[-5px] duration-300">
              <CardHeader>
                <div className="p-3 bg-primary/10 w-fit rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 luxury-gradient rounded-[2rem] border border-border/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="font-headline text-4xl font-bold leading-tight">
              Shape the Future of <br />
              <span className="text-secondary">Electrical Engineering</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At ElectroVerse Academics, we don't just teach circuits; we inspire visionaries. Our curriculum is designed to challenge boundaries and foster innovation in the ever-evolving field of electrical technology.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/about">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Discover More
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" size="lg" className="border-secondary/50 text-secondary hover:bg-secondary/10">
                  View Achievement Gallery
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-2xl font-bold">Latest Updates</h3>
              <Link href="/news" className="text-secondary text-sm flex items-center gap-2 hover:underline">
                View all news <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {NEWS.map((item, i) => (
                <div key={i} className="p-5 bg-background/50 border border-border rounded-xl flex justify-between items-center group cursor-pointer hover:border-secondary transition-colors">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1 block">
                      {item.category}
                    </span>
                    <h4 className="font-medium group-hover:text-secondary transition-colors">{item.title}</h4>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
