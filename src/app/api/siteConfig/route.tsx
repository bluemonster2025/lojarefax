// app/api/siteConfig/route.ts
import { NextResponse } from "next/server";

/**
 * Função utilitária para uso no servidor (SSR, loaders, etc.)
 */
async function getSiteConfig() {
  const query = `
    query ConfiguracoesDoSite {
      configuracoesDoSite {
        configuracoes {
          logoDoSite {
            node {
              sourceUrl
              altText
            }
          }
          notificationBar {
            notificationOnoff
            notificationMesssage
          }
        }
      }
    }
  `;

  const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    next: { revalidate: 60 },
  });

  const { data } = await res.json();
  return data.configuracoesDoSite;
}

/**
 * Handler HTTP GET — agora cria a rota /api/siteConfig
 */
export async function GET() {
  try {
    const data = await getSiteConfig();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Erro ao obter siteConfig:", error);
    return NextResponse.json(
      { error: "Erro ao carregar configuração" },
      { status: 500 }
    );
  }
}
