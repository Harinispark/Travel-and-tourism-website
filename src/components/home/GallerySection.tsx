import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { Sparkles, MapPin, Eye, X, Camera, Compass } from 'lucide-react';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'All Perspectives' },
    { id: 'pilgrimage', label: 'Temple Sanctums' },
    { id: 'scenic', label: 'Coastal & Hills' },
    { id: 'fleet', label: 'Executive Mobility' },
  ];

  const filtered = galleryItems.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  return (
    <section id="gallery" className="relative py-24 bg-slate-50/80 border-t border-slate-200/90 overflow-hidden">
      {/* Decorative ambient elements */}
      <div className="absolute inset-0 pattern-latlong opacity-25 pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-pink-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#BE185D] font-bold">
                07. Visual Story
              </span>
              <span className="h-1 w-8 bg-amber-400/80 rounded-full" />
              <span className="text-[11px] font-semibold text-slate-500 font-mono">Real Travel Chronicles</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Moments in Motion
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-normal leading-relaxed">
              Real journeys captured across Tamil Nadu, Andhra Pradesh, Kerala highlands, and Arabian corridors.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 self-start md:self-auto overflow-x-auto shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#BE185D] to-[#D4AF37] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetrical Editorial Gallery Composition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
          {filtered.map((item, idx) => {
            const isLarge = idx === 0 || idx === 3;
            const colSpan = isLarge ? 'lg:col-span-8' : 'lg:col-span-4';
            const height = isLarge ? 'h-80 sm:h-96' : 'h-80';

            return (
              <div
                key={item.id}
                onClick={() => setActivePhoto(item)}
                className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-amber-400 ${colSpan} ${height}`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                {/* Floating Top Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                    {item.category}
                  </span>
                  <span className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-4 w-4" />
                  </span>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-5 left-5 right-5 space-y-1 text-white">
                  <h4 className="font-display text-lg sm:text-xl font-bold group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>
                  {item.caption && (
                    <p className="text-xs text-slate-200 line-clamp-1 italic font-serif-luxury">
                      "{item.caption}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl overflow-hidden border border-white/20 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={activePhoto.imageUrl}
              alt={activePhoto.title}
              className="max-h-[75vh] w-full object-contain bg-black"
            />
            <div className="p-6 bg-slate-900 text-white">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                {activePhoto.category}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold mt-1">
                {activePhoto.title}
              </h3>
              {activePhoto.caption && (
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-serif-luxury italic">
                  "{activePhoto.caption}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
