"use client";

import { useState, useEffect } from "react";
import HomeEditorTemplate from "@/components/templates/Admin/Home";
import { getPageHome } from "@/lib/getPageHome";
import { PageHome } from "@/types/home";

export default function AdminHome() {
  const [page, setPage] = useState<PageHome | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPageHome()
      .then((data) => setPage(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (!page) return <p>Erro ao carregar a página</p>;

  return <HomeEditorTemplate page={page} />;
}
