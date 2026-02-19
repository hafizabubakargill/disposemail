import { blogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) return {};

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            authors: [post.author],
        }
    };
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default function BlogPostPage({ params }: Props) {
    const post = blogPosts.find((p) => p.slug === params.slug);

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
                Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {post.category}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {post.date}
                </span>
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
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Author & Privacy Advocate</p>
                </div>
            </div>

            <div
                className="prose prose-lg dark:prose-invert max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-li:text-gray-600 dark:prose-li:text-gray-400"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-20 p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Protect your inbox today.</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Stop sharing your real email with every website. Create your first disposable address in seconds.</p>
                <Link
                    href="/"
                    className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-105"
                >
                    Generate Free Address
                </Link>
            </div>
        </article>
    );
}
