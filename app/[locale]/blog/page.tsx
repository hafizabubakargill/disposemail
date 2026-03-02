'use client';

import { getSortedPosts } from "@/lib/blog";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useParams } from "next/navigation";

export default function BlogPage() {
    const t = useTranslations('Blog');
    const { locale } = useParams();
    const posts = getSortedPosts(locale as string);
    return (
        <div className="max-w-5xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-gray-900 dark:text-white">
                    {t('title')}<span className="text-blue-600">.</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-2xl"
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="p-8 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-widest rounded-full">
                                    {post.category}
                                </span>
                                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                                    {post.date}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                                {post.title}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-1">
                                {post.excerpt}
                            </p>
                            <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">
                                {t('read_more')}
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
