
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const db = useFirestore();

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const heroQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "images"), where("category", "==", "homepage-carousel"));
  }, [db]);

  const { data: firestoreImages, isLoading } = useCollection(heroQuery);

  // Fallback to static placeholders if no images found in Firestore
  const displayImages = React.useMemo(() => {
    if (!firestoreImages || firestoreImages.length === 0) {
      return PlaceHolderImages.filter(img => img.id.startsWith('hero')).map(img => ({
        url: img.imageUrl,
        description: img.description,
        altText: img.description,
        imageHint: img.imageHint
      }));
    }
    return firestoreImages;
  }, [firestoreImages]);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent className="-ml-0 h-full">
          {displayImages.map((image, index) => (
            <CarouselItem key={index} className="pl-0 h-full relative">
              <div className="relative w-full h-full">
                <Image
                  src={image.url}
                  alt={image.altText || image.description}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                  data-ai-hint={image.imageHint || "electrical engineering"}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent flex items-center">
                  <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-6">
                    <span className="inline-block px-4 py-1.5 bg-primary/20 text-secondary border border-primary/30 rounded-full text-xs font-bold tracking-widest uppercase">
                      {image.description}
                    </span>
                    <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                      Igniting <span className="text-secondary text-glow">Innovations</span><br />
                      Empowering <span className="text-primary-foreground">Futures</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                      Join the ElectroVerse Electrical Engineering Department and transform the world with sustainable energy and advanced power systems.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {displayImages.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-1.5 transition-all duration-300 rounded-full",
              current === i ? "w-12 bg-secondary" : "w-6 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
