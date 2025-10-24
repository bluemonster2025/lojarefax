"use client";

import Link from "next/link";
import Icon from "@/components/elements/Icon";
import { Section } from "@/components/elements/Section";
import Logo from "../../Logo";
import { Skeleton } from "@/components/elements/Skeleton";
import { Text } from "@/components/elements/Texts";
import BuyButton from "@/components/elements/BuyButton";
import { useCategories } from "@/hooks/useCategories";

interface Props {
  logo?: { sourceUrl: string; altText?: string };
  loading?: boolean;
}

export default function HeaderMain({ logo, loading }: Props) {
  const { categories, loading: loadingCats, error } = useCategories();

  return (
    <div className="bg-refax-primary">
      <Section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6 justify-between py-4">
          {/* Logo */}
          {loading || !logo ? (
            <div className="w-[112px] h-[112px] flex items-center">
              <Skeleton className="w-[108px] h-[38px] bg-gray-200 animate-pulse rounded" />
            </div>
          ) : (
            <Logo logo={logo} />
          )}

          {/* Busca */}
          <Link
            href="/buscar"
            className="flex w-full flex-1 items-center rounded-lg bg-[#F9F9F933] cursor-pointer text-sm max-w-[533px]"
          >
            <input
              type="text"
              placeholder="O que você está buscando?"
              className="flex-1 p-3 rounded-l-md bg-transparent outline-none cursor-pointer text-white"
              readOnly
            />
            <span className="px-3">
              <Icon name="IoIosSearch" color="#ffff" size={20} />
            </span>
          </Link>

          {/* Categorias */}
          {loadingCats ? (
            <div className="flex gap-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-20 rounded" />
              ))}
            </div>
          ) : error ? (
            <Text className="text-red-300 text-xs">
              Erro ao carregar categorias
            </Text>
          ) : (
            <div className="flex gap-4">
              {categories?.slice(0, 2).map((cat) => (
                <>
                  <Text className="text-white uppercase text-xs">
                    {cat.name}
                  </Text>
                </>
              ))}
            </div>
          )}

          {/* Botão Comprar */}
          <div className="w-fit">
            <BuyButton title="Compre agora" icon="BsWhatsapp" />
          </div>
        </div>
      </Section>
    </div>
  );
}
