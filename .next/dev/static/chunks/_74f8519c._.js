(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/blog.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "blogPosts",
    ()=>blogPosts,
    "getSortedPosts",
    ()=>getSortedPosts
]);
const blogPosts = {
    en: [
        {
            slug: 'why-disposable-emails-essential-privacy',
            title: 'Why Disposable Emails are Essential for Modern Privacy',
            excerpt: 'In an era of constant data breaches, protecting your primary email is more critical than ever. Learn why temporary inboxes are your first line of defense.',
            date: 'January 15, 2026',
            author: 'DisposeMail Team',
            category: 'Privacy',
            image: '/blog/privacy.png',
            content: `
        <p>Your primary email address is more than just a communication tool; it's a digital passport. It's linked to your bank accounts, social media profiles, and professional identity. When you share this address with every website you visit, you're leaving a trail of vulnerable data points across the internet...</p>
        <h3>The Risk of the "One Email" Strategy</h3>
        <p>Most users use a single email for everything. While convenient, this creates a single point of failure...</p>
      `
        },
        {
            slug: 'avoiding-spam-with-temporary-inboxes',
            title: 'Avoiding Spam: How Temporary Inboxes Keep Your Real Mailbox Clean',
            excerpt: 'Tired of unsubscribing from lists you never joined? Discover how to stop spam at the source using temporary email addresses.',
            date: 'January 28, 2026',
            author: 'Privacy Expert',
            category: 'Security',
            image: '/blog/spam.png',
            content: `<p>Spam is the digital equivalent of chronic noise...</p>`
        },
        {
            slug: 'evolution-of-email-privacy-2026',
            title: 'The Evolution of Email Privacy in 2026',
            excerpt: 'As AI-driven tracking becomes more sophisticated, email privacy tools are evolving. Here is what the landscape looks like today.',
            date: 'February 5, 2026',
            author: 'Tech Analyst',
            category: 'Future Tech',
            image: '/blog/future.png',
            content: `<p>In 2026, the battle for digital privacy has reached its most critical frontier...</p>`
        },
        {
            slug: 'secure-online-shopping-disposable-emails',
            title: 'How to Use Disposable Emails for Secure Online Shopping',
            excerpt: 'Protect your financial identity by shielding your primary inbox from retailers and third-party trackers during checkout.',
            date: 'February 10, 2026',
            author: 'Shopping Security Expert',
            category: 'Security',
            image: '/blog/shopping.png',
            content: `<p>Online shopping is one of the primary ways users unknowingly compromise their digital security...</p>`
        },
        {
            slug: 'top-privacy-extensions-temporary-inbox',
            title: 'Top 5 Privacy Extensions to Pair with Your Temporary Inbox',
            excerpt: 'Enhance your security stack by combining DisposeMail with these powerful browser extensions for total anonymity.',
            date: 'February 14, 2026',
            author: 'Privacy Advocate',
            category: 'Tech Tips',
            image: '/blog/extensions.png',
            content: `<p>While a disposable email service is the cornerstone of digital hygiene, it is most effective when part of a broader "security stack."</p>`
        },
        {
            slug: 'dangers-reusing-email-social-media',
            title: 'The Hidden Dangers of Reusing Your Primary Email on Social Media',
            excerpt: 'Social networks are data collection engines. Learn why using your real email for social accounts is a major security risk.',
            date: 'February 18, 2026',
            author: 'Social Media Security',
            category: 'Privacy',
            image: '/blog/social.png',
            content: `<p>Social media platforms are the world's most sophisticated data harvesters...</p>`
        }
    ],
    es: [
        {
            slug: 'why-disposable-emails-essential-privacy',
            title: 'Por qué los correos desechables son esenciales',
            excerpt: 'En una era de constantes violaciones de datos, proteger su correo principal es más crítico que nunca.',
            date: '15 de enero de 2026',
            author: 'Equipo DisposeMail',
            category: 'Privacidad',
            image: '/blog/privacy.png',
            content: `<p>Tu dirección de correo electrónico principal es más que una simple herramienta de comunicación; es un pasaporte digital...</p>`
        },
        {
            slug: 'dangers-reusing-email-social-media',
            title: 'Los peligros ocultos de reutilizar su correo en redes sociales',
            excerpt: 'Las redes sociales son motores de recolección de datos. Descubra por qué usar su correo real es un riesgo.',
            date: '18 de febrero de 2026',
            author: 'Seguridad en Redes Sociales',
            category: 'Privacidad',
            image: '/blog/social.png',
            content: `
         <p>Las plataformas de redes sociales son los recolectores de datos más sofisticados del mundo. No solo rastrean lo que publicas; rastrean a quién conoces, a dónde vas y cómo piensas. Tu dirección de correo electrónico principal es el "pegamento" que les permite conectar tu perfil social con tu vida fuera de línea.</p>
         <h3>La Amenaza de los Perfiles en la Sombra</h3>
         <p>Incluso si no compartes información explícitamente, las plataformas construyen expedientes completos sobre ti...</p>
       `
        }
    ],
    pt: [],
    ru: [],
    zh: []
};
// Fill in missing languages with English defaults to avoid empty pages
[
    'pt',
    'ru',
    'zh'
].forEach((lang)=>{
    blogPosts[lang] = blogPosts.en.map((post)=>({
            ...post
        }));
});
// For Spanish, fill in missing posts from English
blogPosts.en.forEach((enPost)=>{
    if (!blogPosts.es.find((esPost)=>esPost.slug === enPost.slug)) {
        blogPosts.es.push({
            ...enPost
        });
    }
});
function getSortedPosts(locale = 'en') {
    const posts = blogPosts[locale] || blogPosts.en;
    return [
        ...posts
    ].sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/[locale]/blog/[slug]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BlogPostPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/blog.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-intl/dist/esm/development/react-client/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function BlogPostPage({ params }) {
    _s();
    const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"])('Blog');
    const { slug, locale } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].use(params);
    const localePosts = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blogPosts"][locale] || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blog$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blogPosts"].en;
    const post = localePosts.find((p)=>p.slug === slug);
    if (!post) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "max-w-3xl mx-auto px-6 py-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/blog",
                className: "inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 mb-12 transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-4 h-4 mr-2",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "3",
                            d: "M7 16l-4-4m0 0l4-4m-4 4h18"
                        }, void 0, false, {
                            fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                            lineNumber: 25,
                            columnNumber: 101
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                        lineNumber: 25,
                        columnNumber: 17
                    }, this),
                    t('back_all')
                ]
            }, void 0, true, {
                fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                lineNumber: 21,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full",
                        children: post.category
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                        lineNumber: 30,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-gray-400 font-bold uppercase tracking-widest",
                        children: post.date
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                        lineNumber: 33,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                lineNumber: 29,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-video w-full mb-12 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-[#1a1a1a] shadow-2xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: post.image,
                    alt: post.title,
                    className: "w-full h-full object-cover"
                }, void 0, false, {
                    fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                    lineNumber: 39,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                lineNumber: 38,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-4xl md:text-6xl font-black tracking-tighter mb-8 text-gray-900 dark:text-white leading-tight",
                children: post.title
            }, void 0, false, {
                fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                lineNumber: 46,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 mb-12 py-6 border-y border-gray-100 dark:border-[#1a1a1a]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold",
                        children: post.author[0]
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                        lineNumber: 51,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-bold text-gray-900 dark:text-white",
                                children: post.author
                            }, void 0, false, {
                                fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                                lineNumber: 55,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-gray-500 uppercase tracking-widest font-black",
                                children: t('author_role')
                            }, void 0, false, {
                                fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                                lineNumber: 56,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                        lineNumber: 54,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                lineNumber: 50,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "prose prose-lg md:prose-xl dark:prose-invert max-w-none  prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-8 prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-li:my-2 prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-2xl prose-h4:text-xl prose-img:rounded-3xl prose-img:shadow-2xl",
                dangerouslySetInnerHTML: {
                    __html: post.content
                }
            }, void 0, false, {
                fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                lineNumber: 60,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-20 p-8 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-bold mb-2 text-gray-900 dark:text-white",
                        children: t('cta_title')
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                        lineNumber: 72,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-600 dark:text-gray-400 mb-6",
                        children: t('cta_desc')
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                        lineNumber: 73,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-105",
                        children: t('cta_btn')
                    }, void 0, false, {
                        fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                        lineNumber: 74,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
                lineNumber: 71,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/[locale]/blog/[slug]/page.tsx",
        lineNumber: 20,
        columnNumber: 9
    }, this);
}
_s(BlogPostPage, "h6+q2O3NJKPY5uL0BIJGLIanww8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$intl$2f$dist$2f$esm$2f$development$2f$react$2d$client$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslations"]
    ];
});
_c = BlogPostPage;
var _c;
__turbopack_context__.k.register(_c, "BlogPostPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_74f8519c._.js.map