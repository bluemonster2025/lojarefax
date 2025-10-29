// app/layout.tsx
import "@/styles/globals.css";
import { Roboto_Condensed, Roboto_Flex, Roboto_Mono } from "next/font/google";
import ClientRoot from "./ClientRoot";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-roboto-condensed",
  display: "swap",
});

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-roboto-flex",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata = { title: "Refax", description: "Loja" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`min-h-screen flex flex-col ${robotoCondensed.variable} ${robotoFlex.variable} ${robotoMono.variable}`}
      >
        <ClientRoot>
          <main className="flex-1">{children}</main>
        </ClientRoot>
      </body>
    </html>
  );
}
