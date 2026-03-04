
"use client";

import { useMemo, use, useState, useEffect } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Maximize2, X, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

type Params = Promise<{ [key: string]: string | string[] | undefined }>;

export default function GalleryPage({ params }: { params: Params }) {
  // Explicitly unwrap params to comply with Next.js 15
  const unwrappedParams = use(params);
  
  const db = useFirestore();
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; category: string; date?: string } | null>(null);

  const galleryQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "images");
  }, [db]);

  const { data: firestoreImages, isLoading } = useCollection(galleryQuery);

  const displayImages = useMemo(() => {
    if (isLoading) return [];
    
    let galleryImages: any[] = [];

    if (firestoreImages && firestoreImages.length > 0) {
      const specificGalleryItems = firestoreImages.filter(img => 
        img.category === 'gallery-achievement' || 
        img.category === 'gallery-event' || 
        img.category === 'student-project'
      );

      galleryImages = specificGalleryItems.length > 0 ? specificGalleryItems : firestoreImages;

      return galleryImages.map(img => {
        let dateStr = "Recently";
        if (img.uploadDate) {
          try {
            // Handle Firestore Timestamp or string
            const d = img.uploadDate?.seconds ? new Date(img.uploadDate.seconds * 1000) : new Date(img.uploadDate);
            dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          } catch (e) {
            dateStr = "Academic Session";
          }
        }

        return {
          src: img.url,
          alt: img.altText || img.description || "Gallery Image",
          category: img.category?.replace("-", " ") || "Achievement",
          date: dateStr
        };
      });
    }

    return PlaceHolderImages.filter(img => 
      img.id.startsWith('gallery') || img.id.startsWith('hero')
    ).map(img => ({
      src: img.imageUrl,
      alt: img.description,
      category: "Achievement",
      date: "Academic Milestone"
    }));
  }, [firestoreImages, isLoading]);

  return (
    <div className="container mx-auto px-4 py-16 space-y-12 min-h-screen">
      <div className="space-y-8">
        <Link href="/">
          <Button variant="ghost" className="group gap-2 text-muted-foreground hover:text-secondary -ml-4 transition-colors">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </Link>
        
        <div className="max-w-3xl space-y-4">
          <span className="text-secondary font-bold tracking-widest uppercase text-xs">Visual Journey</span>
          <h1 className="font-headline text-5xl font-bold text-glow">Achievement Gallery</h1>
          <p className="text-muted-foreground text-lg">
            Explore our departmental milestones and cutting-edge facilities. Capturing the spirit of innovation at ELECTROVERSE.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="h-12 w-12 text-secondary animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">Loading Visual Assets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayImages.map((img, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <Card 
                  className="group relative aspect-square overflow-hidden border-border bg-card cursor-pointer hover:border-secondary/50 transition-all duration-500"
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="flex items-center gap-2 mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-[10px] uppercase font-bold text-secondary tracking-widest">
                        {img.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] font-medium text-white/70">
                        {img.date}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {img.alt}
                    </p>
                    <div className="absolute top-4 right-4 p-2 bg-secondary/20 backdrop-blur-md rounded-full text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="h-4 w-4" />
                    </div>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-5xl bg-background/95 backdrop-blur-xl border-border p-0 overflow-hidden">
                <div className="relative aspect-video w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                  <DialogClose className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors outline-none">
                    <X className="h-5 w-5" />
                  </DialogClose>
                </div>
                <div className="p-8 space-y-2 bg-card/50">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                        {img.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {img.date}
                      </div>
                    </div>
                    <DialogTitle className="text-xl font-bold">{img.alt}</DialogTitle>
                  </DialogHeader>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      {!isLoading && displayImages.length === 0 && (
        <div className="py-40 text-center border-2 border-dashed border-border rounded-[2rem]">
          <p className="text-muted-foreground">No gallery items found at this time.</p>
        </div>
      )}
    </div>
  );
}
