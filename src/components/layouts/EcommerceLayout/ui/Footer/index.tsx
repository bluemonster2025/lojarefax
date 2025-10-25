"use client";

import { Section } from "@/components/elements/Section";
import { Text, Title } from "@/components/elements/Texts";
import Link from "next/link";
import { contactItems, footerContent } from "./content";
import { LinkExternal } from "@/components/elements/LinkExternal/LinkExternal";
import Icon from "@/components/elements/Icon";
import { Skeleton } from "@/components/elements/Skeleton";
import Logo from "../Logo";
import Image from "next/image";

interface Props {
  logo?: { sourceUrl: string; altText?: string };
  loading?: boolean;
}

export default function Footer({ logo, loading }: Props) {
  return (
    <>
      <div className="refax-linear">
        <Section className="py-8">
          <div className="flex gap-4 items-center justify-between">
            {loading || !logo ? (
              <div className="w-[112px] h-[112px] flex items-center">
                <Skeleton className="w-[108px] h-[38px] bg-gray-200 animate-pulse rounded" />
              </div>
            ) : (
              <Logo logo={logo} />
            )}

            <div className="flex gap-3">
              {[
                { icon: "AiOutlineYoutube", label: "Youtube" },
                { icon: "FaFacebookF", label: "Facebook" },
                { icon: "FaInstagram", label: "Instagram" },
              ].map((item) => (
                <LinkExternal key={item.label} href="/" aria-label={item.label}>
                  <Icon name={item.icon} color="#fff" size={22} />
                </LinkExternal>
              ))}
            </div>
          </div>
        </Section>
      </div>

      {/* 🔹 Conteúdo principal */}
      <div className="bg-default-white">
        <Section>
          <div className="py-10 grid grid-cols-1 md:grid-cols-5 gap-8 border-b border-default-border">
            {footerContent.map(({ title, links, description, images }) => (
              <div key={title}>
                <Title as="h4" variant="h4" className="text-[#484848] mb-4">
                  {title}
                </Title>

                {/* Lista de links */}
                {links && (
                  <ul className="space-y-4 text-xs">
                    {links.map(({ label, href }) => (
                      <li key={label}>
                        <Link href={href}>
                          <Text variant="mini-upper" className="text-[#484848]">
                            {label}
                          </Text>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Imagens (Pagamentos / Avaliados por) */}
                {images && (
                  <div className="w-full aspect-[177/76] relative">
                    <div className="absolute inset-0 flex items-center justify-center gap-4 px-4">
                      {images.map(({ src, alt }) => (
                        <div
                          key={alt}
                          className="relative flex-1 h-full min-w-[86px] max-w-[177px]"
                        >
                          <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Texto adicional */}
                {description && <div>{description}</div>}
              </div>
            ))}
          </div>

          {/* 🔹 Contatos */}
          <div className="flex flex-col sm:flex-row justify-between py-8 gap-4">
            {contactItems.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                {icon}
                <Text
                  variant="mini-upper"
                  className="text-[#484848] font-extralight"
                >
                  {text}
                </Text>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* 🔹 Rodapé inferior */}
      <div className="text-[#1B1B1B] bg-default-background py-2">
        <Section>
          <div className="flex justify-between">
            <div>
              <Text variant="mini-upper">
                Copyright © 2025 todos os direitos reservados
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Text variant="mini-upper">Design e desenvolvimento:</Text>
              <div className="flex items-center gap-2">
                <div className="relative w-[20px] aspect-square">
                  <Image
                    fill
                    src="/images/logos/bluemonster.svg"
                    alt="Blue Monster"
                  />
                </div>
                <Text variant="body-default">bluemonster.com.br</Text>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
