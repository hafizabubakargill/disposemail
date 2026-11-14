// Client-side encryption for Secure Notes.
// The note is encrypted in the browser with AES-256-GCM. The random key is placed in the
// URL fragment (the part after '#'), which browsers never send to the server, so the server
// only ever stores ciphertext and cannot read the note.

const toB64Url = (bytes: Uint8Array): string => {
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
        bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromB64Url = (s: string): Uint8Array<ArrayBuffer> => {
    const pad = '='.repeat((4 - (s.length % 4)) % 4);
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
    const out = new Uint8Array(new ArrayBuffer(bin.length));
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
};

/** A valid key is 32 random bytes written as 43 base64url characters. */
export const isValidNoteKey = (key: string): boolean => /^[A-Za-z0-9_-]{43}$/.test(key);

export async function encryptNote(plaintext: string): Promise<{ payload: string; key: string }> {
    const rawKey = crypto.getRandomValues(new Uint8Array(32));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey = await crypto.subtle.importKey('raw', rawKey, 'AES-GCM', false, ['encrypt']);
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, new TextEncoder().encode(plaintext)));
    const packed = new Uint8Array(iv.length + ct.length);
    packed.set(iv, 0);
    packed.set(ct, iv.length);
    return { payload: toB64Url(packed), key: toB64Url(rawKey) };
}

export async function decryptNote(payload: string, key: string): Promise<string> {
    const packed = fromB64Url(payload);
    const iv = packed.slice(0, 12);
    const ct = packed.slice(12);
    const cryptoKey = await crypto.subtle.importKey('raw', fromB64Url(key), 'AES-GCM', false, ['decrypt']);
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, ct);
    return new TextDecoder().decode(pt);
}
