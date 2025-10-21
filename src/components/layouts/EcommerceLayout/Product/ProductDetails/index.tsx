"use client";

import { Title } from "@/components/elements/Texts";
import { Product } from "@/types/product";
import { useState } from "react";
import Icon from "@/components/elements/Icon";

interface Props {
  product: Product;
}

export default function ProductDetails({ product }: Props) {
  const [isOpen, setIsOpen] = useState(true); // <-- já inicia aberto

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="pb-10 md:pb-4">
      <header
        onClick={toggleOpen}
        className="cursor-pointer flex justify-between items-center border-b border-bluescale-50 pb-4"
      >
        <Title as="h3" className="font-semibold text-[22px]/[24px]">
          Detalhes do produto
        </Title>
        {isOpen ? (
          <Icon name="FiMinus" color="#000000" size={16} />
        ) : (
          <Icon name="FaPlus" color="#000000" size={16} />
        )}
      </header>

      <main
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "h-auto mt-8" : "h-0 mt-0"
        }`}
      >
        <div
          className="text-grayscale-350 text-sm"
          dangerouslySetInnerHTML={{ __html: product.description || "" }}
        />
      </main>
    </div>
  );
}
