import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GalleryMedia } from '../../types';
import { Image as ImageIcon, Video, X, ChevronLeft, ChevronRight, Calendar, Camera } from 'lucide-react';

export const Gallery: React.FC = () => {
  const { gallery, language } = useApp();
  const isBn = language === 'bn';

  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredMedia = gallery.filter((item) => {
    if (activeFilter === 'image') return item.mediaType === 'image';
    if (activeFilter === 'video') return item.mediaType === 'video';
    return true;
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredMedia.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredMedia.length) % filteredMedia.length);
    }
  };

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Camera className="w-4 h-4" />
          <span>{isBn ? 'ফটো ও ভিডিও আর্কাইভ' : 'Official Media Gallery'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {isBn ? 'স্মরণীয় ফুটবল মুহূর্তসমূহ' : 'Moments & Action Gallery'}
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          {isBn
            ? 'ম্যাচ অ্যাকশন, অনুশীলন সেশন, ট্রফি উদযাপন এবং সমর্থকদের আনন্দঘন মুহূর্তের চিত্রশালা।'
            : 'Explore photos and video highlights from our matches, training sessions, and celebrations.'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {isBn ? 'সকল মিডিয়া' : 'All Media'}
          </button>
          <button
            onClick={() => setActiveFilter('image')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'image'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isBn ? 'ছবি' : 'Photos'}</span>
          </button>
          <button
            onClick={() => setActiveFilter('video')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'video'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>{isBn ? 'ভিডিও' : 'Videos'}</span>
          </button>
        </div>

        {/* Gallery Grid */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">কোনো ছবি বা ভিডিও পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400">অ্যাডমিন প্যানেল থেকে নতুন ফটো আপলোড করা যাবে।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedia.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => openLightbox(idx)}
                className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <img
                  src={item.url || 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop'}
                  alt={item.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.hasFallenBack) {
                      target.dataset.hasFallenBack = 'true';
                      target.src = 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop';
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {item.mediaType === 'video' && (
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 text-rose-400 flex items-center justify-center backdrop-blur-sm border border-slate-700">
                    <Video className="w-4 h-4" />
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-sm font-bold text-white truncate drop-shadow">{item.title}</h4>
                  {item.caption && (
                    <p className="text-xs text-slate-300 truncate drop-shadow">{item.caption}</p>
                  )}
                  {item.date && (
                    <span className="text-[10px] text-slate-400 block mt-1">{item.date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredMedia[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white flex items-center justify-center border border-slate-700 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 transition cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 transition cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Media Container */}
          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center">
            <div className="max-h-[70vh] overflow-hidden rounded-2xl border border-slate-800 flex items-center justify-center bg-slate-950">
              <img
                src={filteredMedia[lightboxIndex].url || 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1200&auto=format&fit=crop'}
                alt={filteredMedia[lightboxIndex].title}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.hasFallenBack) {
                    target.dataset.hasFallenBack = 'true';
                    target.src = 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1200&auto=format&fit=crop';
                  }
                }}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <h3 className="text-lg font-bold">{filteredMedia[lightboxIndex].title}</h3>
              {filteredMedia[lightboxIndex].caption && (
                <p className="text-sm text-slate-400 mt-1">{filteredMedia[lightboxIndex].caption}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
