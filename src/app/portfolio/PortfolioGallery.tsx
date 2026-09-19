"use client";

import { useState } from "react";
import Image from "next/image";

type Photo = {
  id: string;
  title: string;
  image_url: string;
  category: string;
};

export default function PortfolioGallery({ initialPhotos, categories }: { initialPhotos: Photo[], categories: string[] }) {
  const [filter, setFilter] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allCategories = ["ALL", ...categories];

  const filteredPhotos = filter === "ALL" 
    ? initialPhotos 
    : initialPhotos.filter(p => p.category?.toUpperCase() === filter);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-6 mb-12">
        {allCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`uppercase tracking-wider text-sm pb-1 border-b transition-colors ${
              filter === cat ? "border-primary text-primary" : "border-transparent text-muted hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredPhotos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="break-inside-avoid relative group cursor-pointer overflow-hidden bg-muted/10"
            onClick={() => setLightboxIndex(index)}
          >
            <Image
              src={photo.image_url}
              alt={photo.title || "Portfolio Image"}
              width={800}
              height={1200}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              placeholder="blur"
              blurDataURL={photo.image_url.replace('/upload/', '/upload/e_blur:1000,q_1,f_webp,w_100/')}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4">
          <button 
            className="absolute top-8 right-8 text-primary hover:text-accent uppercase tracking-widest text-sm z-50"
            onClick={() => setLightboxIndex(null)}
          >
            Close
          </button>
          
          <button 
            className="absolute left-8 top-1/2 -translate-y-1/2 text-primary hover:text-accent uppercase tracking-widest text-sm z-50"
            onClick={() => setLightboxIndex(prev => prev! > 0 ? prev! - 1 : filteredPhotos.length - 1)}
          >
            Prev
          </button>

          <button 
            className="absolute right-8 top-1/2 -translate-y-1/2 text-primary hover:text-accent uppercase tracking-widest text-sm z-50"
            onClick={() => setLightboxIndex(prev => prev! < filteredPhotos.length - 1 ? prev! + 1 : 0)}
          >
            Next
          </button>

          <div className="relative w-full max-w-5xl h-[85vh]">
            <Image
              src={filteredPhotos[lightboxIndex].image_url}
              alt="Lightbox image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
