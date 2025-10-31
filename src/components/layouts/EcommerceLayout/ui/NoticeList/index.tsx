/** @/components/ui/NoticeList.tsx */
"use client";

import { ReactNode } from "react";
import { Title, Text } from "@/components/elements/Texts";

// util simples para juntar classes sem libs
function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

type Variant = "neutral" | "info" | "warning" | "success" | "danger";
type Bullet = "dot" | "dash" | "none" | "icon";

/** ---- Tipos seguros (sem any) ---- */
type StringItem = string;

interface BaseObjItem {
  id?: string | number;
  className?: string;
  icon?: ReactNode;
}

interface TextItem extends BaseObjItem {
  kind?: "text"; // default
  text: string;
  href?: undefined;
  html?: undefined;
}

interface LinkItem extends BaseObjItem {
  kind: "link";
  text: string;
  href: string;
  html?: undefined;
}

interface HtmlItem extends BaseObjItem {
  kind: "html";
  html: string;
  text?: undefined;
  href?: undefined;
}

export type NoticeItem = StringItem | TextItem | LinkItem | HtmlItem;

type NoticeListProps = {
  items?: NoticeItem[];
  title?: string;
  dense?: boolean;
  variant?: Variant;
  bullet?: Bullet;
  role?: "note" | "status" | "alert" | "dialog";
  ariaLabel?: string;
  className?: string;
  titleClassName?: string;
  listClassName?: string;
  itemClassName?: string;
  headerIcon?: "auto" | "none" | ReactNode;
  renderItem?: (item: NoticeItem, index: number) => ReactNode;
};

/** ---- Type guards ---- */
function isStringItem(i: NoticeItem): i is StringItem {
  return typeof i === "string";
}
function isObj(i: NoticeItem): i is TextItem | LinkItem | HtmlItem {
  return typeof i === "object" && i !== null;
}
function isLinkItem(i: TextItem | LinkItem | HtmlItem): i is LinkItem {
  return "kind" in i && i.kind === "link";
}
function isHtmlItem(i: TextItem | LinkItem | HtmlItem): i is HtmlItem {
  return ("kind" in i && i.kind === "html") || "html" in i;
}
function isTextItem(i: TextItem | LinkItem | HtmlItem): i is TextItem {
  return (
    (!("kind" in i) || i.kind === "text") &&
    "text" in i &&
    typeof i.text === "string"
  );
}

/** ---- Visual ---- */
function VariantIcon({ variant }: { variant: Variant }) {
  const stroke = "currentColor";
  const sw = 1.6;

  switch (variant) {
    case "warning":
      return (
        <svg
          width="29"
          height="26"
          viewBox="0 0 29 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.49654 8.75C9.54187 3.41667 11.3725 0.75 14.0832 0.75C17.1632 0.75 19.1099 4.19933 23.0005 11.0993L23.4859 11.958C26.7192 17.6913 28.3365 20.558 26.8752 22.654C25.4139 24.75 21.7979 24.75 14.5685 24.75H13.5979C6.36854 24.75 2.75254 24.75 1.2912 22.654C0.023204 20.8353 1.07387 18.434 3.48854 14.0833M14.0832 7.41667V14.0833"
            stroke="#0F0F0F"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M14.0832 19.4167C14.8196 19.4167 15.4165 18.8197 15.4165 18.0833C15.4165 17.347 14.8196 16.75 14.0832 16.75C13.3468 16.75 12.7499 17.347 12.7499 18.0833C12.7499 18.8197 13.3468 19.4167 14.0832 19.4167Z"
            fill="#0F0F0F"
          />
        </svg>
      );
    case "info":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth={sw} />
          <path
            d="M12 10v7m0-9V7.5"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    case "success":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth={sw} />
          <path
            d="m7.5 12 3 3 6-6"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    case "danger":
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth={sw} />
          <path
            d="M9 9l6 6m0-6-6 6"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth={sw} />
        </svg>
      );
  }
}

