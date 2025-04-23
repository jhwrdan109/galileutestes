"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const TestesDeSalaDeAula: React.FC = () => {
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
      {/* Imagem fixa na esquerda, ajustada para ficar mais para cima */}
      <div className="hidden md:block fixed left-0 mt-40 py-40 z-10">
        <Image
          src="/images/galileuimagem.png"
          alt="Galileu"
          width={250} // Ajuste o tamanho conforme necessário
          height={50}
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
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>
        </header>

        <main className="flex flex-col items-center justify-center text-center py-16">
          <div className="flex flex-col gap-6">
            {/* Outros botões ou conteúdos adicionais podem ser inseridos aqui */}
          </div>
        </main>
      </div>

      {/* Informações do professor e código da sala acima do container, lado a lado */}
      <div className="fixed left-4 top-1/4 bg-transparent p-4 flex items-center space-x-8 z-20">
        <p className="text-lg font-semibold text-white">Professor: {userName}</p>
        <p className="text-lg font-semibold text-white">Código da Sala: 12345</p>
      </div>

      {/* Container branco ajustado para ir do meio até quase a ponta direita */}
      <div className="fixed right-4 top-1/3 bg-white p-8 rounded-lg shadow-lg w-11/12 lg:w-2/3 h-36">
        <div className="flex justify-center items-center h-full">
          {/* Futuramente você pode adicionar uma imagem aqui */}
          <p className="text-center text-gray-600">Conteúdo do container branco</p>
        </div>
      </div>

      {/* Botão para inserir resposta abaixo do container */}
      <div className="fixed bottom-16 left-4">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-blue-600 transition duration-300"
          onClick={() => alert("Resposta inserida!")}
        >
          Inserir Resposta
        </button>
      </div>

      {/* Botão para começar o timer no canto inferior esquerdo */}
      <div className="fixed bottom-4 left-4">
        <button
          className="bg-purple-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-purple-600 transition duration-300"
          onClick={() => alert("Timer iniciado!")}
        >
          Iniciar Timer
        </button>
      </div>
    </div>
  );
};

export default TestesDeSalaDeAula;
