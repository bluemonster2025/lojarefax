"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // ⬅️ IMPORTANTE
import { Section } from "@/components/elements/Section";
import { Title, Text } from "@/components/elements/Texts";
import { ButtonSecondary } from "@/components/elements/Button";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuth(); // ⬅️ PEGA O SETUSER DO CONTEXTO

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", //
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();

      // ✅ Atualiza o contexto imediatamente
      setUser(data.user);

      router.push("/admin/home");
    } else {
      const data = await res.json();
      setError(data.error || "Usuário ou senha inválidos");
    }
  }

  return (
    <Section className="bg-grayscale-200 p-12 mx-auto relative">
      <div className="flex flex-col gap-12 w-[384px] aspect-[0.95/1]">
        <Title className="text-2xl font-semibold text-grayscale-450 text-center">
          Sistema de gerenciamento
        </Title>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 bg-white border border-grayscale-100 p-8 rounded-[6px]"
        >
          <p className="text-[22px] text-black mb-4">Login</p>
          <div className="flex flex-col gap-2">
            <Text>Usuário </Text>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="name"
              className="border border-grayscale-200 rounded p-4 outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Text>Senha </Text>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*********"
              className="border border-grayscale-200 rounded p-4 outline-none"
            />
          </div>
          <ButtonSecondary type="submit" disabled={loading}>
            <Text className="uppercase cursor-pointer">
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </ButtonSecondary>
        </form>
      </div>

      {/* Modal de erro */}
      {error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center animate-fadeIn">
            <h2 className="text-lg font-semibold mb-2 text-black">
              Erro ao entrar
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => setError("")}
              className="bg-black text-white rounded px-4 py-2 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
