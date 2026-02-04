import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    // Fallback to placeholder values to prevent build-time errors
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Validate URL format to prevent "Invalid URL" errors
    const isValidUrl = (url: string | undefined) => url && (url.startsWith('http://') || url.startsWith('https://'));

    const supabaseUrl = isValidUrl(envUrl) ? envUrl! : 'https://placeholder.supabase.co';
    const supabaseKey = envKey || 'placeholder-key';

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    );
}
