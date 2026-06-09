import { NextResponse } from "next/server";
import { isValidCategory } from "@/lib/products";
import { getCatalogProducts } from "@/lib/products-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "default";

  const category =
    categoryParam && isValidCategory(categoryParam) ? categoryParam : undefined;

  try {
    const products = await getCatalogProducts({ category, sort });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Catalog API error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Не удалось загрузить каталог";
    return NextResponse.json({ products: [], error: message }, { status: 502 });
  }
}
