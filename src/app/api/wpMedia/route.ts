"use server";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const WP_URL = process.env.WOO_SITE_URL!;

// ------------------------
// Tipos
// ------------------------
export interface MediaItem {
  databaseId: number;
  sourceUrl: string;
  altText: string;
  title: string;
}

interface MediaItemsResponse {
  mediaItems: {
    nodes: Array<{
      databaseId: number;
      sourceUrl?: string | null;
      altText?: string | null;
      title?: { rendered: string } | string | null;
    }>;
  };
}

interface GraphQLErrorItem {
  message: string;
}

interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLErrorItem[];
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
async function fetchWithToken<T>(query: string): Promise<GraphQLResponse<T>> {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Não autenticado");

  const res = await fetch(`${WP_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const result: GraphQLResponse<T> = await res.json();

  if (result.errors?.some((e) => e.message.includes("Expired token"))) {
    await refreshToken();
    token = (await cookies()).get("token")?.value;

    const retryRes = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    return await retryRes.json();
  }

  return result;
}

// ------------------------
// GET → buscar mídias
// ------------------------
export async function GET() {
  const query = `
    query MediaItems {
      mediaItems(first: 100) {
        nodes {
          databaseId
          sourceUrl
          altText
          title
        }
      }
    }
  `;

  try {
    const result = await fetchWithToken<MediaItemsResponse>(query);

    if (result.errors?.length) {
      return NextResponse.json(
        { error: result.errors.map((e) => e.message).join(", ") },
        { status: 500 }
      );
    }

    const nodes = result.data?.mediaItems.nodes || [];

    // ✅ Garante campos válidos
    const media: MediaItem[] = nodes
      .map((item) => ({
        databaseId: item.databaseId,
        sourceUrl: item.sourceUrl || "", // string vazia como fallback
        altText: item.altText || "",
        title:
          typeof item.title === "string"
            ? item.title
            : item.title?.rendered || "",
      }))
      .filter((item) => item.sourceUrl); // filtra items sem sourceUrl

    return NextResponse.json(media);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ------------------------
// POST → upload de mídia
// ------------------------
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("token")?.value;

    if (!token)
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;

    if (!file)
      return NextResponse.json(
        { error: "Arquivo não enviado" },
        { status: 400 }
      );

    const wpForm = new FormData();
    wpForm.append("file", file, (file as File).name);

    const res = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: wpForm,
    });

    // Token expirou → refresh e retry
    if (res.status === 401) {
      await refreshToken();
      token = (await cookies()).get("token")?.value;

      const retryRes = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: wpForm,
      });

      const retryData = await retryRes.json();
      if (!retryRes.ok)
        return NextResponse.json(
          { error: retryData },
          { status: retryRes.status }
        );

      const uploaded = retryData;

      return NextResponse.json({
        databaseId: uploaded.id,
        sourceUrl: uploaded.source_url || "",
        altText: uploaded.alt_text || "",
        title: uploaded.title?.rendered || "",
      });
    }

    const data = await res.json();
    if (!res.ok)
      return NextResponse.json({ error: data }, { status: res.status });

    return NextResponse.json({
      databaseId: data.id,
      sourceUrl: data.source_url || "",
      altText: data.alt_text || "",
      title: data.title?.rendered || "",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
