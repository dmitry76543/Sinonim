import { NextResponse } from "next/server";
import { getSearchAutocomplete } from "@/lib/search-service";

const AUTOCOMPLETE_CACHE_SECONDS = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ products: [], categories: [] });
  }

  try {
    const result = await getSearchAutocomplete(query);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": `public, s-maxage=${AUTOCOMPLETE_CACHE_SECONDS}, stale-while-revalidate=120`,
      },
    });
  } catch (error) {
    console.error("Search autocomplete API error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Не удалось загрузить подсказки";
    const friendlyMessage =
      message === "terminated" || message.includes("fetch failed")
        ? "Подсказки не загрузились. Попробуйте ещё раз."
        : message;
    return NextResponse.json(
      { products: [], categories: [], error: friendlyMessage },
      { status: 502 }
    );
  }
}
