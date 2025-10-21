"use client";

import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/elements/Skeleton";
import { Text } from "@/components/elements/Texts";
import { Category } from "@/types/category";

type CategoriesListProps = {
  categories: Category[];
  loading: boolean;
};

export default function CategoriesList({
  categories,
  loading,
}: CategoriesListProps) {
  const skeletonCount = 5;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
        {[...Array(skeletonCount)].map((_, i) => (
          <div key={i} className="w-full">
            <Skeleton className="w-full h-full pt-[165%]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categoria/${cat.slug}`}
          className="relative group overflow-hidden aspect-[0.60/1] shadow hover:scale-105 transition"
        >
          {cat.image?.sourceUrl && (
            <Image
              src={cat.image.sourceUrl}
              alt={cat.image?.altText || cat.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover w-full h-full"
              priority
              fetchPriority="high"
            />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-end justify-start p-8">
            <Text className="text-white uppercase text-base">{cat.name}</Text>
          </div>
        </Link>
      ))}
    </div>
  );
}
