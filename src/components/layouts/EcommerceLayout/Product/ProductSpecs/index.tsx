// components/product/ProductSpecs.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Product, TechnicalSpecs } from "@/types/product";
import { Text, Title } from "@/components/elements/Texts";
import { IoChevronDown } from "react-icons/io5";
import { Section } from "@/components/elements/Section";

type Props =
  | {
      product: Product;
      specs?: never;
      className?: string;
      title?: string;
      subtitle?: string;
      defaultOpen?: boolean;
    }
  | {
      product?: never;
      specs: TechnicalSpecs | undefined;
      className?: string;
      title?: string;
      subtitle?: string;
      defaultOpen?: boolean;
    };

export default function ProductSpecs(props: Props) {
  const { className, defaultOpen = false } = props;

  const fromProduct = (props as { product?: Product }).product
    ?.especificacoesTecnicas;
  const fromProps = (props as { specs?: TechnicalSpecs }).specs;
  const data = fromProps ?? fromProduct;

  const overrideTitle = (props as { title?: string }).title;
  const overrideSubtitle = (props as { subtitle?: string }).subtitle;

  const tituloPrincipal = overrideTitle ?? data?.tituloPrincipal ?? undefined;
  const subtituloPrincipal =
    overrideSubtitle ?? data?.subtituloPrincipal ?? undefined;

  const list = useMemo(
    () => data?.especificacoes ?? [],
    [data?.especificacoes]
  );

  const measureKey = useMemo(
    () =>
      list.length +
      "-" +
      list
        .map((i) => `${i.titulo?.length ?? 0}:${i.descricao?.length ?? 0}`)
        .join(","),
    [list]
  );

  const [open, setOpen] = useState<boolean>(defaultOpen);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentH, setContentH] = useState<number>(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setContentH(open ? el.scrollHeight : 0);
  }, [open, measureKey]);

  if (!data || list.length === 0) {
    return (
      <Section className={cn("", className)}>
        {(tituloPrincipal || subtituloPrincipal) && (
          <header className="mb-4">
            {tituloPrincipal && (
              <h2 className="text-xl font-semibold tracking-tight text-[var(--color-default-text,#0F172A)]">
                {tituloPrincipal}
              </h2>
            )}
            {subtituloPrincipal && (
              <p className="mt-1 text-sm text-[color-mix(in_oK,black,transparent)] opacity-70">
                {subtituloPrincipal}
              </p>
            )}
          </header>
        )}
        <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/40 p-4 text-sm text-zinc-500">
          Nenhuma especificação técnica cadastrada.
        </div>
      </Section>
    );
  }

  return (
    <Section className={cn("py-8", className)}>
      {/* Cabeçalho do acordeon */}
      <div
        className={cn(
          "relative bg-default-white border border-default-border p-4 transition-colors",
          open ? "rounded-t-lg border-b-0" : "rounded-lg"
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="rf-specs-panel"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "cursor-pointer group w-full flex justify-between gap-4 items-center",
            "select-none"
          )}
        >
          <div className="flex flex-col text-left">
            {tituloPrincipal && (
              <Title as="h5" variant="h5">
                {tituloPrincipal}
              </Title>
            )}
            {subtituloPrincipal && (
              <Title as="h2" variant="h2">
                {subtituloPrincipal}
              </Title>
            )}
          </div>

          {/* Ícone (gira quando abre) */}
          <IoChevronDown
            className={cn(
              "mt-1 shrink-0 transition-transform duration-300",
              open ? "rotate-180" : "rotate-0"
            )}
            size={18}
            aria-hidden
          />
        </button>
      </div>

      {/* Conteúdo do acordeon (animado) */}
      <div
        id="rf-specs-panel"
        className={cn(
          "transition-[height] duration-300 ease-in-out overflow-hidden bg-default-white",
          open
            ? "border-x border-b border-default-border rounded-b-lg"
            : "border-none"
        )}
        style={{ height: contentH }}
      >
        <div ref={contentRef}>
          <div className="p-8">
            <dl className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2 border-t border-t-default-border pt-4">
              {list.map((item, idx) => {
                const hasTitle = !!item.titulo?.trim();
                const hasDesc = !!item.descricao?.trim();
                if (!hasTitle && !hasDesc) return null;

                return (
                  <div key={`${item.titulo ?? "spec"}-${idx}`}>
                    <dt className="bg-default-background p-4">
                      <Text variant="body-upper">{item.titulo}</Text>
                    </dt>
                    {hasDesc && (
                      <dd className="p-4">
                        <Text variant="body-default">{item.descricao}</Text>
                      </dd>
                    )}
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* util mínima p/ concatenar classes */
function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}
