import { ButtonBase, IButtonBase } from "./ButtonBase";

// Remove o className obrigatório do tipo base e o reintroduz opcional
type ButtonVariantProps = Omit<IButtonBase, "className"> & {
  className?: string;
};

// Funções auxiliares
const hasCustomHeightClass = (className: string) =>
  /\bh-\[?.+?\]?/.test(className);
const hasCustomRoundedClass = (className: string) =>
  /\brounded(-[trblxy]?|-[\d]+)?/.test(className);

export const ButtonPrimary = ({
  children,
  onClick,
  href,
  type,
  id,
  target,
  className = "",
}: ButtonVariantProps) => {
  const defaultClasses =
    "bg-transparent text-white text-sm flex justify-center w-full border border-white uppercase items-center cursor-pointer px-4";

  const heightClass = hasCustomHeightClass(className) ? "" : "h-12";
  const roundedClass = hasCustomRoundedClass(className) ? "" : "rounded-lg";

  return (
    <ButtonBase
      className={`${defaultClasses} ${heightClass} ${roundedClass} ${className}`}
      onClick={onClick}
      href={href}
      type={type}
      id={id}
      target={target}
    >
      {children}
    </ButtonBase>
  );
};

export const ButtonSecondary = ({
  children,
  onClick,
  href,
  type,
  id,
  target,
  className = "",
}: ButtonVariantProps) => {
  const defaultClasses =
    "bg-transparent text-alert-green text-sm flex justify-center w-full border border-alert-green uppercase items-center cursor-pointer px-4";

  const heightClass = hasCustomHeightClass(className) ? "" : "h-[52px]";
  const roundedClass = hasCustomRoundedClass(className) ? "" : "rounded-lg";

  return (
    <ButtonBase
      className={`${defaultClasses} ${heightClass} ${roundedClass} ${className}`}
      onClick={onClick}
      href={href}
      type={type}
      id={id}
      target={target}
    >
      {children}
    </ButtonBase>
  );
};

export const ButtonTertiary = ({
  children,
  onClick,
  href,
  type,
  id,
  target,
  className = "",
}: ButtonVariantProps) => {
  const defaultClasses =
    "bg-white border border-redscale-100 text-redscale-100 hover:bg-redscale-100 hover:text-white flex justify-center w-full items-center transition-all cursor-pointer px-4 text-sm";

  const heightClass = hasCustomHeightClass(className) ? "" : "h-10";
  const roundedClass = hasCustomRoundedClass(className) ? "" : "rounded-lg";

  return (
    <ButtonBase
      className={`${defaultClasses} ${heightClass} ${roundedClass} ${className}`}
      onClick={onClick}
      href={href}
      type={type}
      id={id}
      target={target}
    >
      {children}
    </ButtonBase>
  );
};