function variantClasses(variant: Variant) {
  const headerIcon =
    variant === "warning"
      ? "text-yellow-600"
      : variant === "info"
      ? "text-blue-600"
      : variant === "success"
      ? "text-green-600"
      : variant === "danger"
      ? "text-red-600"
      : "text-default-text";

  const bullet =
    variant === "warning"
      ? "bg-default-text"
      : variant === "info"
      ? "bg-blue-700/80"
      : variant === "success"
      ? "bg-green-700/80"
      : variant === "danger"
      ? "bg-red-700/80"
      : "bg-default-text/70";

  return {
    container:
      "rounded-lg bg-[color:var(--color-alert-yellow)] p-4 sm:p-5 flex items-center gap-4",
    headerIcon,
    bullet,
    text: "text-default-text/90",
  };
}

export default function NoticeList({
  items = [],
  title,
  dense = false,
  variant = "neutral",
  bullet = "dot",
  role = "note",
  ariaLabel,
  className,
  titleClassName,
  listClassName,
  itemClassName,
  headerIcon = "auto",
  renderItem,
}: NoticeListProps) {
  if (!items.length) return null;

  const v = variantClasses(variant);
  const HeaderIconNode =
    headerIcon === "auto" ? <VariantIcon variant={variant} /> : headerIcon;

  return (
    <div
      className={cx(v.container, className)}
      role={role}
      aria-label={ariaLabel || title || "notices"}
    >
      {(title || headerIcon !== "none") && (
        <div className="flex items-start gap-3 mb-3">
          {headerIcon !== "none" && (
            <div
              className={cx(
                "flex-shrink-0 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full",
                v.headerIcon
              )}
              aria-hidden="true"
            >
              {HeaderIconNode}
            </div>
          )}

          {title && (
            <div className="flex-1">
              <Title
                as="h5"
                variant="h5"
                className={cx("uppercase", titleClassName)}
              >
                {title}
              </Title>
            </div>
          )}
        </div>
      )}

      <ul className={cx("", dense && "space-y-1.5", listClassName)}>
        {items.map((it, idx) => {
          if (renderItem) return <li key={idx}>{renderItem(it, idx)}</li>;

          // normalização segura
          const obj: TextItem | LinkItem | HtmlItem = isStringItem(it)
            ? { text: it }
            : it && isObj(it)
            ? it
            : { text: "" };

          const key =
            "id" in obj && obj.id !== undefined
              ? String(obj.id)
              : isStringItem(it)
              ? `${idx}-${it.slice(0, 12)}`
              : `${idx}`;

          const itemSpecificClass =
            "className" in obj && obj.className ? obj.className : undefined;

          const iconNode =
            "icon" in obj && obj.icon ? (
              obj.icon
            ) : (
              <VariantIcon variant={variant} />
            );

          let content: ReactNode = null;
          if (isHtmlItem(obj)) {
            content = (
              <span
                className={v.text}
                dangerouslySetInnerHTML={{ __html: obj.html }}
              />
            );
          } else if (isLinkItem(obj)) {
            content = (
              <a href={obj.href} className={cx("underline", v.text)}>
                {obj.text}
              </a>
            );
          } else if (isTextItem(obj)) {
            content = (
              <Text as="p" variant="body-default" className={v.text}>
                {obj.text}
              </Text>
            );
          }

          return (
            <li
              key={key}
              className={cx(
                "flex gap-2 items-center",
                itemClassName,
                itemSpecificClass
              )}
            >
              {/* marcador */}
              {bullet === "dot" && (
                <span
                  className={cx("h-1 w-1 rounded-full flex-shrink-0", v.bullet)}
                />
              )}
              {bullet === "dash" && (
                <span
                  className={cx(
                    "mt-[9px] h-[2px] w-3 flex-shrink-0 rounded",
                    v.bullet
                  )}
                />
              )}
              {bullet === "icon" && (
                <span className={cx("mt-[2px] flex-shrink-0", v.headerIcon)}>
                  {iconNode}
                </span>
              )}
              {/* texto */}
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
