"use client";

import Icon from "@/components/elements/Icon";
import InputField from "@/components/elements/InputField";

type SearchBarProps = {
  search: string;
  placeholder: string;
  setSearch: (value: string) => void;
  inputClassName?: string;
  sizeIcon: number;
};

export default function SearchBar({
  search,
  placeholder,
  setSearch,
  inputClassName,
  sizeIcon,
}: SearchBarProps) {
  return (
    <div className="relative max-h-fit">
      <InputField
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(value) => setSearch(value)}
        className={`${inputClassName} pr-10`} // espaço para o ícone
      />

      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-grayscale-400">
        <Icon name="CiSearch" color="#272934" size={sizeIcon} />
      </span>
    </div>
  );
}
