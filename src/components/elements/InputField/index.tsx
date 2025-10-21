"use client";

import { Text } from "@/components/elements/Texts";
import React from "react";

interface Option {
  value: string | number;
  label: string;
}

interface InputFieldProps {
  /** Label exibida acima do input */
  label?: string;
  /** Tipo do campo (text, email, number, password etc.) */
  type?: string;
  /** Placeholder exibido dentro do campo */
  placeholder?: string;
  /** Valor atual */
  value?: string | number;
  /** Evento de mudança */
  onChange?: (value: string) => void;
  /** Define se o campo deve ser textarea */
  textarea?: boolean;
  /** Define se o campo deve ser select */
  select?: boolean;
  /** Lista de opções, usada quando select = true */
  options?: Option[];
  /** Desabilita o campo */
  disabled?: boolean;
  /** Classe extra para customização */
  className?: string;
  /** Texto auxiliar abaixo do campo */
  helperText?: string;
  /** Indica erro (muda o estilo) */
  error?: boolean;
  /** Número mínimo de linhas para textarea */
  rows?: number;
}

export default function InputField({
  label,
  type = "text",
  placeholder,
  value = "",
  onChange,
  textarea = false,
  select = false,
  options = [],
  disabled = false,
  className = "",
  helperText,
  error = false,
  rows = 4,
}: InputFieldProps) {
  const baseClasses = `
    w-full rounded border outline-none transition-all bg-white
    ${error ? "border-redscale-100" : "border-grayscale-100"}
    ${disabled ? "opacity-60 cursor-not-allowed" : ""}
    ${className}
  `;

  return (
    <div className="flex flex-col gap-1">
      {label && <Text className="text-grayscale-550">{label}</Text>}

      {textarea ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          rows={rows}
          className={baseClasses}
        />
      ) : select ? (
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={baseClasses}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={baseClasses}
        />
      )}

      {helperText && (
        <Text className={`text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
          {helperText}
        </Text>
      )}
    </div>
  );
}
