import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {    
    const secret = req.nextUrl.searchParams.get('secret');

    if (secret !== process.env.REVALIDATE_SECRET) {            
        return NextResponse.json({ message: 'Token invalide' }, { status: 401 });  
    }          
    try {                
        const pathToRevalidate = req.nextUrl.searchParams.get('path');                    
        if (!pathToRevalidate) {                      
            return NextResponse.json({ message: 'Le paramètre path est requis' }, { status: 400 });    
        }                     
        revalidatePath(pathToRevalidate);                         
        return NextResponse.json({ revalidated: true });  
    }                 
    catch (err) {                        
        return new NextResponse('Erreur lors de la revalidation', { status: 500 });                                  
    }
}