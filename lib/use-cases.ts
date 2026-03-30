export interface UseCase {
    slug: string;
    service: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export const useCases: Record<string, UseCase[]> = {
    en: [
        {
            slug: 'temp-mail-for-facebook',
            service: 'Facebook',
            title: 'Disposable Email for Facebook',
            description: 'Create a Facebook account without revealing your primary email. Protect your social identity from data leaks and unwanted notifications.',
            icon: 'facebook',
            color: '#1877F2'
        },
        {
            slug: 'temp-mail-for-netflix',
            service: 'Netflix',
            title: 'Temporary Email for Netflix',
            description: 'Sign up for Netflix trials and accounts with a temporary inbox. Keep your viewing habits private and your inbox clean.',
            icon: 'netflix',
            color: '#E50914'
        },
        {
            slug: 'temp-mail-for-instagram',
            service: 'Instagram',
            title: 'Disposable Email for Instagram',
            description: 'Protect your Instagram profile by using a secure, temporary email address. Avoid spam and stay anonymous.',
            icon: 'instagram',
            color: '#E4405F'
        },
        {
            slug: 'temp-mail-for-amazon',
            service: 'Amazon',
            title: 'Temporary Email for Amazon',
            description: 'Shop securely on Amazon using a disposable email. Keep your shopping history private and avoid marketing spam.',
            icon: 'amazon',
            color: '#FF9900'
        },
        {
            slug: 'temp-mail-for-spotify',
            service: 'Spotify',
            title: 'Disposable Email for Spotify',
            description: 'Listen to your favorite music on Spotify without sharing your real email. Use a temporary inbox for a cleaner experience.',
            icon: 'spotify',
            color: '#1DB954'
        }
    ],
    es: [
        {
            slug: 'temp-mail-for-facebook',
            service: 'Facebook',
            title: 'Correo Temporal para Facebook',
            description: 'Crea una cuenta de Facebook sin revelar tu correo principal. Protege tu identidad social de filtraciones de datos.',
            icon: 'facebook',
            color: '#1877F2'
        },
        {
            slug: 'temp-mail-for-netflix',
            service: 'Netflix',
            title: 'Correo Temporal para Netflix',
            description: 'Regístrate en Netflix con una bandeja de entrada temporal. Mantén tu privacidad y tu buzón limpio.',
            icon: 'netflix',
            color: '#E50914'
        }
    ],
    pt: [
        {
            slug: 'temp-mail-for-facebook',
            service: 'Facebook',
            title: 'E-mail Temporário para Facebook',
            description: 'Crie uma conta no Facebook sem revelar seu e-mail principal. Proteja sua identidade social contra vazamentos de dados.',
            icon: 'facebook',
            color: '#1877F2'
        },
        {
            slug: 'temp-mail-for-netflix',
            service: 'Netflix',
            title: 'E-mail Temporário para Netflix',
            description: 'Inscreva-se na Netflix com uma caixa de entrada temporária. Mantenha sua privacidade e sua caixa de entrada limpa.',
            icon: 'netflix',
            color: '#E50914'
        },
        {
            slug: 'temp-mail-for-instagram',
            service: 'Instagram',
            title: 'E-mail Temporário para Instagram',
            description: 'Proteja seu perfil do Instagram usando um e-mail temporário seguro. Evite spam e mantenha o anonimato.',
            icon: 'instagram',
            color: '#E4405F'
        },
        {
            slug: 'temp-mail-for-amazon',
            service: 'Amazon',
            title: 'E-mail Temporário para Amazon',
            description: 'Compre com segurança na Amazon usando um e-mail descartável. Mantenha seu histórico de compras privado.',
            icon: 'amazon',
            color: '#FF9900'
        },
        {
            slug: 'temp-mail-for-spotify',
            service: 'Spotify',
            title: 'E-mail Temporário para Spotify',
            description: 'Ouça música no Spotify sem compartilhar seu e-mail real. Use uma caixa de entrada temporária.',
            icon: 'spotify',
            color: '#1DB954'
        }
    ],
    ru: [
        {
            slug: 'temp-mail-for-facebook',
            service: 'Facebook',
            title: 'Временная почта для Facebook',
            description: 'Создайте аккаунт Facebook, не раскрывая основной email. Защитите свои социальные данные от утечек и спама.',
            icon: 'facebook',
            color: '#1877F2'
        },
        {
            slug: 'temp-mail-for-netflix',
            service: 'Netflix',
            title: 'Временная почта для Netflix',
            description: 'Регистрируйтесь в Netflix, используя временный почтовый ящик. Сохраняйте конфиденциальность ваших подписок.',
            icon: 'netflix',
            color: '#E50914'
        },
        {
            slug: 'temp-mail-for-instagram',
            service: 'Instagram',
            title: 'Временная почта для Instagram',
            description: 'Защитите свой профиль Instagram с помощью безопасного временного адреса. Избавьтесь от нежелательной рекламы.',
            icon: 'instagram',
            color: '#E4405F'
        },
        {
            slug: 'temp-mail-for-amazon',
            service: 'Amazon',
            title: 'Временная почта для Amazon',
            description: 'Безопасно совершайте покупки на Amazon. Сохраняйте историю заказов в тайне и избегайте спама.',
            icon: 'amazon',
            color: '#FF9900'
        },
        {
            slug: 'temp-mail-for-spotify',
            service: 'Spotify',
            title: 'Временная почта для Spotify',
            description: 'Слушайте любимую музыку в Spotify, не передавая свой настоящий email. Используйте временный ящик.',
            icon: 'spotify',
            color: '#1DB954'
        }
    ],
    zh: [
        {
            slug: 'temp-mail-for-facebook',
            service: 'Facebook',
            title: 'Facebook 临时邮箱',
            description: '无需泄露主邮箱即可创建 Facebook 账号。保护社交身份，防止数据泄露和骚扰通知。',
            icon: 'facebook',
            color: '#1877F2'
        },
        {
            slug: 'temp-mail-for-netflix',
            service: 'Netflix',
            title: 'Netflix 临时邮箱',
            description: '使用临时收件箱注册 Netflix。保护观影习惯隐私，保持收件箱整洁。',
            icon: 'netflix',
            color: '#E50914'
        },
        {
            slug: 'temp-mail-for-instagram',
            service: 'Instagram',
            title: 'Instagram 临时邮箱',
            description: '使用安全的临时邮箱保护 Instagram 个人资料。避免垃圾邮件并保持匿名。',
            icon: 'instagram',
            color: '#E4405F'
        },
        {
            slug: 'temp-mail-for-amazon',
            service: 'Amazon',
            title: 'Amazon 临时邮箱',
            description: '使用一次性邮箱在 Amazon 安全购物。保持购物历史私密，避免营销骚扰。',
            icon: 'amazon',
            color: '#FF9900'
        },
        {
            slug: 'temp-mail-for-spotify',
            service: 'Spotify',
            title: 'Spotify 临时邮箱',
            description: '在 Spotify 听音乐而无需分享真实邮箱。使用临时收件箱获得更清爽的体验。',
            icon: 'spotify',
            color: '#1DB954'
        }
    ]
};

// Fill in missing languages if any additions are made to English
['es', 'pt', 'ru', 'zh'].forEach(lang => {
    useCases.en.forEach(enUc => {
        if (!useCases[lang].find(uc => uc.slug === enUc.slug)) {
            useCases[lang].push({ ...enUc });
        }
    });
});

export function getUseCase(slug: string, locale: string = 'en') {
    const localeCases = useCases[locale] || useCases.en;
    return localeCases.find(uc => uc.slug === slug);
}
