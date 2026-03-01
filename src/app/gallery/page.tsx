import { PlaceHolderImages } from "@/lib/placeholder-images";
import DomeGallery from "@/components/ui/dome-gallery";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GalleryPage() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery') || img.id.startsWith('hero'));

  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      <div className="space-y-8">
        <Link href="/">
          <Button variant="ghost" className="group gap-2 text-muted-foreground hover:text-secondary -ml-4 transition-colors">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </Link>
        
        <div className="max-w-3xl space-y-4">
          <span className="text-secondary font-bold tracking-widest uppercase text-xs">Visual Journey</span>
          <h1 className="font-headline text-5xl font-bold">Achievement Gallery</h1>
          <p className="text-muted-foreground text-lg">
            Explore our departmental milestones and cutting-edge facilities through an immersive 3D lens. Capturing the spirit of innovation at SparkLux Academics.
          </p>
        </div>
      </div>

      <div className="h-[700px] w-full relative rounded-[3rem] overflow-hidden border border-border bg-card/20 shadow-2xl">
        <DomeGallery 
          images={galleryImages.map(img => ({ src: img.imageUrl, alt: img.description }))}
          grayscale={false}
          overlayBlurColor="hsl(240 19% 15%)"
          imageBorderRadius="24px"
          openedImageBorderRadius="32px"
        />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-background/80 backdrop-blur-md px-6 py-2 rounded-full border border-border shadow-lg">
            <p className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
              Drag to explore <span className="w-4 h-px bg-secondary opacity-30"></span> Click to enlarge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
