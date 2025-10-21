import CategoriaTemplate from "@/components/templates/Site/Categroy";
import { getCategoryBySlug } from "@/lib/categories";
import { notFound } from "next/navigation";

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Busca categoria + produtos direto do endpoint server-side
  const data = await getCategoryBySlug(slug);

  if (!data) return notFound();

  return (
    <CategoriaTemplate category={data.category} products={data.products} />
  );
}
