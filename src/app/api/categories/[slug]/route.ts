import { NextResponse, type NextRequest } from "next/server";
import { mapCategory } from "@/utils/mappers/mapCategory";
import { mapProduct } from "@/utils/mappers/mapProduct";

const WP_URL = process.env.WOO_SITE_URL!;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    // 1️⃣ Buscar categoria pelo slug
    const categoryQuery = `
      query CategoryBySlug($slug: [String]) {
        productCategories(where: { slug: $slug }) {
          nodes {
            id
            databaseId
            name
            slug
            uri
            description
            count
            image { sourceUrl altText }
            categoriaBanner {
              categoryCoverDesktop { node { sourceUrl altText } }
              categoryCoverMobile { node { sourceUrl altText } }
              categoryCoverVideo { node { mediaItemUrl } }
            }
          }
        }
      }
    `;

    const categoryRes = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: categoryQuery,
        variables: { slug: [slug] },
      }),
      cache: "no-store",
    });

    if (!categoryRes.ok)
      return NextResponse.json(
        { error: "Erro ao buscar categoria" },
        { status: categoryRes.status }
      );

    const categoryData = await categoryRes.json();
    const rawCategory = categoryData?.data?.productCategories?.nodes?.[0];

    if (!rawCategory)
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 }
      );

    const categoryId = Number(rawCategory.databaseId);
    if (!categoryId)
      return NextResponse.json(
        { error: "ID da categoria inválido" },
        { status: 400 }
      );

    // 2️⃣ Buscar produtos da categoria — apenas publicados
    const productsQuery = `
      query ProductsByCategory($categoryId: Int!, $status: String!) {
        allProducts(status: $status, categoryId: $categoryId) {
          id
          name
          slug
          status
          image { sourceUrl altText }
          productCategories { id name slug }
          productTags { name }
          ... on SimpleProduct {
            price
            regularPrice
            salePrice
          }
          ... on VariableProduct {
            price
            regularPrice
            salePrice
          }
        }
      }
    `;

    const productsRes = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: productsQuery,
        variables: { categoryId, status: "publish" },
      }),
      cache: "no-store",
    });

    if (!productsRes.ok)
      return NextResponse.json(
        { error: "Erro ao buscar produtos da categoria" },
        { status: productsRes.status }
      );

    const productsData = await productsRes.json();
    const products = productsData?.data?.allProducts?.map(mapProduct) || [];

    return NextResponse.json({
      category: mapCategory(rawCategory),
      products,
    });
  } catch (err) {
    console.error("💥 Erro interno:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
