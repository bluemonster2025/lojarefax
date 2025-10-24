"use server";

import { NextResponse } from "next/server";
import { mapHome } from "@/utils/mappers/mapHome";
import { RawHome, PageHome } from "@/types/home";
import { cookies } from "next/headers";

const WP_URL = process.env.WOO_SITE_URL!;

// Tipos GraphQL
interface GraphQLErrorItem {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, unknown>;
}

interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLErrorItem[];
}

type AcfFields = Record<string, unknown>;

interface UpdateACFResponse {
  updateACFFields: { success: boolean };
}

// ========================
// GET → página Home
// ========================
export async function GET() {
  const query = `
    query Home {
  page(id: "home", idType: URI) {
    databaseId
    id
    slug
    title
    homeHero {
      heroImage {
        node {
          mediaItemUrl
        }
      }
      heroImageMobile {
        node {
          mediaItemUrl
        }
      }
    }
    homeSessao2 {
      titleSessao2
      featuredTags2
      visibleTag2
      featuredProducts2 {
        nodes {
          ... on Product {
            id
            uri
            title
            productTags {
              nodes {
                name
              }
            }
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
          ... on SimpleProduct {
            price
          }
          ... on VariableProduct {
            price
          }
        }
      }
    }
    homeSessao3 {
      titleSessao3
      featuredTags3
      visibleTag3
      featuredProducts3 {
        nodes {
          ... on Product {
            id
            uri
            title
            productTags {
              nodes {
                name
              }
            }
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
          ... on SimpleProduct {
            price
          }
          ... on VariableProduct {
            price
          }
        }
      }
    }
    homeSessao5 {
      featuredTags5
      visibleTag5
      featuredProducts5 {
        nodes {
          ... on Product {
            id
            uri
            title
            productTags {
              nodes {
                name
              }
            }
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
          ... on SimpleProduct {
            price
          }
          ... on VariableProduct {
            price
          }
        }
      }
    }
    homeBanner {
      homeBannerDesktop {
        node {
          altText
          sourceUrl
        }
      }
      homeBannerMobile {
        node {
          altText
          sourceUrl
        }
      }
    }
    homeSessao7 {
      titleSessao7
      featuredTags7
      visibleTag7
      featuredProducts7 {
        nodes {
          ... on Product {
            id
            uri
            title
            productTags {
              nodes {
                name
              }
            }
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
          ... on SimpleProduct {
            price
          }
          ... on VariableProduct {
            price
          }
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

    const result: GraphQLResponse<{ page: RawHome }> = await res.json();

    if (!res.ok || !result.data?.page) {
      return NextResponse.json(
        { error: "Erro ao buscar página" },
        { status: res.status || 404 }
      );
    }

    const page: PageHome = mapHome(result.data.page);
    return NextResponse.json(page);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ------------------------
// Função para refresh do token
// ------------------------
async function refreshToken(): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
    method: "POST",
  });
}

// ------------------------
// Função fetch com token e retry
// ------------------------
async function fetchWithToken<T>(
  query: string,
  variables: unknown
): Promise<GraphQLResponse<T>> {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Não autenticado");

  const res = await fetch(`${WP_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result: GraphQLResponse<T> = await res.json();

  // Se token expirou → refresh e retry
  if (result.errors?.some((e) => e.message.includes("Expired token"))) {
    await refreshToken();
    token = (await cookies()).get("token")?.value;

    const retryRes = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    return await retryRes.json();
  }

  return result;
}

// ------------------------
// POST → atualizar ACF
// ------------------------
export async function POST(req: Request) {
  try {
    const { pageId, acfFields }: { pageId: number; acfFields: AcfFields } =
      await req.json();

    if (!pageId || !acfFields) {
      return NextResponse.json(
        { error: "pageId ou acfFields não informados" },
        { status: 400 }
      );
    }

    const mutation = `
      mutation UpdateAnyACF($input: UpdateACFFieldsInput!) {
        updateACFFields(input: $input) {
          success
        }
      }
    `;

    const variables = {
      input: {
        pageId,
        acfFields: JSON.stringify(acfFields),
      },
    };

    const result = await fetchWithToken<UpdateACFResponse>(mutation, variables);

    if (result.errors?.length) {
      return NextResponse.json(
        { error: result.errors.map((e) => e.message).join(", ") },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
