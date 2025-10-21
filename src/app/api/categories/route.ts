import { NextResponse } from "next/server";

const WP_URL = process.env.WOO_SITE_URL!;

export async function GET() {
  const query = `
query Categories {
      productCategories(first: 50, where: { parent: 0, hideEmpty: true }) {
        nodes {
          id
          name
          slug
          uri
          description
          count
          image {
            altText
            sourceUrl
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
        { error: "Erro ao buscar categorias" },
        { status: res.status }
      );
    }

    const result = await res.json();
    return NextResponse.json(result.data.productCategories.nodes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
