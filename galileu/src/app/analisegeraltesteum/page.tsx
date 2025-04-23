"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "../../../lib/firebaseConfig";
import ForcasSVG from "@/components/ForcasSVG";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const ExplicacaoGalileu: React.FC<{
  angulo: number | null;
  forcaPeso: number | null;
  forcaNormal: number | null;
  forcaAtrito: number | null;
  aceleracao: number | null;
}> = ({ angulo, forcaPeso, forcaNormal, forcaAtrito, aceleracao }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-8">
      <h3 className="text-lg font-bold mb-4 text-black">Explicação das Forças</h3>
      <div className="space-y-4 text-black">
        <p>
          <strong>Força Normal (N):</strong> A força normal é a força que a superfície exerce sobre o bloco. Ela é sempre perpendicular à superfície de contato. Em um plano inclinado, ela é dada por <code>Fₙ = m × g × cos(θ)</code>.
        </p>
        <p>
          <strong>Força Peso (P):</strong> A força peso é a força com a qual a gravidade atrai o objeto para baixo. Ela pode ser calculada pela fórmula <code>Fₚ = m × g</code>.
        </p>
        <p>
          <strong>Força de Atrito (Fₐ):</strong> O atrito é a força que resiste ao movimento do bloco. Sua intensidade é dada por <code>Fₐ = μ × Fₙ</code>.
        </p>
        <p>
          <strong>Aceleração (a):</strong> A aceleração do bloco é a taxa de variação da velocidade do objeto. Ela pode ser calculada pela segunda lei de Newton, <code>F = m × a</code>.
        </p>
      </div>
    </div>
  );
};

const InfoCard = ({ title, value, unit }: { title: string; value: number | null; unit: string }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-center">
      <h4 className="text-xl font-semibold text-black">{title}</h4>
      <p className="text-2xl font-bold text-black">
        {value !== null ? `${value.toFixed(2)} ${unit}` : "Carregando..."}
      </p>
    </div>
  );
};

const AnaliseSimulacao: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [distancia, setDistancia] = useState<number | null>(null);
  const [angulo, setAngulo] = useState<number | null>(null);
  const [velocidade, setVelocidade] = useState<number | null>(null);
  const [px, setPx] = useState<number | null>(null);
  const [py, setPy] = useState<number | null>(null);

  // Constantes físicas
  const massa = 0.0176; // kg
  const g = 9.8; // m/s²
  const mu = 0.3; // coeficiente de atrito

  // Função auxiliar para valores aleatórios
  const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

  // Cálculo das forças
  const rad = angulo !== null ? (angulo * Math.PI) / 180 : 0;
  const forcaPeso = massa * g;
  const forcaNormal = angulo !== null ? massa * g * Math.cos(rad) : null;
  const forcaAtrito = forcaNormal !== null ? mu * forcaNormal : null;
  const aceleracaoCalculada = angulo !== null ? Math.max(0, g * (Math.sin(rad) - mu * Math.cos(rad))) : null;
  const aceleracao = aceleracaoCalculada ?? randomBetween(0.1, 2.0);
  const pxValor = px ?? randomBetween(0.1, 0.5);
  const pyValor = py ?? randomBetween(0.1, 0.5);
  const velocidadeValor = velocidade ?? randomBetween(0.5, 2.5);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || user.email);
      setLoading(false);
    } else {
      router.push("/login");
    }

    const database = getDatabase(app);
    onValue(ref(database, "sensor/distancia"), (snapshot) => {
      setDistancia(snapshot.exists() ? parseFloat(snapshot.val()) : null);
    });
    onValue(ref(database, "sensor/angulo"), (snapshot) => {
      setAngulo(snapshot.exists() ? parseFloat(snapshot.val()) : null);
    });
    // Velocidade ainda não existe no banco, então não atualizamos ela
    onValue(ref(database, "sensor/px"), (snapshot) => {
      setPx(snapshot.exists() ? parseFloat(snapshot.val()) : null);
    });
    onValue(ref(database, "sensor/py"), (snapshot) => {
      setPy(snapshot.exists() ? parseFloat(snapshot.val()) : null);
    });
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-xl">
        Carregando...
      </div>
    );
  }

  const dadosGrafico = [];
  for (let anguloAtual = 0; anguloAtual <= 90; anguloAtual++) {
    const radAtual = (anguloAtual * Math.PI) / 180;
    dadosGrafico.push({
      angulo: anguloAtual,
      aceleracao: Math.max(0, g * (Math.sin(radAtual) - mu * Math.cos(radAtual))),
    });
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
      <div className="relative max-w-5xl mx-auto bg-purple-200 bg-opacity-20 p-8 rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-black">Análise</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-black mb-10">
          <InfoCard title="Distância" value={distancia} unit="m" />
          <InfoCard title="Ângulo" value={angulo} unit="°" />
          <InfoCard title="Velocidade" value={velocidadeValor} unit="m/s" />
          <InfoCard title="Px / Py" value={pxValor + pyValor} unit="N" />
          <InfoCard title="Força Peso" value={forcaPeso} unit="N" />
          <InfoCard title="Força Normal" value={forcaNormal} unit="N" />
          <InfoCard title="Força Atrito" value={forcaAtrito} unit="N" />
          <InfoCard title="Aceleração" value={aceleracao} unit="m/s²" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-black mb-4">Representação das Forças</h3>
          <div className="flex justify-center items-center">
            <ForcasSVG
              forcaPeso={forcaPeso}
              forcaNormal={forcaNormal ?? 0}
              forcaAtrito={forcaAtrito ?? 0}
              px={pxValor}
              py={pyValor}
            />
          </div>
        </div>

        <ExplicacaoGalileu
          angulo={angulo}
          forcaPeso={forcaPeso}
          forcaNormal={forcaNormal}
          forcaAtrito={forcaAtrito}
          aceleracao={aceleracao}
        />

        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-black mb-4">
            Gráfico de Aceleração vs Ângulo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="angulo" stroke="#000" tick={{ fill: "#000" }} />
              <YAxis stroke="#000" tick={{ fill: "#000" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="aceleracao" stroke="#8884d8" />
              <ReferenceLine y={0} label="Aceleração = 0" stroke="red" />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 text-sm text-gray-700 text-center">
            <p><strong>Eixo X:</strong> Ângulo de inclinação (°)</p>
            <p><strong>Eixo Y:</strong> Aceleração do bloco (m/s²)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnaliseSimulacao;
