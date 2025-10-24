import HeaderMain from "./HeaderMain";
import HeaderMobile from "./HeaderMobile";
import HeaderTop from "./HeaderTop";

interface Props {
  logo?: { sourceUrl: string; altText?: string };
  loading?: boolean;
  hideHeaderFooter?: boolean;
}

export default function Header({ logo, loading, hideHeaderFooter }: Props) {
  if (hideHeaderFooter) return null;
  return (
    <header className="w-full">
      {/* Desktop */}
      <div className="hidden lg:block">
        <HeaderTop />
        <HeaderMain logo={logo} loading={loading} />
      </div>

      {/* Mobile */}
      <HeaderMobile logo={logo} />
    </header>
  );
}
