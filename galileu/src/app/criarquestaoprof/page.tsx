'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Paperclip,
  Clock,
  CheckCircle,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import { getDatabase, ref, push } from "firebase/database";
import { app } from "../../../lib/firebaseConfig";

const CriarQuestaoprof: React.FC = () => {
  const router = useRouter();
  const [enunciado, setEnunciado] = useState("");
  const [resolucao, setResolucao] = useState("");
  const [alternativas, setAlternativas] = useState("");
  const [incognita, setIncognita] = useState("");
  const [alternativaCorreta, setAlternativaCorreta] = useState("A");
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [anexo, setAnexo] = useState<File | null>(null);
  const [tempoMinutos, setTempoMinutos] = useState<number>(0);
  const [tempoSegundos, setTempoSegundos] = useState<number>(0);
  const [mostrarModalAnexo, setMostrarModalAnexo] = useState(false);
  const [mostrarModalTempo, setMostrarModalTempo] = useState(false);
  const [anexoBase64, setAnexoBase64] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(`Prof. ${user.name || user.email}`);
      setUserId(user.uid);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAnexo(file);

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnexoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvarQuestao = async () => {
    if (!userId) return;

    const tempoTotal = tempoMinutos * 60 + tempoSegundos; // Converte para segundos

    const novaQuestao = {
      enunciado,
      resolucao,
      alternativas: alternativas.split(",").map((alt) => alt.trim()),
      incognita,
      alternativaCorreta,
      criadoEm: new Date().toISOString(),
      professor: userName,
      tempo: tempoTotal,
      anexo: anexoBase64, // Store base64 encoded image
    };

    try {
      const db = getDatabase(app);
      const questoesRef = ref(db, `questoesPorProfessor/${userId}/questoes`);
      await push(questoesRef, novaQuestao);
      alert("Questão salva com sucesso!");
      
    } catch (error) {
      console.error("Erro ao salvar a questão:", error);
      alert("Erro ao salvar a questão. Tente novamente.");
    }
  };

  const ModalAnexo = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-purple-700 p-8 rounded-lg shadow-lg w-1/2 relative">
        <button
          onClick={() => setMostrarModalAnexo(false)}
          className="absolute top-2 right-2 text-white hover:text-red-600"
        >
          <XCircle size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Anexar Imagem</h2>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 text-white border border-purple-400 rounded-lg p-3 bg-purple-900"
        />
        {anexo && (
          <div className="mb-4">
            <p className="text-sm text-white">Arquivo selecionado: {anexo.name}</p>
            <div className="mt-2 border-2 border-purple-500 p-2 rounded-lg">
              <Image
                src={URL.createObjectURL(anexo)}
                alt="Pré-visualização"
                width={300}
                height={200}
                className="rounded-lg"
              />
            </div>
          </div>
        )}
        <button
          onClick={() => setMostrarModalAnexo(false)}
          className="mt-4 bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Confirmar
        </button>
      </div>
    </div>
  );

  const ModalTempo = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-purple-700 p-8 rounded-lg shadow-lg w-1/3 relative">
        <button
          onClick={() => setMostrarModalTempo(false)}
          className="absolute top-2 right-2 text-white hover:text-red-600"
        >
          <XCircle size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Definir Tempo</h2>
        <div className="flex gap-4 items-center">
          <div className="w-full">
            <label className="text-white">Minutos</label>
            <input
              type="number"
              value={tempoMinutos}
              onChange={(e) => setTempoMinutos(Number(e.target.value))}
              className="w-full p-3 border border-purple-400 rounded-lg bg-purple-900 text-white"
              min={0}
            />
          </div>
          <div className="w-full">
            <label className="text-white">Segundos</label>
            <input
              type="number"
              value={tempoSegundos}
              onChange={(e) => setTempoSegundos(Number(e.target.value))}
              className="w-full p-3 border border-purple-400 rounded-lg bg-purple-900 text-white"
              min={0}
              max={59}
            />
          </div>
        </div>
        <button
          onClick={() => setMostrarModalTempo(false)}
          className="mt-4 bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Confirmar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/images/FundoCanva.png')" }}>
      <div className="container mx-auto px-4 py-6">
        {/* Header and navigation */}
      </div>

      <div className="flex flex-col items-center justify-center text-center">
        <div className="bg-purple-900 p-6 rounded-lg shadow-lg border border-purple-300 max-w-xl w-full text-center relative">
          <button
            onClick={() => router.push("/escolhacriadasoucriarprof")}
            className="absolute top-4 left-4 text-white hover:text-purple-300 transition duration-300"
          >
            <ArrowLeft size={32} />
          </button>

          <h1 className="text-3xl font-bold text-white mb-6">Criar Questão</h1>

          <label className="block text-white text-left">Enunciado:</label>
          <textarea
            placeholder="Digite o enunciado da questão..."
            value={enunciado}
            onChange={(e) => setEnunciado(e.target.value)}
            className="w-full p-3 rounded-md text-black border border-gray-300 resize-none h-24 mb-4"
          ></textarea>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setMostrarModalAnexo(true)}
              className="flex items-center gap-2 text-white hover:text-purple-300 transition duration-300"
            >
              <Paperclip size={24} /> Anexar Imagem
            </button>
            <button
              onClick={() => setMostrarModalTempo(true)}
              className="flex items-center gap-2 text-white hover:text-purple-300 transition duration-300"
            >
              <Clock size={24} /> Definir Tempo
            </button>
          </div>

          <div className="mt-6">
            <label className="block text-white text-left">Resolução:</label>
            <textarea
              placeholder="Resolução da questão..."
              value={resolucao}
              onChange={(e) => setResolucao(e.target.value)}
              className="w-full p-3 rounded-md text-black border border-gray-300 resize-none h-20 mb-4"
            ></textarea>

            <label className="block text-white text-left">Alternativas:</label>
            <input
              type="text"
              placeholder="Alternativas (separadas por vírgula)"
              value={alternativas}
              onChange={(e) => setAlternativas(e.target.value)}
              className="w-full p-3 rounded-md text-black border border-gray-300 mb-4"
            />

            <label className="block text-white text-left">Incógnita:</label>
            <select
              value={incognita}
              onChange={(e) => setIncognita(e.target.value)}
              className="w-full p-3 rounded-md text-black border border-gray-300 mb-4"
            >
              <option value="">Selecione uma incógnita</option>
              <option value="velocidade">Velocidade</option>
              <option value="px">Px</option>
              <option value="py">Py</option>
              <option value="força normal">Força Normal</option>
              <option value="força de atrito">Força de Atrito</option>
              <option value="aceleração">Aceleração</option>
            </select>

            <label className="block text-white text-left">Alternativa Correta:</label>
            <select
              value={alternativaCorreta}
              onChange={(e) => setAlternativaCorreta(e.target.value)}
              className="w-full p-3 rounded-md text-black border border-gray-300 mb-4"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>

          <button
            onClick={handleSalvarQuestao}
            className="mt-6 bg-purple-700 text-white px-6 py-3 rounded-md font-bold flex items-center justify-center gap-2 hover:bg-purple-500 transition duration-300 w-full"
          >
            <CheckCircle size={24} /> Confirmar Questão
          </button>
        </div>
      </div>

      {mostrarModalAnexo && <ModalAnexo />}
      {mostrarModalTempo && <ModalTempo />}
    </div>
  );
};

export default CriarQuestaoprof;
