"use client";

import { useState, useEffect } from "react";
import CanvasGame from "@/components/CanvasGame";
import ScoreBoard from "@/components/ScoreBoard";

export default function Home() {
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number>(0);

  useEffect(() => {
    // Load from sessionStorage if available
    const savedBest = sessionStorage.getItem("circle-game-best");
    if (savedBest) {
      setBestScore(parseFloat(savedBest));
    }
  }, []);

  const handleScore = (score: number) => {
    setCurrentScore(score);
    if (score > bestScore) {
      setBestScore(score);
      sessionStorage.setItem("circle-game-best", score.toString());
    }
  };

  const handleReset = () => {
    setBestScore(0);
    setCurrentScore(null); // Optional: also clear current score
    sessionStorage.removeItem("circle-game-best");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-900/95">
      {/* Background Ambience - Brighter */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-teal-500/10 blur-[100px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[100px] h-[100px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="z-10 w-full max-w-2xl flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <header className="text-center mb-2">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-2 drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-200">
            Círculo Perfecto
          </h1>
          <p className="text-slate-300 text-lg font-light tracking-wide">Dibuja la forma perfecta</p>
        </header>

        <CanvasGame onScore={handleScore} />

        <ScoreBoard currentScore={currentScore} bestScore={bestScore} onReset={handleReset} />

        <footer className="mt-12 text-slate-600 text-sm hover:text-slate-400 transition-colors">
          Juego de Código Abierto
        </footer>
      </div>
    </main>
  );
}
