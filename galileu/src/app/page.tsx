"use client";

import Header from "../app/header";
import { useRouter } from "next/navigation";
import Image from "next/image";
import '@fontsource/poppins'; // Importa a fonte Poppins


const LandingPage: React.FC = () => {
  const router = useRouter(); // Hook para navegação

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
      {/* Cabeçalho */}
      <Header />

      <div className="container mx-auto px-4 py-8 pt-48"> {/* Aumentei o pt-32 para pt-48 para mover os elementos mais para baixo */}
        {/* Conteúdo principal */}
        <main className="flex flex-col items-start justify-center py-16">
          <h1 className="text-6xl md:text-4xl font-bold text-white mb-6 max-w-3xl text-left">
            Uma aprendizagem sobre Plano Inclinado de uma forma interativa
          </h1>

          <p className="text-xl text-purple-200 mb-12 max-w-3xl text-left">
            O Projeto Galileu busca melhorar a compreensão da matéria de Plano Inclinado da disciplina de Física, tornando-a mais eficaz.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => router.push("/login")}
              className="bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-500 font-bold transition duration-300">
              Começar Agora
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
