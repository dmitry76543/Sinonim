import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductPage } from "@/components/product/ProductPage";
import {
  getProductDetails,
  getRelatedProducts,
} from "@/lib/products-service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductDetails(slug);
  if (!product) return {};

  return {
    title: `${product.name} — купить в Синоним`,
    description: product.description,
  };
}

export default async function ProductRoute({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductDetails(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  return (
    <>
      <Header />
      <main>
        <ProductPage product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}
