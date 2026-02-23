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
    pt: [],
    ru: [],
    zh: []
};

// Fill in missing languages
['pt', 'ru', 'zh'].forEach(lang => {
    useCases[lang] = useCases.en.map(uc => ({ ...uc }));
});

// Sync Spanish
useCases.en.forEach(enUc => {
    if (!useCases.es.find(esUc => esUc.slug === enUc.slug)) {
        useCases.es.push({ ...enUc });
    }
});

export function getUseCase(slug: string, locale: string = 'en') {
    const localeCases = useCases[locale] || useCases.en;
    return localeCases.find(uc => uc.slug === slug);
}
