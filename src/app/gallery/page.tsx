
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GalleryPage() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery') || img.id.startsWith('hero'));

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="max-w-3xl space-y-4">
        <span className="text-secondary font-bold tracking-widest uppercase text-xs">Visual Journey</span>
        <h1 className="font-headline text-5xl font-bold">Achievement Gallery</h1>
        <p className="text-muted-foreground text-lg">
          Capturing the spirit of innovation, excellence, and departmental milestones at SparkLux Academics.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-card border border-border mb-8">
          <TabsTrigger value="all">All Photos</TabsTrigger>
          <TabsTrigger value="academic">Academic Events</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="labs">Lab Facilities</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, i) => (
            <div key={i} className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card">
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={image.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-sm font-medium text-white">{image.description}</p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
