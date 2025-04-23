"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../../lib/firebaseConfig";
import {
  ArrowLeftCircle,
  Eye,
  XCircle,
  FileText,
  ClipboardCheck,
  CheckCircle,
} from "lucide-react";

interface Questao {
  enunciado: string;
  resolucao: string;
  alternativas: string[];
  incognita: string;
  alternativaCorreta: string;
  criadoEm: string;
  professor: string;
}

const AdicionarQuestaoProf = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoSelecionada, setQuestaoSelecionada] = useState<Questao | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.uid);
      setUserName(`Prof. ${user.name || user.email}`);
      setLoading(false);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (userId) {
      const db = getDatabase(app);
      const questoesRef = ref(db, `questoesPorProfessor/${userId}/questoes`);
      onValue(questoesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const listaQuestoes = Object.values(data) as Questao[];
          setQuestoes(listaQuestoes);
        } else {
          setQuestoes([]);
        }
      });
    }
  }, [userId]);

  const abrirModal = (questao: Questao) => {
    setQuestaoSelecionada(questao);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setQuestaoSelecionada(null);
  };

  const selecionarQuestao = () => {
    if (questaoSelecionada) {
      console.log("Questão selecionada:", questaoSelecionada);
      fecharModal();
    }
  };

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
      

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-6 md:mb-0">
            <Image
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
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/quemsomosprof")}
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300"
                >
                  Quem Somos
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/simulacoesprof")}
                  className="text-white hover:text-purple-300 px-6 py-3 rounded-md transition duration-300"
                >
                  Simulações
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/editarperfilprof")}
                  className="bg-purple-600 text-white px-8 py-3 rounded-md font-bold transition duration-300"
                >
                  {userName}
                </button>
              </li>
            </ul>
          </nav>
        </header>

        {/* Container com seta de voltar */}
        <div className="relative bg-purple-900 bg-opacity-40 p-6 rounded-2xl shadow-xl mb-10">
          <button
            onClick={() => router.push("/criarsalaprof")}
            className="absolute top-4 left-4 text-purple-300 hover:text-white transition flex items-center gap-1"
          >
            <ArrowLeftCircle size={24} /> Voltar
          </button>

          <h1 className="text-3xl font-bold text-white text-center mb-6">
            Adicionar Questão à Sala
          </h1>

          {questoes.length === 0 ? (
            <p className="text-gray-300 text-center">Nenhuma questão criada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {questoes.map((questao, index) => (
                <div
                  key={index}
                  className="bg-purple-800 p-4 rounded-2xl shadow-md flex flex-col justify-between hover:scale-105 transition-transform"
                >
                  <h2 className="text-lg font-semibold mb-2">
                    <FileText className="inline mr-2" /> {questao.enunciado.slice(0, 60)}...
                  </h2>
                  <button
                    onClick={() => abrirModal(questao)}
                    className="mt-4 bg-purple-600 hover:bg-purple-500 transition px-4 py-2 rounded flex items-center justify-center gap-2"
                  >
                    <Eye size={20} /> Ver Detalhes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalAberto && questaoSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-6 max-w-xl w-full relative shadow-lg">
            <button
              onClick={fecharModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-red-600"
            >
              <XCircle size={28} />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ClipboardCheck size={24} /> Detalhes da Questão
            </h2>
            <div className="space-y-2">
              <p><strong>Enunciado:</strong> {questaoSelecionada.enunciado}</p>
              <p><strong>Resolução:</strong> {questaoSelecionada.resolucao}</p>
              <p><strong>Alternativas:</strong></p>
              <ul className="list-disc list-inside ml-4">
                {questaoSelecionada.alternativas.map((alt, i) => (
                  <li key={i}>{String.fromCharCode(65 + i)} - {alt}</li>
                ))}
              </ul>
              <p><strong>Alternativa Correta:</strong> {questaoSelecionada.alternativaCorreta}</p>
              <p><strong>Incógnita:</strong> {questaoSelecionada.incognita}</p>
              <p><strong>Criado em:</strong> {new Date(questaoSelecionada.criadoEm).toLocaleString()}</p>
              <p><strong>Professor:</strong> {questaoSelecionada.professor}</p>
            </div>
            <button
              onClick={selecionarQuestao}
              className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} /> Selecionar esta questão
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdicionarQuestaoProf;
