import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NewsArticle } from '../../types';
import { Newspaper, Calendar, User, ArrowRight, X, Sparkles, Tag } from 'lucide-react';

export const News: React.FC = () => {
  const { news, language } = useApp();
  const isBn = language === 'bn';

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticleModal, setActiveArticleModal] = useState<NewsArticle | null>(null);

  const categories = ['All', 'Match Report', 'Club Announcement', 'Event', 'Player News', 'General'];

  // Only show published articles for public visitors
  const publishedNews = news.filter((n) => n.status === 'published');

  const filteredNews = publishedNews.filter((n) => {
    if (selectedCategory === 'All') return true;
    return n.category === selectedCategory;
  });

  const featuredArticle = publishedNews.find((n) => n.isFeatured) || publishedNews[0];

  return (
    <div className="min-h-screen py-16 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Newspaper className="w-4 h-4" />
          <span>{isBn ? 'খবর, ঘোষণা ও প্রেস রিলিজ' : 'Club News & Press'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {isBn ? 'সাম্প্রতিক ক্লাব সংবাদ' : 'Latest News & Announcements'}
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          {isBn
            ? 'ছোটখাতা স্পোর্টিং ক্লাবের ম্যাচের খবর, একাডেমি ট্রায়াল ও নোটিশের নির্ভরযোগ্য উৎস।'
            : 'Stay updated with official match reviews, player signings, fixtures and club notices.'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Featured Big News Banner */}
        {featuredArticle && (
          <div
            onClick={() => setActiveArticleModal(featuredArticle)}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl cursor-pointer grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 relative aspect-16/10 overflow-hidden bg-slate-950">
              <img
                src={featuredArticle.coverImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop'}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FEATURED STORY</span>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                    {featuredArticle.category}
                  </span>
                  <span>{featuredArticle.publishedAt}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-400 transition-colors leading-snug mb-4">
                  {featuredArticle.title}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
                  {featuredArticle.summary || featuredArticle.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="text-slate-500 font-medium">{featuredArticle.author}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {isBn ? 'সম্পূর্ণ খবর পড়ুন' : 'Read Article'} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((article) => (
            <div
              key={article.id}
              onClick={() => setActiveArticleModal(article)}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl transition hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                  <img
                    src={article.coverImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-slate-700">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-xs text-slate-500 mb-2">{article.publishedAt}</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {article.summary || article.content}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 mt-4">
                <span className="truncate max-w-[140px] text-slate-500">{article.author}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {isBn ? 'পড়ুন' : 'Read'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-left relative">
            <button
              onClick={() => setActiveArticleModal(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 text-white flex items-center justify-center hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeArticleModal.coverImage && (
              <div className="relative aspect-16/9 bg-slate-950 shrink-0">
                <img
                  src={activeArticleModal.coverImage}
                  alt={activeArticleModal.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  {activeArticleModal.category}
                </span>
                <span>{activeArticleModal.publishedAt}</span>
                <span>•</span>
                <span>{activeArticleModal.author}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {activeArticleModal.title}
              </h2>

              <div className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-800 pt-4">
                {activeArticleModal.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
