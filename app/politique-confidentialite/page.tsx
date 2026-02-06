export const dynamic = "force-dynamic"

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{
        preview?: string;
        id?: string;
    }>;
}

import { getLegalNoticePageData } from "@/lib/wordpress"


export default async function LegalNoticePage() {
    const legalNoticePageData = await getLegalNoticePageData("politique-confidentialite")
    const acf = legalNoticePageData?.acf?.contenu
    const title = legalNoticePageData?.title.rendered || "Mentions légales"

    return (
        <div className="min-h-screen bg-background pt-32 pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">{title}</h1>
                <div className="prose max-w-none">
                    {acf && <div dangerouslySetInnerHTML={{ __html: acf }} />}
                </div>
            </div>
        </div>
    )
}
