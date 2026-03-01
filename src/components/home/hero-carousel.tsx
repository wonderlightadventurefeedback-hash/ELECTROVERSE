
"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  const heroImages = PlaceHolderImages.filter(img => img.id.startsWith('hero'));

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent className="-ml-0 h-full">
          {heroImages.map((image, index) => (
            <CarouselItem key={index} className="pl-0 h-full relative">
              <div className="relative w-full h-full">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  data-ai-hint={image.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent flex items-center">
                  <div className="container mx-auto px-4 md:px-8 max-w-4xl space-y-6">
                    <span className="inline-block px-4 py-1.5 bg-primary/20 text-secondary border border-primary/30 rounded-full text-xs font-bold tracking-widest uppercase">
                      Excellence in Engineering
                    </span>
                    <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                      Igniting <span className="text-secondary text-glow">Innovations</span><br />
                      Empowering <span className="text-primary-foreground">Futures</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                      Join the SparkLux Electrical Engineering Department and transform the world with sustainable energy and advanced power systems.
                    </p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        {heroImages.map((_, i) => (
          <div key={i} className="h-1 w-8 bg-muted-foreground/30 rounded-full overflow-hidden">
            <div className="h-full bg-secondary animate-progress" />
          </div>
        ))}
      </div>
    </section>
  );
}
