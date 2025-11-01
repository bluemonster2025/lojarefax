"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Title, Text } from "@/components/elements/Texts";
import { Section } from "@/components/elements/Section";
import type { MoreSpecs, MoreSpecsTab } from "@/types/product";

/* ===================== Helpers ===================== */
const isNonEmpty = (s?: string | null): s is string =>
  !!(s && String(s).trim().length > 0);

function getYoutubeEmbed(url?: string | null): string | null {
  if (!isNonEmpty(url)) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (isNonEmpty(v)) return `https://www.youtube.com/embed/${v}`;
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.indexOf("embed");
      if (idx >= 0 && isNonEmpty(parts[idx + 1]))
        return `https://www.youtube.com/embed/${parts[idx + 1]}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace("/", "");
      if (isNonEmpty(id)) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {}
  return null;
}

function hasAnyContent(t?: MoreSpecsTab | null): t is MoreSpecsTab {
  if (!t) return false;
  return (
    isNonEmpty(t.titulo) ||
    isNonEmpty(t.descricao1) ||
    isNonEmpty(t.imagem1?.sourceUrl) ||
    isNonEmpty(t.imagem2?.sourceUrl) ||
    (Array.isArray(t.avisos) && t.avisos.length > 0) ||
    (Array.isArray(t.linhas) && t.linhas.length > 0) ||
    isNonEmpty(t.tituloDescricao2) ||
    isNonEmpty(t.descricao2) ||
    isNonEmpty(t.tituloDescricao3) ||
    isNonEmpty(t.descricao3) ||
    isNonEmpty(t.linkVideo)
  );
}

/* ===================== Props ===================== */
export type MoreSpecsTabsProps = {
  data?: MoreSpecs | null;
  title?: string;
  subtitle?: string;
  className?: string;
  defaultTab?: number; // 0-based
};

/* ===================== Component ===================== */
export default function MoreSpecsTabs({
  data,
  title,
  subtitle,
  className,
  defaultTab = 0,
}: MoreSpecsTabsProps) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  // filtra tabs com conteúdo (memo seguro mesmo sem data)
  const tabs = useMemo(() => (data?.tab ?? []).filter(hasAnyContent), [data]);

  // 🔧 Hooks ANTES de qualquer return condicional
  const [active, setActive] = useState(0);

  // quando tabs chegarem/alterarem, clamp no índice inicial
  useEffect(() => {
    const clamped =
      tabs.length === 0
        ? 0
        : Math.max(0, Math.min(defaultTab, tabs.length - 1));
    setActive(clamped);
  }, [defaultTab, tabs.length]);

  // mantém índice válido se a lista encurtar
  useEffect(() => {
    if (active > tabs.length - 1) {
      setActive(Math.max(0, tabs.length - 1));
    }
  }, [tabs.length, active]);

  // rolar botão ativo para a visão (mobile)
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const btn = list.querySelector<HTMLButtonElement>(
      `#${baseId}-tab-${active}`
    );
    btn?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    });
  }, [active, baseId]);

  // A11y: navegação por teclado
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (tabs.length <= 1) return;
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % tabs.length;
    else if (e.key === "ArrowLeft")
      next = (active - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
  }

  // ❗️Só agora podemos dar return se não houver conteúdo
  if (!data || tabs.length === 0) {
    console.warn(
      "[MoreSpecsTabs] sem conteúdo — data existe?",
      !!data,
      "tabs.length=",
      tabs.length
    );
    return null;
    // nenhum hook abaixo deste ponto
  }

  const heading = title ?? data.titulo ?? "";
  const sub = subtitle ?? data.produto ?? "";

  return (
    <Section className={"w-full " + (className || "")}>
      {(isNonEmpty(heading) || isNonEmpty(sub)) && (
        <div className="mb-6 md:mb-8">
          {isNonEmpty(heading) ? (
            <Title
              as="h2"
              className="text-2xl md:text-3xl font-bold capitalize"
            >
              {heading}
            </Title>
          ) : null}
          {isNonEmpty(sub) ? (
            <Text className="text-base md:text-lg text-[color:var(--color-default-text,#6b7280)] mt-1">
              {sub}
            </Text>
          ) : null}
        </div>
      )}

      {/* Header de abas */}
      <div
        ref={listRef}
        role="tablist"
        aria-label={isNonEmpty(heading) ? heading : "Mais especificações"}
        className="relative -mx-4 px-4 md:mx-0 md:px-0 mb-6 md:mb-8 flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent"
        onKeyDown={onKeyDown}
      >
        {tabs.map((t, i) => {
          const selected = i === active;
          const label = isNonEmpty(t.titulo) ? t.titulo! : `Seção ${i + 1}`;
          return (
            <button
              key={`tab-btn-${i}`}
              id={`${baseId}-tab-${i}`}
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={
                "shrink-0 rounded-full border px-4 py-2 text-sm md:text-base transition " +
                (selected
                  ? "border-black bg-black text-white"
                  : "border-black/20 bg-white text-black hover:border-black/40")
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Painéis */}
      {tabs.map((t, i) => {
        const isActive = i === active;
        const video = getYoutubeEmbed(t.linkVideo);

        return (
          <div
            key={`tab-panel-${i}`}
            id={`${baseId}-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${i}`}
            hidden={!isActive}
            className={isActive ? "block" : "hidden"}
          >
            {isNonEmpty(t.titulo) && (
              <Title
                as="h3"
                className="text-xl md:text-2xl font-semibold mb-3 capitalize"
              >
                {t.titulo}
              </Title>
            )}

            {(isNonEmpty(t.descricao1) || t.imagem1 || t.imagem2) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-1">
                  {isNonEmpty(t.descricao1) ? (
                    <Text className="leading-relaxed whitespace-pre-line">
                      {t.descricao1}
                    </Text>
                  ) : null}
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isNonEmpty(t.imagem1?.sourceUrl) && (
                    <figure className="relative w-full overflow-hidden rounded-2xl border border-black/10">
                      <Image
                        src={t.imagem1!.sourceUrl}
                        alt={t.titulo ?? heading ?? "Imagem 1"}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-cover"
                      />
                    </figure>
                  )}
                  {isNonEmpty(t.imagem2?.sourceUrl) && (
                    <figure className="relative w-full overflow-hidden rounded-2xl border border-black/10">
                      <Image
                        src={t.imagem2!.sourceUrl}
                        alt={t.titulo ?? heading ?? "Imagem 2"}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-cover"
                      />
                    </figure>
                  )}
                </div>
              </div>
            )}

            {Array.isArray(t.linhas) && t.linhas.length > 0 && (
              <div className="mt-6 md:mt-8">
                <div className="space-y-5">
                  {t.linhas.map((linha, li) => (
                    <div key={`linha-${li}`}>
                      <div className="text-xs uppercase tracking-wide text-black/60 mb-2">
                        {linha.tituloLinha}
                      </div>
                      <div
                        className="grid"
                        style={{
                          gridTemplateColumns: `repeat(${Math.max(
                            1,
                            linha.itensLinha.length
                          )}, minmax(0,1fr))`,
                        }}
                      >
                        {linha.itensLinha.map((item, ii) => (
                          <div
                            key={`item-${li}-${ii}`}
                            className="p-3 border border-black/10 first:rounded-l-xl last:rounded-r-xl text-sm text-black/80"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(t.avisos) && t.avisos.length > 0 && (
              <div className="mt-6 md:mt-8">
                <div className="text-sm font-semibold mb-2">Avisos</div>
                <ul className="space-y-2">
                  {t.avisos.map((a, ai) => (
                    <li
                      key={`av-${ai}`}
                      className="text-sm leading-relaxed pl-3 border-l-2 border-black/20 text-black/80"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(isNonEmpty(t.tituloDescricao2) || isNonEmpty(t.descricao2)) && (
              <div className="mt-6 md:mt-8">
                {isNonEmpty(t.tituloDescricao2) ? (
                  <Title
                    as="h4"
                    className="text-lg font-semibold mb-1 capitalize"
                  >
                    {t.tituloDescricao2}
                  </Title>
                ) : null}
                {isNonEmpty(t.descricao2) ? (
                  <Text className="leading-relaxed whitespace-pre-line">
                    {t.descricao2}
                  </Text>
                ) : null}
              </div>
            )}

            {(isNonEmpty(t.tituloDescricao3) || isNonEmpty(t.descricao3)) && (
              <div className="mt-6 md:mt-8">
                {isNonEmpty(t.tituloDescricao3) ? (
                  <Title
                    as="h4"
                    className="text-lg font-semibold mb-1 capitalize"
                  >
                    {t.tituloDescricao3}
                  </Title>
                ) : null}
                {isNonEmpty(t.descricao3) ? (
                  <Text className="leading-relaxed whitespace-pre-line">
                    {t.descricao3}
                  </Text>
                ) : null}
              </div>
            )}

            {isNonEmpty(t.linkVideo) && video && (
              <div className="mt-6 md:mt-8">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-black/10">
                  <iframe
                    src={video}
                    title={t.titulo ?? "Vídeo"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </Section>
  );
}
