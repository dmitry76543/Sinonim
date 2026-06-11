import { NextResponse } from "next/server";
import { CATALOG_REVALIDATE_SECONDS } from "@/lib/advantshop/config";
import { getSearchProducts } from "@/lib/search-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const sort = searchParams.get("sort") ?? "default";

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await getSearchProducts(query, { sort });
    return NextResponse.json(
      { products, query },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=600`,
        },
      }
    );
  } catch (error) {
    console.error("Search API error:", error);
    const message =
      error instanceof Error ? error.message : "Не удалось выполнить поиск";
    const friendlyMessage =
      message === "terminated" || message.includes("fetch failed")
        ? "Поиск не ответил вовремя. Попробуйте обновить страницу."
        : message;
    return NextResponse.json(
      { products: [], query, error: friendlyMessage },
      { status: 502 }
    );
  }
}
