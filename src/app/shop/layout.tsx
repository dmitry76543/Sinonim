// Catalog pages load AdvantShop at runtime — not during `next build` (Render timeout).
export const dynamic = "force-dynamic";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
