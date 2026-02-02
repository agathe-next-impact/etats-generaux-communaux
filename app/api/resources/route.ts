import { getResources } from "@/lib/wordpress";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const resources = await getResources();
    return NextResponse.json(resources);
  } catch (error) {
    console.error("[API Resources] Error fetching resources:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des ressources" },
      { status: 500 }
    );
  }
}
