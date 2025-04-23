"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Dashboardaluno: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || user.email); // 🔹 Agora pega o nome do usuário corretamente
      setLoading(false);
    } else {
      router.push("/login");
    }
  }, [router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-white text-xl">Carregando...</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/FundoCanva.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <Image onClick={() => router.push("")}
          src="/images/markim-Photoroom.png" alt="Logo Projeto Galileu" width={150} height={50} />

          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <button className="text-white hover:text-purple-300 px-6 py-3 rounded-md border border-purple-400">
                  Início
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/quemsomosaluno")} className="text-white px-6 py-3">
                  Quem Somos
                </button>
              </li>
              <li>
                <button onClick={() => router.push("/simulacoesaluno")} className="text-white px-6 py-3">
                  Simulações
                </button>
              </li>
              <li>
                <button 
                onClick={() => router.push("/editarperfilaluno")}
                className="bg-purple-600 text-white px-8 py-3 rounded-md">
                  {userName}
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex flex-col items-start justify-center py-16">
          <h1 className="text-6xl md:text-4xl font-bold text-white mb-6 max-w-3xl text-left">
            Uma aprendizagem sobre Plano Inclinado de uma forma interativa
          </h1>

          <p className="text-xl text-purple-200 mb-12 max-w-3xl text-left">
            O Projeto Galileu busca melhorar a compreensão da matéria de Plano Inclinado da disciplina de Física, tornando-a mais eficaz.
          </p>
          </main>
      </div>
    </div>
  );
};

export default Dashboardaluno;
