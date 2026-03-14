import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    // 1. Try to get the IP from Cloudflare/Nginx headers
    const ip = request.headers.get('cf-connecting-ip') || 
               request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               '';

    const lookupIp = target || ip;

    try {
        let primaryError = '';
        let fallbackError = '';

        const headers = {
            'User-Agent': 'Mozilla/5.0 (compatible; DisposeMail/1.0; +https://disposemail.xyz)',
            'Accept': 'application/json'
        };

        // --- 1. PRIMARY PROVIDER: ipwho.is ---
        try {
            const url = lookupIp ? `https://ipwho.is/${lookupIp}` : 'https://ipwho.is/';
            const res = await fetch(url, { headers });
            
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    return NextResponse.json({
                        success: true,
                        data: {
                            ip: data.ip,
                            city: data.city || '',
                            region: data.region || '',
                            country_name: data.country || '',
                            country_code: data.country_code || '',
                            postal: data.postal || '',
                            latitude: data.latitude || 0,
                            longitude: data.longitude || 0,
                            timezone: data.timezone?.id || '',
                            org: data.connection?.org || data.connection?.isp || '',
                            asn: data.connection?.asn ? `AS${data.connection.asn}` : ''
                        }
                    });
                } else {
                    primaryError = `ipwho.is returned success:false: ${data.message}`;
                    console.warn(primaryError);
                }
            } else {
                primaryError = `ipwho.is failed with status ${res.status}: ${res.statusText}`;
                console.warn(primaryError);
            }
        } catch (e: any) {
            primaryError = `Primary IP Provider fetch error: ${e.message}`;
            console.error(primaryError);
        }

        // --- 2. FALLBACK PROVIDER: ipapi.co ---
        try {
            const fallbackUrl = lookupIp ? `https://ipapi.co/${lookupIp}/json/` : 'https://ipapi.co/json/';
            const fRes = await fetch(fallbackUrl, { headers });
            
            if (fRes.ok) {
                const fData = await fRes.json();
                if (!fData.error) {
                    return NextResponse.json({
                        success: true,
                        data: {
                            ip: fData.ip,
                            city: fData.city || '',
                            region: fData.region || '',
                            country_name: fData.country_name || '',
                            country_code: fData.country_code || '',
                            postal: fData.postal || '',
                            latitude: fData.latitude || 0,
                            longitude: fData.longitude || 0,
                            timezone: fData.timezone || '',
                            org: fData.org || '',
                            asn: fData.asn || ''
                        }
                    });
                } else {
                    fallbackError = `ipapi.co returned error: ${fData.reason}`;
                    console.warn(fallbackError);
                }
            } else {
                fallbackError = `ipapi.co failed with status ${fRes.status}: ${fRes.statusText}`;
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
