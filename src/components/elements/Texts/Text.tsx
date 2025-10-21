"use client";

import React, { CSSProperties, ReactNode } from "react";

type TextVariant =
  | "body-upper"
  | "body-default"
  | "mini-upper"
  | "mini-default";

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  className?: string;
  style?: CSSProperties;
  as?: keyof React.JSX.IntrinsicElements; // ✅ Corrigido: escopo React
}

export const Text = ({
  children,
  variant = "body-default",
  className = "",
  style,
  as: Tag = "span",
}: TextProps) => {
  const variantClasses: Record<TextVariant, string> = {
    "body-upper": "font-body-upper",
    "body-default": "font-body-default",
    "mini-upper": "font-mini-upper",
    "mini-default": "font-mini-default",
  };

  const combinedClassName =
    `block ${variantClasses[variant]} ${className}`.trim();

  return (
    <Tag className={combinedClassName} style={style}>
      {children}
    </Tag>
  );
};
