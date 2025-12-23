"use client";

import React, { useRef, useState, useEffect } from "react";
import { calculateCircleScore, Point } from "@/lib/gameUtils";

interface CanvasGameProps {
    onScore: (score: number) => void;
}

export default function CanvasGame({ onScore }: CanvasGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<Point[]>([]);
    const [drawScore, setDrawScore] = useState<number | null>(null);

    // Reset function
    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setPoints([]);
        setDrawScore(null);
    };

    useEffect(() => {
        // Resize canvas on mount/resize
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                // Set actual canvas size to match display size for retina sharpness
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        setTimeout(handleResize, 100); // Safety check
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent default to stop scrolling on some touch devices if touch-action fails
        // e.preventDefault(); 
        setIsDrawing(true);
        resetCanvas();
        const { x, y } = getCoordinates(e);
        setPoints([{ x, y }]);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        // e.preventDefault(); // Don't prevent default everywhere to allow UI interaction outside

        const { x, y } = getCoordinates(e);
        setPoints((prev) => [...prev, { x, y }]);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx && canvas) {
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = "rgba(255, 255, 255, 1)"; // Teal-400
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(255, 255, 255, 0.5)";

            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        // Calculate Score
        const score = calculateCircleScore(points);
        setDrawScore(score);
        onScore(score);
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if ("touches" in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    // Translation helpers
    const getMessage = (score: number) => {
        if (score > 95) return "¡Perfecto!";
        if (score > 90) return "¡Increíble!";
        if (score > 80) return "¡Muy bien!";
        if (score > 50) return "Ni tan mal";
        return "Inténtalo de nuevo";
    }

    const getColor = (score: number) => {
        if (score > 90) return "from-teal-200 to-teal-500";
        if (score > 80) return "from-green-200 to-green-500";
        if (score > 50) return "from-yellow-200 to-yellow-500";
        return "from-red-200 to-red-500";
    }

    return (
        <div className="relative w-full h-[60vh] md:h-[500px] bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden cursor-crosshair transition-all duration-300 hover:shadow-teal-900/20 hover:border-white/20">
            {/* Hint/Overlay */}
            {points.length === 0 && !drawScore && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 animate-pulse">
                    <div className="w-16 h-16 border-4 border-dashed border-slate-600 rounded-full mb-4 opacity-50"></div>
                    <span className="text-lg">Dibuja un círculo perfecto</span>
                </div>
            )}

            {drawScore !== null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                    <h2 className={`text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${getColor(drawScore)} drop-shadow-2xl`}>
                        {drawScore.toFixed(1)}%
                    </h2>
                    <p className="text-white text-xl mt-4 font-light tracking-wide">
                        {getMessage(drawScore)}
                    </p>
                </div>
            )}

            <canvas
                ref={canvasRef}
                className="block w-full h-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
        </div>
    );
}
