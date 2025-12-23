"use client";

import { useState } from "react";
import CanvasGame from "@/components/CanvasGame"; //
import ScoreBoard from "@/components/ScoreBoard"; //

export default function Home() {
  const [score, setScore] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const handleScore = (newScore: number) => {
    setScore(newScore);
    if (bestScore === null || newScore > bestScore) setBestScore(newScore);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 select-none">
      {/* Luces de fondo dinámicas */}
      <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

      <ScoreBoard score={score} bestScore={bestScore} />

      <div className="z-10 w-full max-w-2xl flex flex-col items-center">
        <h1 className="text-white/[0.03] text-[12rem] font-black uppercase tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 italic">
          Perfect
        </h1>

        <CanvasGame onScore={handleScore} />

        <p className="mt-10 text-white/20 text-[10px] tracking-[0.6em] uppercase font-medium">
          Dibuja con precisión el círculo
        </p>
      </div>
    </main>
  );
}