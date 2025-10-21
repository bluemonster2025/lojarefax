import { ElementType, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
  id?: string;
  title?: ReactNode;
  subtitle?: ReactNode | string;
  asTag?: ElementType;
  noPadding?: boolean;
}

export const Section = ({
  children,
  className,
  id,
  title,
  subtitle,
  asTag: Tag = "section",
  noPadding = false,
}: Props) => {
  const getClass = () =>
    `${!noPadding && "px-5"} w-full max-w-[77rem] 3xl:max-w-[100rem] mx-auto`;

  return (
    <Tag id={id} className={className}>
      <div className={getClass()}>
        {title && <div className="mb-2 text-center">{title}</div>}
        {subtitle && (
          <span className="block mb-10 md:mb-16 text-center px-5">
            {subtitle}
          </span>
        )}
        {children}
      </div>
    </Tag>
  );
};
