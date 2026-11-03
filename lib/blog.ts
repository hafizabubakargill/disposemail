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

const EN_WORDS = new Set('the and for you your with that this are from can not will have has use used using free any all how what why when which more than only also into their they them our but its is to of in on or as be by an at if no we'.split(' '));

// True when a post that is supposed to be in `locale` is still English text.
// Untranslated posts are left out of the non-English blog instead of being shown in the wrong language.
function isUntranslated(post: BlogPost, locale: string): boolean {
  const text = `${post.title} ${post.excerpt} ${post.content.replace(/<[^>]+>/g, ' ')}`;
  if (locale === 'zh') return (text.match(/[\u4e00-\u9fff]/g) || []).length < text.length * 0.05;
  if (locale === 'ru') return (text.match(/[\u0400-\u04ff]/g) || []).length < text.length * 0.2;
  const tokens = text.split(/\s+/).filter(Boolean);
  const english = tokens.filter(w => EN_WORDS.has(w.toLowerCase().replace(/[^a-z']/g, ''))).length;
  return english / Math.max(tokens.length, 1) > 0.12;
}

const allPosts: Record<string, BlogPost[]> = {
  en: englishPosts,
  es: spanishPosts,
  pt: portuguesePosts,
  ru: russianPosts,
  zh: chinesePosts,
};

export const blogPosts: Record<string, BlogPost[]> = Object.fromEntries(
  Object.entries(allPosts).map(([locale, posts]) => [
    locale,
    locale === 'en' ? posts : posts.filter(p => !isUntranslated(p, locale)),
  ])
);

export function getSortedPosts(locale: string): BlogPost[] {
  const posts = blogPosts[locale] || blogPosts['en'];
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(locale: string, slug: string): BlogPost | undefined {
  const posts = blogPosts[locale] || blogPosts['en'];
  return posts.find((post) => post.slug === slug);
}
