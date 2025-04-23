"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../../../lib/firebaseConfig";
import { ref, get } from "firebase/database";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      console.log("Usuário logado:", user.uid);

      // 🔹 Buscar tipo do usuário no Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        setError("Usuário não encontrado no banco de dados.");
        return;
      }

      const userType = snapshot.val().accountType;
      localStorage.setItem("user", JSON.stringify({ ...snapshot.val(), uid: user.uid }));

      // 🔄 Redirecionamento baseado no tipo de usuário
      router.push(userType === "professor" ? "/dashboardprof" : "/dashboardaluno");
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError("Erro ao fazer login. Verifique suas credenciais!");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-start bg-cover bg-center fixed top-0 left-0"
      style={{ backgroundImage: "url('/images/FundoCanva.png')", backgroundSize: "cover", backgroundAttachment: "fixed" }}>
      
      {/* 🔹 Ícone de voltar */}
      <ArrowBackIcon className="absolute top-4 left-4 text-white cursor-pointer hover:scale-110 transition"
        fontSize="large" onClick={() => router.push("/")} />

      <div className="p-6 rounded-lg shadow-lg max-w-xs w-full absolute top-1/2 left-10 transform -translate-y-1/2 backdrop-blur-lg bg-transparent">
        <div className="flex justify-center mb-4">
          <Image src="/images/markim-Photoroom.png" alt="Logo Projeto Galileu" width={120} height={40}
            className="hover:scale-105 transition-transform duration-300" />
        </div>
        <h2 className="text-white text-xl font-bold text-center">Login</h2>

        {error && <p className="text-red-400 text-center mb-3">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="text-white text-sm font-semibold block mb-1">E-mail</label>
            <input type="email" className="w-full p-2 rounded bg-gray-100 text-gray-900 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite seu e-mail"
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="text-white text-sm font-semibold block mb-1">Senha</label>
            <input type="password" className="w-full p-2 rounded bg-gray-100 text-gray-900 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite sua senha"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            <a href="/esqueceuasenha" className="text-purple-400 text-xs block mt-1 hover:underline text-left">
              Esqueceu a senha?
            </a>
          </div>

          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-500 font-bold text-sm transition duration-300">
            Entrar
          </button>
        </form>

        <p className="text-white text-center text-sm mt-3">
          Ainda não tem uma conta? {" "}
          <a href="/cadastro" className="text-purple-400 font-bold hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
