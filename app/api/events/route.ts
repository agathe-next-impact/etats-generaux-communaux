import { getEvents, getArchivePageTitles } from "@/lib/wordpress";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [events, pageTitles] = await Promise.all([
      getEvents(),
      getArchivePageTitles(),
    ]);
    
    return NextResponse.json({ events, pageTitles });
  } catch (error) {
    console.error("[API Events] Error fetching events:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des événements" },
      { status: 500 }
    );
  }
}
