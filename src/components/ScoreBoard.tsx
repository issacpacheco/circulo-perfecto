import React from "react";

interface ScoreBoardProps {
    currentScore: number | null;
    bestScore: number;
    onReset: () => void;
}

export default function ScoreBoard({ currentScore, bestScore, onReset }: ScoreBoardProps) {
    return (
        <div className="flex flex-col items-center mt-8 text-white z-10 gap-6">
            <div className="flex gap-12 justify-center items-center">
                <div className="flex flex-col items-center">
                    <span className="text-slate-300 text-sm uppercase tracking-wider font-semibold mb-1">Actual</span>
                    <span className="text-6xl font-mono font-bold text-glow transition-all duration-300">
                        {currentScore !== null ? `${currentScore.toFixed(1)}%` : "--"}
                    </span>
                </div>

                <div className="w-px h-16 bg-white/20"></div>

                <div className="flex flex-col items-center relative group">
                    <span className="text-teal-200 text-sm uppercase tracking-wider font-semibold mb-1">Mejor (Sesión)</span>
                    <span className="text-6xl font-mono font-bold text-teal-300 drop-shadow-lg transition-all duration-300">
                        {bestScore > 0 ? `${bestScore.toFixed(1)}%` : "--"}
                    </span>
                </div>
            </div>

            <button
                onClick={onReset}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors backdrop-blur-sm border border-white/5"
                title="Reiniciar récord de sesión"
            >
                Reiniciar Récord
            </button>
        </div>
    );
}
