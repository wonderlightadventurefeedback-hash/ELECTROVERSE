
"use client";

import { useMemo, use, useState } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Maximize2, X } from "lucide-react";
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
} from "@/components/ui/dialog";

type Params = Promise<{ [key: string]: string | string[] | undefined }>;

export default function GalleryPage({ params }: { params: Params }) {
  // Explicitly unwrap params to comply with Next.js 15
  use(params);
  
  const db = useFirestore();
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const galleryQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "images");
  }, [db]);

  const { data: firestoreImages, isLoading } = useCollection(galleryQuery);

  const displayImages = useMemo(() => {
    if (isLoading) return [];
    
    let galleryImages: any[] = [];

    // If we have images in Firestore, filter for gallery-related ones
    if (firestoreImages && firestoreImages.length > 0) {
      // Prioritize gallery categories
      const specificGalleryItems = firestoreImages.filter(img => 
        img.category === 'gallery-achievement' || 
        img.category === 'gallery-event' || 
        img.category === 'student-project'
      );

      // If no specific gallery items, use all available images
      galleryImages = specificGalleryItems.length > 0 ? specificGalleryItems : firestoreImages;

      return galleryImages.map(img => ({
        src: img.url,
        alt: img.altText || img.description || "Gallery Image",
        category: img.category?.replace("-", " ") || "Achievement"
      }));
    }

    // Fallback to static placeholders if no Firestore data
    return PlaceHolderImages.filter(img => 
      img.id.startsWith('gallery') || img.id.startsWith('hero')
    ).map(img => ({
      src: img.imageUrl,
      alt: img.description,
      category: "Achievement"
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
            Explore our departmental milestones, cutting-edge facilities, and student innovations. A visual record of excellence at SparkLux Academics.
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
                    <span className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {img.category}
                    </span>
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
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                    {img.category}
                  </span>
                  <h3 className="text-xl font-bold">{img.alt}</h3>
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
