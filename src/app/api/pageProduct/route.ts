// src/app/api/pageProduto/route.ts
import { NextResponse } from "next/server";
import { mapPageProduct } from "@/utils/mappers/mapPageProduct";
import { RawPage, PageProducts } from "@/types/pageProducts";

const WP_URL = process.env.WOO_SITE_URL!;

interface GraphQLResponse {
  data?: { page?: RawPage };
}

export async function GET() {
  const query = `
    query PageProduto {
      page(id: "produto", idType: URI) {
        id
        slug
        title
        produtoSectionBanner {
          productBannerImage {
            node {
              altText
              sourceUrl
            }
          }
          productBannerImageMobile {
            node {
              altText
              sourceUrl
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar página" },
        { status: res.status }
      );
    }

    const result: GraphQLResponse = await res.json();

    if (!result.data?.page) {
      return NextResponse.json(
        { error: "Página não encontrada" },
        { status: 404 }
      );
    }

    const page: PageProducts = mapPageProduct(result.data.page);

    return NextResponse.json(page);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
