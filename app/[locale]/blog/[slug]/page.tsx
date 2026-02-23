import { blogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { Metadata } from "next";

export async function generateStaticParams() {
    const locales = ['en', 'es', 'pt', 'ru', 'zh'];
    const params: { locale: string; slug: string }[] = [];

    locales.forEach(locale => {
        const posts = blogPosts[locale] || blogPosts.en;
        posts.forEach(post => {
            params.push({ locale, slug: post.slug });
        });
    });

    return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params;
    const localePosts = blogPosts[locale] || blogPosts.en;
    const post = localePosts.find((p) => p.slug === slug);

    if (!post) return {};

    return {
        title: post.title,
        description: post.excerpt,
        alternates: {
            canonical: `https://disposemail.xyz/${locale === 'en' ? '' : locale + '/'}blog/${slug}`,
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const { slug, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Blog' });
    const localePosts = blogPosts[locale] || blogPosts.en;
    const post = localePosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto px-6 py-20">
            <Link
                href="/blog"
                className="inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 mb-12 transition-colors"
            >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path></svg>
                {t('back_all')}
            </Link>

            <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {post.category}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {post.date}
                </span>
            </div>

            <div className="relative aspect-video w-full mb-12 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-[#1a1a1a] shadow-2xl">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-gray-900 dark:text-white leading-tight">
                {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-12 py-6 border-y border-gray-100 dark:border-[#1a1a1a]">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {post.author[0]}
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{post.author}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{t('author_role')}</p>
                </div>
            </div>

            <div
                className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-8
          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
          prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-li:my-2
          prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-2xl prose-h4:text-xl
          prose-img:rounded-3xl prose-img:shadow-2xl"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-20 p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('cta_title')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t('cta_desc')}</p>
                <Link
                    href="/"
                    className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-105"
                >
                    {t('cta_btn')}
                </Link>
            </div>
        </article>
    );
}
