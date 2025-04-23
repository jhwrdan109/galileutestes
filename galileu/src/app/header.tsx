"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <header className="absolute top-0 left-0 w-full  py-4 px-8 flex flex-col md:flex-row justify-between items-center z-50">
      {/* Logo */}
      <div className="mb-4 md:mb-0">
        <img
          src="/images/markim-Photoroom.png"
          alt="Logo Projeto Galileu"
          width={150}
          height={50}
          className="hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Navegação */}
      <nav>
        <ul className="flex flex-wrap justify-center gap-6">
          <li>
            <button
              onClick={() => router.push("/login")} // Rota "Entrar" (todas as rotas redirecionam para /login)
              className="text-white hover:text-purple-300 px-6 py-3 rounded-md border border-purple-400 hover:border-purple-300 transition duration-300"
            >
              Início
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/login")} // Rota "Entrar" (todas as rotas redirecionam para /login)
              className="text-white hover:text-purple-300 px-6 py-3 rounded-md border border-purple-400 hover:border-purple-300 transition duration-300"
            >
              Quem Somos
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/login")} // Rota "Entrar" (todas as rotas redirecionam para /login)
              className="text-white hover:text-purple-300 px-6 py-3 rounded-md border border-purple-400 hover:border-purple-300 transition duration-300"
            >
              Simulações
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/login")} // Rota "Entrar"
              className="bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-500 font-bold transition duration-300"
            >
              ENTRAR
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;