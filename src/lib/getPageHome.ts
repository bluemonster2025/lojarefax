import { PageHome } from "@/types/home";

export async function getPageHome(): Promise<PageHome> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pageHome`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar dados da Home");
  }

  const data = await res.json();

  // 🔹 Garante que databaseId exista
  const page: PageHome = {
    ...data,
    databaseId: data.databaseId ?? 0, // pega databaseId se existir, senão 0
  };

  return page;
}
