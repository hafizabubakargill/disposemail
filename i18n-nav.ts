import { createNavigation } from 'next-intl/navigation';

export const { Link } = createNavigation({
    locales: ['en', 'es', 'pt', 'ru', 'zh'],
    defaultLocale: 'en',
    localePrefix: 'as-needed',
});
