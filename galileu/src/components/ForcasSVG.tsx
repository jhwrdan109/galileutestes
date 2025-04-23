import React, { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  aceleracao?: number;
  anguloInicial?: number;
};

const ForcasSVG: React.FC<Props> = ({ aceleracao = 6.9, anguloInicial = 30 }) => {
  const centerX = 150;
  const centerY = 150;
  const ESCALA = 500; // aumentada para visualização com valores pequenos

  const [angulo, setAngulo] = useState(anguloInicial);
  const [mostrarPeso, setMostrarPeso] = useState(true);
  const [mostrarNormal, setMostrarNormal] = useState(true);
  const [mostrarAtrito, setMostrarAtrito] = useState(true);
  const [mostrarResultante, setMostrarResultante] = useState(true);
  const [mostrarTodasForcas, setMostrarTodasForcas] = useState(true);

  const massa = 0.01735; // kg
  const g = 9.8;
  const coefAtrito = 0.294; // para que Atrito = 0.05N aproximadamente

  const rad = (angulo * Math.PI) / 180;

  const forcaPeso = massa * g; // ≈ 0.17 N
  const componentePesoX = massa * g * Math.sin(rad);
  const componentePesoY = massa * g * Math.cos(rad);

  const forcaNormal = componentePesoY; // ≈ 0.17 N
  const forcaAtrito = coefAtrito * forcaNormal; // ≈ 0.05 N

  const direcaoAtrito = aceleracao > 0 ? -1 : 1;

  const resultanteX = massa * aceleracao;
  const resultanteY = 0;

  const vetorPesoX = 0;
  const vetorPesoY = ESCALA * forcaPeso;

  const vetorNormalX = -ESCALA * forcaNormal * Math.sin(rad);
  const vetorNormalY = -ESCALA * forcaNormal * Math.cos(rad);

  const vetorAtritoX = ESCALA * forcaAtrito * Math.cos(rad) * direcaoAtrito;
  const vetorAtritoY = ESCALA * forcaAtrito * Math.sin(rad) * direcaoAtrito;

  const vetorResultanteX = ESCALA * resultanteX * Math.cos(rad);
  const vetorResultanteY = ESCALA * resultanteX * Math.sin(rad);

  const desenharVetor = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    cor: string,
    texto: string,
    deslocaTextoX: number,
    deslocaTextoY: number,
    largura: number = 3
  ) => (
    <>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={cor}
        strokeWidth={largura}
        markerEnd="url(#arrow)"
        initial={{ x1, y1, x2, y2 }}
        animate={{ x2, y2 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <text
        x={x2 + deslocaTextoX}
        y={y2 + deslocaTextoY}
        fill={cor}
        fontSize="12"
        fontWeight="bold"
      >
        {texto}
      </text>
    </>
  );

  const alternarTodasForcas = () => {
    const novoEstado = !mostrarTodasForcas;
    setMostrarTodasForcas(novoEstado);
    setMostrarPeso(novoEstado);
    setMostrarNormal(novoEstado);
    setMostrarAtrito(novoEstado);
    setMostrarResultante(novoEstado);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <svg width="300" height="300" viewBox="0 0 300 300">
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,8 L8,4 z" fill="black" />
          </marker>
        </defs>

        <polygon points="50,250 250,250 250,150" fill="#d3d3d3" />
        <rect
          x={centerX - 15}
          y={centerY - 15}
          width="30"
          height="30"
          fill="#8884d8"
          transform={`rotate(${-angulo}, ${centerX}, ${centerY})`}
        />

        {mostrarPeso &&
          desenharVetor(
            centerX,
            centerY,
            centerX + vetorPesoX,
            centerY + vetorPesoY,
            "red",
            `Peso (${forcaPeso.toFixed(2)} N)`,
            10,
            15
          )}

        {mostrarNormal &&
          desenharVetor(
            centerX,
            centerY,
            centerX + vetorNormalX,
            centerY + vetorNormalY,
            "green",
            `Normal (${forcaNormal.toFixed(2)} N)`,
            -40,
            0
          )}

        {mostrarAtrito &&
          desenharVetor(
            centerX,
            centerY,
            centerX + vetorAtritoX,
            centerY + vetorAtritoY,
            "orange",
            `Atrito (${forcaAtrito.toFixed(2)} N)`,
            -40,
            10
          )}

        {mostrarResultante &&
          desenharVetor(
            centerX,
            centerY,
            centerX + vetorResultanteX,
            centerY + vetorResultanteY,
            "blue",
            `Resultante (${(massa * aceleracao).toFixed(2)} N)`,
            10,
            0
          )}
      </svg>

      <div className="mt-4 w-[200px] px-4">
        <label htmlFor="anguloSlider" className="text-black font-semibold">
          Ângulo: {angulo}°
        </label>
        <input
          type="range"
          id="anguloSlider"
          min="0"
          max="90"
          step="1"
          value={angulo}
          onChange={(e) => setAngulo(parseInt(e.target.value))}
          className="w-full mt-2"
        />
      </div>

      <div className="mt-6 space-x-4 flex flex-wrap justify-center">
        <button
          onClick={() => setMostrarPeso(!mostrarPeso)}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          {mostrarPeso ? "Esconder Peso" : "Mostrar Peso"}
        </button>
        <button
          onClick={() => setMostrarNormal(!mostrarNormal)}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          {mostrarNormal ? "Esconder Normal" : "Mostrar Normal"}
        </button>
        <button
          onClick={() => setMostrarAtrito(!mostrarAtrito)}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          {mostrarAtrito ? "Esconder Atrito" : "Mostrar Atrito"}
        </button>
        <button
          onClick={() => setMostrarResultante(!mostrarResultante)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {mostrarResultante ? "Esconder Resultante" : "Mostrar Resultante"}
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={alternarTodasForcas}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          {mostrarTodasForcas ? "Esconder Todas as Forças" : "Mostrar Todas as Forças"}
        </button>
      </div>

      <div className="mt-6 space-y-2 text-black p-4 bg-gray-100 rounded-lg">
        <div>
          <span className="font-semibold text-red-500">Peso:</span> Força que atua
          para baixo, devido à gravidade: <code>Fₚ = m * g</code>.
        </div>
        <div>
          <span className="font-semibold text-green-500">Normal:</span> Perpendicular ao plano:
          <code> Fₙ = m * g * cos(θ)</code>.
        </div>
       
        <div>
          <span className="font-semibold text-blue-500">Resultante:</span> A força que move o bloco:
          <code> Fᵣ = m * a</code>.
        </div>
      </div>
    </div>
  );
};

export default ForcasSVG;
