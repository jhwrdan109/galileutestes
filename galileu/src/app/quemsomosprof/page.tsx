"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Quemsomosprof: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(`Prof. ${user.name || user.email}`);
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
          <div className="mb-6 md:mb-0">
            <Image
            onClick={() => router.push("/dashboardprof")}
              src="/images/markim-Photoroom.png"
              alt="Logo Projeto Galileu"
              width={150}
              height={50}
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>

          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <button
                  onClick={() => router.push("/dashboardprof")}
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md  transition duration-300"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                onClick={() => router.push("")}
                className="text-white hover:text-purple-300 px-6 py-3 rounded-md border border-purple-400 hover:border-purple-300 transition duration-300">
                  Quem Somos
                </button>
              </li>
              <li>
                <button 
                onClick={() => router.push("/simuproftestesupabase")}
                className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300">
                  Simulações
                </button>
              </li>
              <li>
                <button 
                onClick={() => router.push("/editarperfilprof")}
                className="bg-purple-600 text-white px-8 py-3 rounded-md font-bold transition duration-300">
                  {userName}
                </button>
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex flex-col items-start justify-center py-16">
          <h1 className="text-6xl md:text-4xl font-bold text-white mb-6 max-w-3xl text-left">Quem Somos</h1>

          <p className="text-xl text-purple-200 mb-6 max-w-3xl text-left">
            Nós somos o <strong>Projeto Galileu</strong>, buscando melhorar a interação entre professor <br /> e aluno.
          </p>

          <p className="text-xl text-purple-200 mb-6 max-w-3xl text-left">
            Através da interação entre <strong>software e hardware</strong>, queremos tornar o ensino de <br /> Plano Inclinado mais acessível e intuitivo.
          </p>

          <p className="text-xl text-purple-200 max-w-3xl text-left">
            O projeto foi desenvolvido por alunos da <strong>Fundação Matias Machline</strong>, com o objetivo <br /> de ajudar mais estudantes a compreender melhor a física e obter melhores resultados <br /> em vestibulares e competições acadêmicas.
          </p>
        </main>
      </div>
    </div>
  );
};

export default Quemsomosprof;
