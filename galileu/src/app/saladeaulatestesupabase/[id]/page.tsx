"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "../../../../lib/supabase";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "../../../../lib/firebaseConfig"; // Importe sua configuração do Firebase

interface Questao {
  id: string;
  enunciado: string;
  alternativas: { [key: string]: string };
  resolucao?: string;
  alternativa_correta?: string;
  tempo?: number;
  anexo?: string | null;
}

interface Sala {
  id: string;
  nome: string;
  codigo: string;
  questoes_firebase_ids: string[];
  created_by_user_id: string;
}

const SalaDeAulaTesteSupabase: React.FC = () => {
  const router = useRouter();
  const { id: salaId } = useParams();

  const [sala, setSala] = useState<Sala | null>(null);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [loadingSala, setLoadingSala] = useState(true);
  const [errorSala, setErrorSala] = useState<string | null>(null);
  const [loadingQuestoes, setLoadingQuestoes] = useState(true);
  const [errorQuestoes, setErrorQuestoes] = useState<string | null>(null);
  const database = getDatabase(app); // Inicialize o Firebase Database
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimeRunning, setIsTimeRunning] = useState(false);
  const [showModalFinal, setShowModalFinal] = useState(false);
  const [showResolucaoGeral, setShowResolucaoGeral] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [questaoId: string]: string }>({});
  const [isRevising, setIsRevising] = useState(false);

  const currentQuestion = questoes[currentQuestionIndex];

  useEffect(() => {
    console.log("salaId no useEffect:", salaId);
    if (salaId) {
      fetchSala(salaId);
    } else {
      setErrorSala("ID da sala não encontrado na URL.");
      setLoadingSala(false);
    }
  }, [salaId]);

  useEffect(() => {
    if (sala?.questoes_firebase_ids && sala.created_by_user_id) {
      fetchQuestoesFromFirebase(sala.created_by_user_id, sala.questoes_firebase_ids);
    }
  }, [sala]);

  useEffect(() => {
    if (currentQuestion?.tempo && !isRevising) {
      setTimeRemaining(currentQuestion.tempo);
    } else {
      setTimeRemaining(null);
    }
    setIsTimeRunning(!isRevising);
    setSelectedAnswer(userAnswers[currentQuestion?.id] || null); // Carrega a resposta anterior se existir
  }, [currentQuestionIndex, currentQuestion?.tempo, userAnswers, isRevising]);

  useEffect(() => {
    if (isTimeRunning && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && isTimeRunning) {
      setIsTimeRunning(false);
      goToNextQuestion();
    }
  }, [isTimeRunning, timeRemaining]);

  const fetchSala = async (id: string) => {
    setLoadingSala(true);
    setErrorSala(null);
    console.log("id dentro de fetchSala:", id);
    try {
      const { data, error } = await supabase
        .from("salas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao buscar detalhes da sala:", error);
        setErrorSala("Erro ao carregar os detalhes da sala.");
      } else if (data) {
        setSala(data as Sala);
      } else {
        setErrorSala("Sala não encontrada.");
      }
    } catch (error: any) {
      console.error("Erro inesperado ao buscar sala:", error);
      setErrorSala("Erro inesperado ao carregar a sala.");
    } finally {
      setLoadingSala(false);
    }
  };

  const fetchQuestoesFromFirebase = async (userId: string, questaoIds: string[]) => {
    setLoadingQuestoes(true);
    setErrorQuestoes(null);
    if (!userId || !questaoIds || questaoIds.length === 0) {
      setQuestoes([]);
      setLoadingQuestoes(false);
      return;
    }

    try {
      const fetchedQuestoes: Questao[] = [];
      for (const questaoId of questaoIds) {
        const questaoRef = ref(database, `questoes/${userId}/${questaoId}`);
        const snapshot = await get(questaoRef);
        if (snapshot.exists()) {
          fetchedQuestoes.push({ id: questaoId, ...snapshot.val() });
        } else {
          console.warn(`Questão com ID ${questaoId} não encontrada no Firebase para o usuário ${userId}`);
        }
      }
      setQuestoes(fetchedQuestoes);
    } catch (error: any) {
      console.error("Erro ao buscar questões do Firebase:", error);
      setErrorQuestoes("Erro ao carregar as questões.");
    } finally {
      setLoadingQuestoes(false);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion?.id && selectedAnswer) {
      setUserAnswers(prevAnswers => ({ ...prevAnswers, [currentQuestion.id]: selectedAnswer }));
    }
    setSelectedAnswer(null);
    if (currentQuestionIndex < questoes.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowModalFinal(true);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleVerResolucao = () => {
    setShowModalFinal(false);
    setShowResolucaoGeral(true);
  };

  const handleVerAnalise = () => {
    setShowModalFinal(false);
    console.log("Ver análise geral", userAnswers);
    // Aqui você implementaria a lógica para exibir a análise geral comparando userAnswers com as respostas corretas
  };

  const handleReverQuestoes = () => {
    setShowModalFinal(false);
    setIsRevising(true);
    setTimeRemaining(null);
    setIsTimeRunning(false);
  };

  const closeModalResolucao = () => {
    setShowResolucaoGeral(false);
  };

  const handleProximaRevisao = () => {
    if (currentQuestionIndex < questoes.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(userAnswers[questoes[currentQuestionIndex + 1]?.id] || null);
    }
  };

  const handleAnteriorRevisao = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      setSelectedAnswer(userAnswers[questoes[currentQuestionIndex - 1]?.id] || null);
    }
  };

  const handleFinalizarRevisao = () => {
    setIsRevising(false);
    setShowModalFinal(true);
  };

  if (loadingSala) {
    return <div className="h-screen flex items-center justify-center text-white text-xl">Carregando detalhes da sala...</div>;
  }

  if (errorSala) {
    return <div className="h-screen flex items-center justify-center text-red-500 text-xl">{errorSala}</div>;
  }

  if (loadingQuestoes) {
    return <div className="h-screen flex items-center justify-center text-white text-xl">Carregando questões...</div>;
  }

  if (errorQuestoes) {
    return <div className="h-screen flex items-center justify-center text-red-500 text-xl">{errorQuestoes}</div>;
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
      <Image
        src="/images/markim-Photoroom.png"
        alt="Logo Projeto Galileu"
        width={150}
        height={50}
        className="fixed top-4 left-4 z-20 hover:scale-105 transition-transform duration-300"
      />
      <div className="hidden md:block fixed left-0 bottom-24 z-10">
        <Image
          src="/images/galileuimagem.png"
          alt="Galileu"
          width={200}
          height={200}
          className="object-contain"
        />
        <button className="mt-2 bg-white text-purple-950 border border-purple-950 rounded-full py-2 px-4 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500">
          Pergunte ao Galileu
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 flex justify-end">
        <div className="w-full lg:w-4/5 bg-purple-950 p-8 rounded-lg shadow-lg border border-purple-300 text-white">
          <header className="flex items-center justify-end mb-8">
            <button onClick={() => router.back()} className="text-white hover:text-purple-300 transition duration-300">
              Voltar
            </button>
          </header>
          <h1 className="text-2xl">Sala: {sala?.nome}</h1>
          {questoes.length > 0 && currentQuestion ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Questão {currentQuestionIndex + 1}:</h2>
              <div key={currentQuestion.id} className="bg-purple-800 p-6 rounded-md border border-purple-400">
                <h3 className="font-semibold">{currentQuestion.enunciado}</h3>
                {currentQuestion.anexo && (
                  <div className="mt-2">
                    <Image
                      src={currentQuestion.anexo}
                      alt={`Anexo da questão ${currentQuestionIndex + 1}`}
                      width={300}
                      height={200}
                      className="object-contain rounded-md"
                    />
                  </div>
                )}
                <ul className="list-none pl-0 mt-3">
                  {Object.entries(currentQuestion.alternativas).map(([letra, texto]) => (
                    <li key={letra} className="mb-2">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-5 w-5 text-purple-600"
                          value={letra}
                          checked={selectedAnswer === letra}
                          onChange={() => handleAnswerSelect(letra)}
                          disabled={isRevising} // Impede a seleção durante a revisão
                        />
                        <span className="ml-2">{letra}: {texto}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {!isRevising && currentQuestion.tempo && (
                  <p className="text-lg text-yellow-300 font-bold mt-3">
                    Tempo restante: {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                  </p>
                )}
              </div>
              <div className="flex justify-between mt-4">
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={isRevising ? handleAnteriorRevisao : () => setCurrentQuestionIndex(prevIndex => prevIndex - 1)}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Anterior
                  </button>
                )}
                <button
                  onClick={isRevising ? handleFinalizarRevisao : goToNextQuestion}
                  className={`bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${!selectedAnswer && !isRevising ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!selectedAnswer && !isRevising}
                >
                  {isRevising
                    ? 'Finalizar Revisão'
                    : currentQuestionIndex < questoes.length - 1
                      ? 'Próxima'
                      : 'Finalizar'}
                </button>
              </div>
            </div>
          ) : (
            <p>Nenhuma questão encontrada para esta sala.</p>
          )}
        </div>
      </div>

      {showModalFinal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-900 p-8 rounded-lg shadow-lg border border-purple-300 text-white">
            <h2 className="text-xl font-bold mb-4">Fim das Questões!</h2>
            <p className="mb-4">O que você gostaria de fazer?</p>
            <div className="flex flex-col space-y-2">
              <button onClick={handleVerResolucao} className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Ver Resolução de Todas as Questões
              </button>
              <button onClick={handleVerAnalise} className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Ver Análise Geral
              </button>
              {!isRevising && (
                <button onClick={handleReverQuestoes} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Rever Questões
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showResolucaoGeral && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-800 p-8 rounded-lg shadow-lg border border-purple-400 text-white relative">
            <button onClick={closeModalResolucao} className="absolute top-2 right-2 text-gray-400 hover:text-gray-100">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M15.78 14.36a1 1 0 01-1.42 1.42L12 13.41l-2.36 2.37a1 1 0 01-1.42-1.42L10.59 12l-2.37-2.36a1 1 0 111.42-1.42L12 10.59l2.36-2.37a1 1 0 111.42 1.42L13.41 12l2.37 2.36z" clipRule="evenodd" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Resoluções das Questões</h2>
            <div className="space-y-4">
              {questoes.map((questao, index) => (
                <div key={questao.id} className="p-4 border border-purple-400 rounded-md">
                  <h3 className="text-lg font-semibold">Questão {index + 1}:</h3>
                  <p className="whitespace-pre-line">{questao.resolucao || 'Resolução não disponível.'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {isRevising && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-purple-800 p-8 rounded-lg shadow-lg border border-purple-400 text-white relative">
            <h2 className="text-xl font-bold mb-4">Revisão de Questões</h2>
            <div className="space-y-4">
              {questoes.map((questao, index) => (
                <div key={questao.id} className="p-4 border border-purple-400 rounded-md">
                  <h3 className="text-lg font-semibold">Questão {index + 1}:</h3>
                  <p className="whitespace-pre-line">{questao.enunciado}</p>
                  {questao.alternativas && (
                    <ul className="list-none pl-0 mt-3">
                      {Object.entries(questao.alternativas).map(([letra, texto]) => (
                        <li key={letra} className="mb-2">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-5 w-5 text-purple-600"
                              value={letra}
                              checked={userAnswers[questao.id] === letra}
                              disabled
                            />
                            <span className="ml-2">{letra}: {texto}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                 
                  {index === questoes.length - 1 && (
                    <button
                      onClick={handleFinalizarRevisao}
                      className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Finalizar Revisão
                    </button>
                    
                  )}

                </div>
              ))}
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
};

export default SalaDeAulaTesteSupabase;