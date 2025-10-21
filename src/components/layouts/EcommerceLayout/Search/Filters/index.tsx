"use client";

import { useState, useEffect, useRef } from "react";
import type { SortType } from "@/hooks/useFilters";
import Icon from "@/components/elements/Icon";

type FiltersProps = {
  minPrice?: number;
  maxPrice?: number;
  sort?: SortType;
  onChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    sort?: SortType;
  }) => void;
};

export default function Filters({
  minPrice,
  maxPrice,
  sort,
  onChange,
}: FiltersProps) {
  const [localMin, setLocalMin] = useState<number | undefined>(minPrice);
  const [localMax, setLocalMax] = useState<number | undefined>(maxPrice);
  const [localSort, setLocalSort] = useState<SortType>(sort ?? "");
  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null); // referência para o dropdown

  const sortOptions: { value: SortType; label: string }[] = [
    { value: "", label: "Ordenar por:" },
    { value: "asc", label: "Preço: menor para maior" },
    { value: "desc", label: "Preço: maior para menor" },
  ];

  const selectedLabel =
    sortOptions.find((opt) => opt.value === localSort)?.label || "Ordenar por:";

  const handleApply = () => {
    onChange({
      minPrice: localMin ?? 0,
      maxPrice: localMax ?? 0,
      sort: localSort ?? "",
    });
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-15 justify-between">
      {/* Inputs de preço */}
      <div className="flex gap-6 items-center w-full">
        <input
          type="number"
          value={localMin ?? ""}
          onChange={(e) =>
            setLocalMin(e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="de: R$ 00"
          className="border border-grayscale-100 rounded px-4 py-3 w-full lg:w-50 outline-none text-grayscale-450 text-base"
        />
        <input
          type="number"
          value={localMax ?? ""}
          onChange={(e) =>
            setLocalMax(e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="até: R$ 00"
          className="border border-grayscale-100 rounded px-4 py-3 w-full lg:w-50 outline-none text-grayscale-450 text-base"
        />
      </div>

      {/* Dropdown de ordenação e botão aplicar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center w-full">
        <div
          className="relative border border-grayscale-100 rounded cursor-pointer w-full lg:w-[400px]"
          ref={dropdownRef}
        >
          <button
            type="button"
            className="w-full flex items-center justify-between p-3 cursor-pointer"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <span className="text-grayscale-450 text-sm">{selectedLabel}</span>
            <Icon name="IoIosArrowDown" color="#272934" size={16} />
          </button>
          {openDropdown && (
            <div className="absolute z-20 w-full bg-white border border-grayscale-100 rounded mt-1 max-h-60 overflow-auto cursor-pointer">
              {sortOptions
                .filter((opt) => opt.value !== localSort)
                .map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setLocalSort(opt.value);
                      setOpenDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-grayscale-450"
                  >
                    {opt.label}
                  </button>
                ))}
            </div>
          )}
        </div>

        <div className="w-full">
          <button
            onClick={handleApply}
            className="bg-black text-white px-6 py-3 text-sm font-semibold cursor-pointer w-full lg:max-w-[136px]"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
