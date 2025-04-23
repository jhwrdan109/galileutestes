"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SimulacoesAnterioresAluno: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || user.email);
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
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/FundoCanva.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Imagem fixa na direita */}
      <div className="hidden md:block fixed right-0 bottom-0 z-10">
        <Image
          src="/images/galileuimagem.png"
          alt="Galileu"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-6 md:mb-0">
            <Image
              onClick={() => router.push("/dashboardaluno")}
              src="/images/markim-Photoroom.png"
              alt="Logo Projeto Galileu"
              width={150}
              height={50}
              className="hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </div>

          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <button 
                  onClick={() => router.push("/dashboardaluno")}
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push("/quemsomosaluno")}
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300"
                >
                  Quem Somos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push("/simulacoesaluno")}
                  className="text-white px-6 py-3 rounded-md font-bold border border-purple-400"
                >
                  Simulações
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push("/editarperfilaluno")}
                  className="bg-purple-600 text-white px-8 py-3 rounded-md font-bold transition duration-300"
                >
                  {userName}
                </button>
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex flex-col items-center text-center py-16">
          <div className="bg-purple-800 text-white px-8 py-6 rounded-lg shadow-lg mb-8 flex items-center gap-4">
            <button 
              onClick={() => router.push("/simulacoesaluno")}
              className="text-white hover:text-gray-300"
            >
              <ArrowBackIcon fontSize="large" />
            </button>
            <h1 className="text-4xl font-bold">Simulações Anteriores</h1>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SimulacoesAnterioresAluno;
