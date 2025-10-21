import { ReactNode } from "react";

export interface Props
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  children: ReactNode;
}

export const LinkExternal = ({ children, className, href, ...rest }: Props) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
};
