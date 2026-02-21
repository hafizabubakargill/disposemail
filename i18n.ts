import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    // next-intl changed their API slightly, using requestLocale instead of locale sometimes, but typically:
    let locale = await requestLocale || 'en';

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});
