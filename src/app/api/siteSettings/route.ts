import { mapSiteSettings } from "@/utils/mappers/mapSiteSettings";
import { NextResponse } from "next/server";

const WP_URL = process.env.WOO_SITE_URL!;

// Handler
export async function GET() {
  try {
    const query = /* GraphQL */ `
      query ConfiguracoesSite {
        page(id: "configuracoes-site", idType: URI) {
          id
          title
          content
          configuracoesDoSite {
            logoSite {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 }, // cache opcional
    });

    const { data } = await response.json();

    if (!data?.page) {
      return NextResponse.json(
        { error: "Configurações não encontradas" },
        { status: 404 }
      );
    }

    const configuracoes = mapSiteSettings(data.page);

    return NextResponse.json(configuracoes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações do site" },
      { status: 500 }
    );
  }
}
