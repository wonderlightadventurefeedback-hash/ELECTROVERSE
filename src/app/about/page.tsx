
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Target, Eye, Award, GraduationCap, Microscope } from "lucide-react";

const VALUES = [
  { title: "Innovation", icon: Zap, desc: "Pushing the boundaries of electrical technology." },
  { title: "Academic Rigor", icon: Target, desc: "Maintaining elite standards in engineering education." },
  { title: "Visionary Leadership", icon: Eye, desc: "Preparing students for global energy challenges." },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-24">
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="font-headline text-5xl md:text-6xl font-bold">Pioneering the Future of Energy</h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          The SparkLux Electrical Engineering Department is a global leader in power systems research and technical education. Founded with a vision to revolutionize sustainable infrastructure, we bridge the gap between theoretical excellence and industrial application.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {VALUES.map((v, i) => (
          <Card key={i} className="bg-card border-border hover:border-secondary transition-colors">
            <CardHeader>
              <v.icon className="h-10 w-10 text-secondary mb-4" />
              <CardTitle className="font-headline text-2xl">{v.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{v.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-12">
        <div className="space-y-6">
          <h2 className="font-headline text-4xl font-bold">Our Academic Heritage</h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border">
              <GraduationCap className="h-6 w-6 text-secondary shrink-0" />
              <p className="text-sm text-muted-foreground">Established in 1995, SparkLux has consistently ranked in the top 1% of engineering institutes nationwide.</p>
            </div>
            <div className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border">
              <Microscope className="h-6 w-6 text-secondary shrink-0" />
              <p className="text-sm text-muted-foreground">Our 12 specialized research labs have produced over 450+ international patents in smart grid technology.</p>
            </div>
            <div className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border">
              <Award className="h-6 w-6 text-secondary shrink-0" />
              <p className="text-sm text-muted-foreground">Accredited by global engineering boards for excellence in curriculum and placement output.</p>
            </div>
          </div>
        </div>
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-border">
          <img 
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" 
            alt="Collaboration space"
            className="object-cover w-full h-full"
          />
        </div>
      </section>
    </div>
  );
}
