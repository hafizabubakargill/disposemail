import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    // 1. Try to get the IP from Cloudflare/Nginx headers
    const ip = request.headers.get('cf-connecting-ip') || 
               request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               '';

    const lookupIp = target || ip;

    // --- SECURITY: SSRF PREVENTION ---
    // Validate that the IP matches a standard IPv4/IPv6 pattern.
    if (lookupIp && lookupIp !== '') {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
        if (!ipRegex.test(lookupIp)) {
            return NextResponse.json({ success: false, error: 'Invalid IP address format' }, { status: 400 });
        }
    }

    try {
        let primaryError = '';
        let fallbackError = '';

        const headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; DisposeMail/1.0; +https://disposemail.xyz)',
            'Accept': 'application/json'
        };

        // --- 1. PRIMARY PROVIDER: GeoJS ---
        try {
            const url = lookupIp ? `https://get.geojs.io/v1/ip/geo/${lookupIp}.json` : 'https://get.geojs.io/v1/ip/geo.json';
            const res = await fetch(url, { headers });
            
            if (res.ok) {
                const data = await res.json();
                if (data.ip) {
                    return NextResponse.json({
                        success: true,
                        data: {
                            ip: data.ip,
                            city: data.city || '',
                            region: data.region || '',
                            country_name: data.country || '',
                            country_code: data.country_code || '',
                            postal: '', // GeoJS doesn't reliably return postal
                            latitude: parseFloat(data.latitude) || 0,
                            longitude: parseFloat(data.longitude) || 0,
                            timezone: data.timezone || '',
                            org: data.organization_name || '',
                            asn: data.asn ? `AS${data.asn}` : ''
                        }
                    });
                } else {
                    primaryError = `GeoJS returned invalid data structure.`;
                    console.warn(primaryError);
                }
            } else {
                primaryError = `GeoJS failed with status ${res.status}: ${res.statusText}`;
                console.warn(primaryError);
            }
        } catch (e: any) {
            primaryError = `Primary IP Provider fetch error: ${e.message}`;
            console.error(primaryError);
        }

        // --- 2. FALLBACK PROVIDER: ip-api.com (HTTP allowed server-side) ---
        try {
            const fallbackUrl = lookupIp ? `http://ip-api.com/json/${lookupIp}` : 'http://ip-api.com/json/';
            const fRes = await fetch(fallbackUrl, { headers });
            
            if (fRes.ok) {
                const fData = await fRes.json();
                if (fData.status === 'success') {
                    return NextResponse.json({
                        success: true,
                        data: {
                            ip: fData.query,
                            city: fData.city || '',
                            region: fData.regionName || fData.region || '',
                            country_name: fData.country || '',
                            country_code: fData.countryCode || '',
                            postal: fData.zip || '',
                            latitude: fData.lat || 0,
                            longitude: fData.lon || 0,
                            timezone: fData.timezone || '',
                            org: fData.isp || fData.org || '',
                            asn: fData.as ? fData.as.split(' ')[0] : ''
                        }
                    });
                } else {
                    fallbackError = `ip-api.com returned error: ${fData.message}`;
                    console.warn(fallbackError);
                }
            } else {
                fallbackError = `ip-api.com failed with status ${fRes.status}: ${fRes.statusText}`;
                console.warn(fallbackError);
            }
        } catch (e: any) {
            fallbackError = `Fallback IP Provider fetch error: ${e.message}`;
            console.error(fallbackError);
        }

        throw new Error(`IP Lookup Failed. Primary: [${primaryError}] | Fallback: [${fallbackError}]`);

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    }
}
