import { englishPosts } from './blog-data/en';
import { spanishPosts } from './blog-data/es';
import { portuguesePosts } from './blog-data/pt';
import { russianPosts } from './blog-data/ru';
import { chinesePosts } from './blog-data/zh';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  author: string;
  category: string;
  image: string;
}

export const blogPosts: Record<string, BlogPost[]> = {
  en: englishPosts,
  es: spanishPosts,
  pt: portuguesePosts,
  ru: russianPosts,
  zh: chinesePosts,
};

export function getSortedPosts(locale: string): BlogPost[] {
  const posts = blogPosts[locale] || blogPosts['en'];
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(locale: string, slug: string): BlogPost | undefined {
  const posts = blogPosts[locale] || blogPosts['en'];
  return posts.find((post) => post.slug === slug);
}
