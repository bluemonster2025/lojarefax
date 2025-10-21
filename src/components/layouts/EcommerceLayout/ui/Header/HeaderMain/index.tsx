"use client";

import Link from "next/link";
import Icon from "@/components/elements/Icon";
import { Section } from "@/components/elements/Section";
import Logo from "../../Logo";
import { Skeleton } from "@/components/elements/Skeleton";
import { Text } from "@/components/elements/Texts";
import BuyButton from "@/components/elements/BuyButton";

interface Props {
  logo?: { sourceUrl: string; altText?: string };
  loading?: boolean;
}

export default function HeaderMain({ logo, loading }: Props) {
  return (
    <div className="bg-refax-primary">
      <Section>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
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
            className="flex w-full flex-1 items-center rounded-lg bg-[#F9F9F933] cursor-pointer text-sm"
          >
            <input
              type="text"
              placeholder="O que você está buscando?"
              className="flex-1 px-3 py-4 rounded-l-md bg-transparent outline-none cursor-pointer text-white"
              readOnly
            />
            <span className="px-3">
              <Icon name="IoIosSearch" color="#ffff" size={20} />
            </span>
          </Link>
          <Text className="text-white uppercase text-xs">À pronta entrega</Text>
          <Text className="text-white uppercase text-xs">Sob Demanda</Text>

          {/* Button Comprar */}
          <div className="w-fit">
            <BuyButton title="Compre agora" icon="BsWhatsapp" />
          </div>
        </div>
      </Section>
    </div>
  );
}
