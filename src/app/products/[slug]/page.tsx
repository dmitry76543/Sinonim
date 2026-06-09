import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductPage } from "@/components/product/ProductPage";
import { getProductDetails, PRODUCTS } from "@/lib/products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductDetails(slug);
  if (!product) return {};

  return {
    title: `${product.name} — купить в Синоним`,
    description: product.description,
  };
}

export default async function ProductRoute({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductDetails(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <ProductPage product={product} />
      </main>
      <Footer />
    </>
  );
}
