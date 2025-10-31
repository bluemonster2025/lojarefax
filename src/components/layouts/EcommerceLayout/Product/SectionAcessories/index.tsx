"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState, useCallback } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Section } from "@/components/elements/Section";
import { Title, Text } from "@/components/elements/Texts";
import { Skeleton } from "@/components/elements/Skeleton";
import { AccessoryProductNode } from "@/types/product";
import { parsePrice } from "@/utils/parsePrice";
import NoticeList from "@/components/layouts/EcommerceLayout/ui/NoticeList";

interface Props {
  /** Título do bloco — ex.: product.acessoriosMontagemTitle */
  title: string;
  subtitle: string;
  /** Somente acessórios (já normalizados pelo mapper) */
  accessories?: AccessoryProductNode[];
  loading?: boolean;
  /** Máximo a exibir no carrossel */
  maxAccessoriesPreview?: number;
  /** Rótulo do botão que abre o modal */
  buttonLabel?: string;

  notices?: string[];
  noticesTitle?: string;
}

export default function SectionAcessories({
  title,
  subtitle,
  accessories = [],
  loading = false,
  maxAccessoriesPreview = 12,
  buttonLabel = "Acessórios de Montagem",
  notices = [], // ✅ default
  noticesTitle = "Avisos", // ✅ default
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const skeletonCount = 6;
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const showDesktopButtons = accessories.length > 4;

  // keen-slider: o hook fica sempre no topo (sem chamadas condicionais)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 2.2, spacing: 16 },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": { slides: { perView: 4, spacing: 16 } },
      "(min-width: 1024px)": { slides: { perView: 4, spacing: 20 } },
    },
  });

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  // fecha com ESC e foca o botão fechar ao abrir
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);

    // trava o scroll de fundo
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // foco inicial no botão de fechar
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, closeModal]);

  // quando abrir o modal, dá um pequeno delay para garantir layout e então força um update do slider
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      instanceRef.current?.update?.();
    }, 50);
    return () => clearTimeout(t);
  }, [isOpen, instanceRef]);

  return (
    <>
      {/* Cabeçalho + botão que abre o modal */}
      <Section className="">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="">
            <button
              type="button"
              onClick={openModal}
              className="bg-transparent rounded-lg h-[52px] flex justify-center w-full border border-default-border uppercase items-center cursor-pointer"
            >
              <div className="flex gap-2">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10.3097 1.5H13.6547C14.1587 1.4925 14.6522 1.6575 15.0497 1.968C15.4502 2.28088 15.7266 2.72581 15.8297 3.2235L16.1222 4.626C16.2492 4.694 16.3742 4.764 16.4972 4.836L17.9147 4.371C18.2063 4.27688 18.5142 4.24416 18.8191 4.27488C19.124 4.3056 19.4192 4.3991 19.6862 4.5495C20.0162 4.7355 20.2937 5.0025 20.4872 5.3295L22.1747 8.1135C22.4475 8.54489 22.555 9.06038 22.4776 9.56487C22.4001 10.0694 22.1428 10.5288 21.7532 10.8585H21.7502L20.6372 11.808V12.195L21.7367 13.1745C22.1188 13.4988 22.3733 13.9482 22.4549 14.4427C22.5365 14.9372 22.4399 15.4446 22.1822 15.8745L20.5472 18.6645V18.6675C20.3523 18.9935 20.0761 19.2632 19.7455 19.4502C19.415 19.6372 19.0414 19.735 18.6617 19.734L18.6602 18.234C18.7817 18.2327 18.9012 18.2018 19.0082 18.144C19.1105 18.0873 19.1959 18.0045 19.2557 17.904L20.8937 15.1065C20.9708 14.9795 20.9993 14.8288 20.9739 14.6824C20.9485 14.536 20.871 14.4037 20.7557 14.31L20.7437 14.2995L19.1372 12.867V11.1165L20.7752 9.72C20.8923 9.6243 20.9701 9.48878 20.9936 9.33935C21.0171 9.18992 20.9848 9.03706 20.9027 8.91L20.8952 8.8965L19.1987 6.0975C19.1389 5.99699 19.0535 5.91416 18.9512 5.8575C18.8439 5.79898 18.7239 5.76757 18.6017 5.766H18.5972C18.5219 5.7658 18.4471 5.77693 18.3752 5.799H18.3722L16.2947 6.483L15.9947 6.288C15.7203 6.11106 15.4347 5.95222 15.1397 5.8125L14.8022 5.652L14.3612 3.528V3.525C14.3294 3.37613 14.246 3.24329 14.1257 3.15C13.9975 3.04952 13.8385 2.99652 13.6757 3H10.2902C10.1273 2.99652 9.96834 3.04952 9.84017 3.15C9.71932 3.24305 9.63535 3.37591 9.60317 3.525V3.528L9.16067 5.6535L8.82317 5.8125C8.52517 5.9535 8.23767 6.1125 7.96067 6.2895L7.65317 6.4875L5.63717 5.778C5.57212 5.76425 5.50554 5.7592 5.43917 5.763L5.41517 5.766H5.39117C5.26908 5.76711 5.14911 5.798 5.04167 5.856C4.93936 5.91266 4.85395 5.99549 4.79417 6.096L4.79117 6.1035L3.09917 8.8935C3.02206 9.02053 2.99355 9.17119 3.01892 9.31761C3.04429 9.46403 3.12182 9.59631 3.23717 9.69L3.24917 9.7005L4.85567 11.133V12.261L3.28967 14.2365L3.23117 14.286C3.11234 14.3802 3.03252 14.5151 3.00705 14.6646C2.98158 14.8141 3.01225 14.9677 3.09317 15.096L3.09767 15.1035L4.79417 17.9025C4.8545 18.0026 4.93979 18.0853 5.04167 18.1425C5.14867 18.2025 5.26517 18.233 5.39117 18.234H5.39567C5.47067 18.234 5.54467 18.223 5.61767 18.201H5.62067L7.69817 17.517L7.99817 17.712C8.27217 17.889 8.55717 18.0475 8.85317 18.1875L9.19067 18.348L9.63317 20.475C9.66317 20.619 9.74267 20.754 9.86717 20.85C9.99317 20.949 10.1522 21.003 10.3172 21H13.7327C13.8955 21.0035 14.0545 20.9505 14.1827 20.85L15.1082 22.032C14.7097 22.3438 14.2161 22.509 13.7102 22.5H10.3382C9.8333 22.5083 9.34087 22.3431 8.94317 22.032C8.54264 21.7191 8.26621 21.2742 8.16317 20.7765L7.87067 19.3725C7.74402 19.3055 7.61898 19.2355 7.49567 19.1625L6.07817 19.6275C5.78656 19.7216 5.47862 19.7543 5.17374 19.7236C4.86886 19.6929 4.57364 19.5994 4.30667 19.449C3.97622 19.2646 3.7 18.9967 3.50567 18.672L1.81667 15.882C1.55478 15.4593 1.45017 14.9579 1.52122 14.4658C1.59227 13.9737 1.83442 13.5223 2.20517 13.191L3.32567 11.778L2.25617 10.8255C1.87354 10.5009 1.6188 10.0507 1.53747 9.55559C1.45613 9.06043 1.5535 8.55248 1.81217 8.1225L1.81517 8.1195L3.50567 5.3295C3.69741 5.00698 3.96932 4.73955 4.29498 4.5532C4.62064 4.36685 4.98897 4.26791 5.36417 4.266C5.59017 4.254 5.81317 4.2755 6.03317 4.3305L6.06617 4.3395L7.46867 4.833C7.59167 4.761 7.71667 4.692 7.84367 4.626L8.13467 3.225C8.23739 2.72676 8.51384 2.28125 8.91467 1.968C9.31067 1.6575 9.80567 1.4925 10.3097 1.5ZM5.38667 19.734H5.38517L5.39117 18.984V19.734H5.38667ZM18.6062 4.266H18.6092L18.6032 5.016V4.266H18.6062ZM12.0002 9C11.2045 9 10.4415 9.31607 9.87885 9.87868C9.31624 10.4413 9.00017 11.2044 9.00017 12C9.00017 12.7956 9.31624 13.5587 9.87885 14.1213C10.4415 14.6839 11.2045 15 12.0002 15C12.7958 15 13.5589 14.6839 14.1215 14.1213C14.6841 13.5587 15.0002 12.7956 15.0002 12C15.0002 11.2044 14.6841 10.4413 14.1215 9.87868C13.5589 9.31607 12.7958 9 12.0002 9ZM7.50017 12C7.50028 11.2366 7.69461 10.4857 8.06488 9.81809C8.43514 9.15047 8.96918 8.58802 9.61673 8.18366C10.2643 7.77931 11.0041 7.54635 11.7665 7.5067C12.5289 7.46705 13.2888 7.62202 13.9748 7.95702C14.6608 8.29202 15.2503 8.79604 15.6878 9.42166C16.1254 10.0473 16.3965 10.7739 16.4758 11.5332C16.5551 12.2925 16.4399 13.0595 16.1411 13.762C15.8423 14.4645 15.3697 15.0795 14.7677 15.549L17.1242 19.0845L15.8762 19.9155L13.4417 16.2645C12.7645 16.4935 12.0426 16.5579 11.3356 16.4523C10.6286 16.3467 9.95694 16.0742 9.37622 15.6574C8.7955 15.2406 8.32243 14.6915 7.99619 14.0554C7.66994 13.4194 7.49991 12.7148 7.50017 12Z"
                    fill="#282828"
                  />
                </svg>
                <Title as="h5" variant="h5" className="text-sm">
                  {buttonLabel}
                </Title>
              </div>
            </button>
          </div>
        </div>
      </Section>

      {/* Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          {/* overlay (clica fora fecha) */}
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          {/* conteúdo do modal — limita altura e ativa scroll quando precisa */}
          <div
            className="
        relative z-[101] w-full max-w-6xl mx-auto
      bg-default-white rounded-2xl shadow-xl border border-default-border
        pb-4 sm:pb-6 px-4 sm:px-6
        max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)]
        overflow-y-auto overscroll-contain rf-scroll
        pr-3 sm:pr-4                 /* espaço pra barra não encostar no conteúdo */
        [scrollbar-gutter:stable_both-edges]  /* tailwind arbitrary property */
      "
            onClick={(e) => e.stopPropagation()}
          >
            {/* header do modal */}
            <div className="flex items-start justify-between gap-4 mb-8 border-b border-b-default-border">
              <div className="py-6">
                <Title as="h5" variant="h5">
                  kit
                </Title>
                <Title as="h2" variant="h2">
                  {title}
                </Title>
                <Text variant="body-default">{subtitle}</Text>
              </div>
              <button
                ref={closeBtnRef}
                onClick={closeModal}
                aria-label="Fechar"
                className="
          sticky top-5 ml-auto -mt-2 -mr-2 sm:mr-0 sm:mt-0
          w-6 h-6 flex justify-center items-center
          text-3xl leading-none cursor-pointer text-default-text z-20
        "
              >
                ×
              </button>
            </div>

            {/* carrossel + navegação posicionada nas bordas do 1º e 4º itens */}
            <div
              ref={sliderContainerRef}
              className="relative overflow-visible px-6 lg:px-10"
            >
              {/* Botões (aparecem só quando há mais de 4 itens) */}
              {showDesktopButtons && (
                <>
                  <button
                    onClick={() => instanceRef.current?.prev()}
                    aria-label="Anterior"
                    className="
                hidden lg:flex
                absolute top-1/2 -translate-y-1/2
                left-[-5px]
                z-10 w-9 h-9 rounded-full
                bg-default-text text-default-white
                items-center justify-center cursor-pointer
              "
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => instanceRef.current?.next()}
                    aria-label="Próximo"
                    className="
                hidden lg:flex
                absolute top-1/2 -translate-y-1/2
                right-[-5px]
                z-10 w-9 h-9 rounded-full
                bg-default-text text-default-white
                items-center justify-center cursor-pointer
              "
                  >
                    ›
                  </button>
                </>
              )}

              {loading ? (
                <div ref={sliderRef} className="keen-slider">
                  {[...Array(skeletonCount)].map((_, i) => (
                    <div
                      key={i}
                      className="keen-slider__slide border border-default-border rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Skeleton className="h-5 w-32 rounded" />
                      </div>
                      <div className="relative mx-auto w-full max-w-[182px] aspect-[182/182] rounded-lg overflow-hidden">
                        <Skeleton className="w-full h-full rounded-lg" />
                      </div>
                      <div className="mt-3 flex flex-col items-center gap-2">
                        <Skeleton className="h-5 w-40 rounded" />
                        <Skeleton className="h-4 w-48 rounded" />
                        <Skeleton className="h-5 w-24 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div ref={sliderRef} className="keen-slider">
                  {accessories
                    .slice(0, Math.max(0, maxAccessoriesPreview))
                    .map((a) => {
                      const mainCategoryName =
                        a.mainCategoryName ??
                        a.productCategories?.nodes?.find((c) => !c.parentId)
                          ?.name ??
                        undefined;

                      return (
                        <div
                          key={a.id}
                          className="keen-slider__slide py-2 px-1"
                        >
                          <div className="border border-default-border rounded-2xl flex flex-col w-full max-w-[300px] mx-auto aspect-[283/414] p-4">
                            {/* Categoria principal */}
                            {mainCategoryName && (
                              <Title
                                as="h5"
                                variant="h5"
                                className="border border-default-border px-2 w-fit mx-auto rounded"
                              >
                                {mainCategoryName}
                              </Title>
                            )}

                            {/* Imagem */}
                            <div className="relative mx-auto w-full max-w-[182px] aspect-[182/182] rounded-lg overflow-hidden">
                              {a.image?.sourceUrl ? (
                                <Image
                                  src={a.image.sourceUrl}
                                  alt={a.image.altText || a.name}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 600px"
                                  className="object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-skeleton" />
                              )}
                              <Link
                                href={a.slug ? `/produto/${a.slug}` : "#"}
                                className="absolute inset-0"
                                aria-label={`Abrir acessório ${a.name}`}
                              />
                            </div>

                            {/* Nome + Subtítulo + Preço */}
                            <div className="text-center px-2 mb-3">
                              <Title as="h3" variant="h3">
                                {a.name}
                              </Title>
                              {a.subtitulo && (
                                <Title as="h5" variant="h5">
                                  {a.subtitulo}
                                </Title>
                              )}
                            </div>

                            {a.price && (
                              <div className="mx-auto">
                                {a.price !== undefined
                                  ? (() => {
                                      const formatted = new Intl.NumberFormat(
                                        "pt-BR",
                                        {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }
                                      ).format(parsePrice(a.price));
                                      const [inteiro, centavos] =
                                        formatted.split(",");
                                      return (
                                        <Title as="h2" variant="h2">
                                          R$ {inteiro},{centavos}
                                        </Title>
                                      );
                                    })()
                                  : "-"}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {notices.length > 0 && (
              <div className="mt-4">
                <NoticeList
                  items={notices}
                  title={noticesTitle}
                  variant="warning"
                  bullet="dot"
                  role="note"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
