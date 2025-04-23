"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TesteRechartRandom: React.FC = () => {
  const [aceleracaoData, setAceleracaoData] = useState<
    { tempo: number; valor: number }[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAceleracaoData((prev) => [
        ...prev.slice(-19), // manter 20 pontos
        {
          tempo: prev.length > 0 ? prev[prev.length - 1].tempo + 1 : 0,
          valor: parseFloat((Math.random() * 10).toFixed(2)), // aceleração aleatória entre 0 e 10
        },
      ]);
    }, 1000); // adiciona novo ponto a cada 1 segundo

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-700">
          Gráfico de Aceleração (Aleatório)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={aceleracaoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="tempo"
              label={{
                value: "Tempo (s)",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Aceleração (m/s²)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TesteRechartRandom;
