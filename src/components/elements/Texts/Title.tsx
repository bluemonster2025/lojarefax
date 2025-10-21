"use client";

import React, {
  CSSProperties,
  ReactNode,
  ElementType,
  forwardRef,
} from "react";

type TitleVariant = "hero" | "h1" | "h2" | "h3" | "h4" | "h5";

interface TitleProps {
  as?: ElementType;
  variant?: TitleVariant;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Title = forwardRef<HTMLElement, TitleProps>(
  (
    { children, className = "", as: Element = "h1", style, variant = "h1" },
    ref
  ) => {
    const variantClasses: Record<TitleVariant, string> = {
      hero: "font-title-hero",
      h1: "font-title-h1",
      h2: "font-title-h2",
      h3: "font-title-h3",
      h4: "font-title-h4",
      h5: "font-title-h5",
    };

    const combinedClassName = `${variantClasses[variant]} ${className}`.trim();

    return (
      <Element className={combinedClassName} style={style} ref={ref}>
        {children}
      </Element>
    );
  }
);

Title.displayName = "Title";
