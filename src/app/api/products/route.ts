import { NextRequest, NextResponse } from "next/server";
import { mapProduct } from "@/utils/mappers/mapProduct";
import type { RawProduct } from "@/types/product";

const WP_URL = process.env.WOO_SITE_URL!;

type ProductQueryVariables = {
  search?: string | null;
  categoryIn?: string[] | undefined;
  minPrice?: number | null;
  maxPrice?: number | null;
  order?: "ASC" | "DESC" | null;
  after?: string | null;
  status?: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || null;
  const categoryId = searchParams.get("categoryId") || null;
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : null;
  const order = searchParams.get("sort")?.toUpperCase() as
    | "ASC"
    | "DESC"
    | null;
  const status = searchParams.get("status") || "publish";

  let query: string;
  let variables: ProductQueryVariables = {};

  try {
    if (status) {
      let decodedCategoryId: number | undefined = undefined;
      if (categoryId) {
        try {
          const decoded = atob(categoryId);
          const idPart = decoded.split(":")[1];
          decodedCategoryId = idPart ? Number(idPart) : undefined;
        } catch {
          decodedCategoryId = Number(categoryId);
        }
      }

      query = `
        query AllProducts(
          $status: String!
          $search: String
          $limit: Int
          $categoryId: Int
        ) {
          allProducts(
            status: $status
            search: $search
            limit: $limit
            categoryId: $categoryId
          ) {
            id
            name
            slug
            status
            image {
              sourceUrl
              altText
            }
            productCategories {
              id
              name
              slug
            }
            productTags {
              id
              name
              slug
            }
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

      variables = {
        status,
        search,
        categoryIn: decodedCategoryId ? [String(decodedCategoryId)] : undefined,
        minPrice,
        maxPrice,
        order,
      };
    } else {
      query = `
        query Products(
          $search: String
          $categoryIn: [String]
          $minPrice: Float
          $maxPrice: Float
          $order: OrderEnum
          $after: String
        ) {
          products(
            first: 50
            after: $after
            where: {
              search: $search
              categoryIn: $categoryIn
              minPrice: $minPrice
              maxPrice: $maxPrice
              orderby: { field: PRICE, order: $order }
            }
          ) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              id
              name
              slug
              status
              image {
                sourceUrl
                altText
              }
              productCategories {
                id
                name
                slug
              }
              productTags {
                id
                name
                slug
              }
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
        }
      `;

      let decodedCategoryId: number | undefined = undefined;
      if (categoryId) {
        try {
          const decoded = atob(categoryId);
          const idPart = decoded.split(":")[1];
          decodedCategoryId = idPart ? Number(idPart) : undefined;
        } catch {
          decodedCategoryId = Number(categoryId);
        }
      }

      variables = {
        search,
        categoryIn: decodedCategoryId ? [String(decodedCategoryId)] : undefined,
        minPrice,
        maxPrice,
        order,
      };
    }

    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          ...variables,
          limit: 50,
          categoryId: variables.categoryIn
            ? Number(variables.categoryIn[0])
            : undefined,
        },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao buscar produtos" },
        { status: res.status }
      );
    }

    const result = await res.json();

    // ✅ Corrigido: agora mapeia os produtos de allProducts também
    if (result.data?.allProducts) {
      const mappedProducts = result.data.allProducts.map((p: RawProduct) =>
        mapProduct(p)
      );

      return NextResponse.json(mappedProducts);
    }

    const mappedProducts =
      result.data?.products?.nodes?.map((p: RawProduct) => mapProduct(p)) || [];

    return NextResponse.json(mappedProducts);
  } catch (err) {
    console.error("💥 Erro interno ao buscar produtos:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
