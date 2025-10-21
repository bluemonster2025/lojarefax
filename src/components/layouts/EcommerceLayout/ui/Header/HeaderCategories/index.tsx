"use client";

import Link from "next/link";
import { Skeleton } from "@/components/elements/Skeleton";
import { Section } from "@/components/elements/Section";
import BuyButton from "@/components/elements/BuyButton";
import { useCategories } from "@/hooks/useCategories";

interface Props {
  onCategoryClick?: () => void;
}

export default function HeaderCategories({ onCategoryClick }: Props) {
  const { categories, loading, error } = useCategories();

  // Loading fallback similar ao antigo
  if (loading) {
    return (
      <Section className="bg-grayscale-150 py-4">
        <div className="flex gap-24 items-center justify-center">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded" />
          ))}
        </div>
      </Section>
    );
  }

  // Se ocorrer erro ou data vazia
  if (error) {
    return (
      <Section className="bg-grayscale-150 py-4">
        <p className="text-red-500 text-center">Erro ao carregar categorias</p>
      </Section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Section className="bg-grayscale-150 py-4">
        <p className="text-center text-grayscale-500">
          Nenhuma categoria encontrada
        </p>
      </Section>
    );
  }

  return (
    <Section className="bg-grayscale-150 py-0 lg:py-4">
      <div className="flex flex-col lg:flex-row gap-5 1xs:gap-10 2xs:gap-20 lg:gap-24 items-center justify-center">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            onClick={onCategoryClick}
          >
            <p className="text-grayscale-350 font-semibold text-lg lg:text-sm">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>

      {/* Botão de compra (apenas no mobile) */}
      <div className="block lg:hidden w-[200px] mx-auto pt-16 pb-8">
        <BuyButton variant="secondary" title="Compre agora" icon="BsWhatsapp" />
      </div>
    </Section>
  );
}
