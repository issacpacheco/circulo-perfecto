interface ScoreBoardProps {
    score: number | null;
    bestScore: number | null;
}

export default function ScoreBoard({ score, bestScore }: ScoreBoardProps) {
    return (
        <div className="absolute top-8 left-0 right-0 flex gap-12 z-30 justify-center pointer-events-none">
            <div className="flex flex-col items-center group">
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold mb-1 transition-colors group-hover:text-white/50">
                    Actual
                </span>
                <div className="text-5xl font-black text-white tabular-nums drop-shadow-lg">
                    {score !== null ? `${score.toFixed(0)}%` : "0%"}
                </div>
            </div>

            <div className="w-[1px] h-10 bg-white/10 self-end mb-2" />

            <div className="flex flex-col items-center group">
                <span className="text-[10px] uppercase tracking-[0.5em] text-teal-500/50 font-bold mb-1 transition-colors group-hover:text-teal-400">
                    Récord
                </span>
                <div className="text-5xl font-black text-teal-400 tabular-nums drop-shadow-[0_0_10px_rgba(45,212,191,0.3)]">
                    {bestScore !== null ? `${bestScore.toFixed(0)}%` : "0%"}
                </div>
            </div>
        </div>
    );
}