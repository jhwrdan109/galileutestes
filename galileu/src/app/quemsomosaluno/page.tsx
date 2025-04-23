"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Quemsomosaluno: React.FC = () => {
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
          <Image 
          onClick={() => router.push("/dashboardaluno")}
          src="/images/markim-Photoroom.png" alt="Logo Projeto Galileu" width={150} height={50} />

          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              <li>
                <button onClick={() => router.push("/dashboardaluno")} className="text-white px-6 py-3">
                  Início
                </button>
              </li>
              <li>
                <button className="text-white hover:text-purple-300 px-6 py-3 rounded-md border border-purple-400">
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

        <main className="flex flex-col items-start justify-center py-5">
          <h1 className="text-6xl md:text-4xl font-bold text-white mb-6 max-w-3xl text-left">
            Quem Somos
          </h1>

          <p className="text-xl text-white-200 mb-6 max-w-3xl text-left">
           Nós somos o Projeto Galileu, buscando melhorar a interação entre professor <br /> e aluno.
          </p>


          <p className="text-lg text-white mb-6 max-w-3xl text-left">
            Através da interação entre software e hardware, queremos tornar o estudo de Física mais acessível e interativo, 
            focando no tema de Plano Inclinado para ajudar estudantes a melhorarem seu desempenho em vestibulares.
          </p>

          <p className="text-lg text-white max-w-3xl text-left">
            Somos alunos da Fundação Matias Machline, cursando o terceiro ano do ensino médio técnico.
          </p>
        </main>
      </div>
    </div>
  );
};

export default Quemsomosaluno;
