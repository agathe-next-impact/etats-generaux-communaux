import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { safeCompareSecret } from '@/lib/secrets';

// Appelé par WordPress (wp_remote_get) à la publication : GET ?secret=…&path=/…
export async function GET(req: NextRequest) {
    const secret = req.nextUrl.searchParams.get('secret');

    if (!safeCompareSecret(secret, process.env.REVALIDATE_SECRET)) {
        return NextResponse.json({ message: 'Token invalide' }, { status: 401 });
    }

    const pathToRevalidate = req.nextUrl.searchParams.get('path');
    if (!pathToRevalidate || !pathToRevalidate.startsWith('/')) {
        return NextResponse.json({ message: 'Le paramètre path est requis (chemin interne)' }, { status: 400 });
    }

    try {
        revalidatePath(pathToRevalidate);
        return NextResponse.json({ revalidated: true });
    } catch {
        return NextResponse.json({ message: 'Erreur lors de la revalidation' }, { status: 500 });
    }
}
