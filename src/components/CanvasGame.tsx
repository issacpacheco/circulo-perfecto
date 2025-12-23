"use client";

import React, { useRef, useState, useEffect } from "react";
import { calculateCircleScore, Point } from "@/lib/gameUtils"; //

interface Particle {
    x: number; y: number; vx: number; vy: number;
    life: number; color: string;
}

interface CanvasGameProps {
    onScore: (score: number) => void;
}

export default function CanvasGame({ onScore }: CanvasGameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<Point[]>([]);
    const [drawScore, setDrawScore] = useState<number | null>(null);
    const particles = useRef<Particle[]>([]);
    const requestRef = useRef<number>(0);

    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        const animate = () => {
            updateParticles();
            render();
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [points, isDrawing]);

    const updateParticles = () => {
        particles.current = particles.current.filter(p => p.life > 0);
        particles.current.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            p.vy += 0.12; p.life -= 0.015;
        });
    };

    const render = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (points.length > 0) {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = "white";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#3b82f6";
            ctx.moveTo(points[0].x, points[0].y);
            points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();
        }

        particles.current.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        const score = calculateCircleScore(points); //
        setDrawScore(score);
        onScore(score);

        if (score > 90) {
            const canvas = canvasRef.current;
            if (canvas) {
                for (let i = 0; i < 50; i++) {
                    particles.current.push({
                        x: canvas.width / 2, y: canvas.height / 2,
                        vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15,
                        life: 1.0, color: "#2dd4bf"
                    });
                }
            }
        }
    };

    const getCoordinates = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    return (
        <div className="relative w-full h-[500px] glass-panel rounded-[48px] overflow-hidden cursor-crosshair transition-transform duration-500 hover:scale-[1.01]">
            {drawScore !== null && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 animate-in fade-in zoom-in duration-700">
                    <h2 className="text-8xl font-black text-white drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">
                        {drawScore.toFixed(1)}%
                    </h2>
                    <p className="text-blue-400 text-sm mt-6 font-bold tracking-[0.4em] uppercase opacity-80">
                        {drawScore > 90 ? "¡Excelente!" : "Buen intento"}
                    </p>
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="block w-full h-full touch-none"
                onMouseDown={(e) => { setIsDrawing(true); setPoints([getCoordinates(e)]); setDrawScore(null); }}
                onMouseMove={(e) => isDrawing && setPoints(prev => [...prev, getCoordinates(e)])}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(e) => { setIsDrawing(true); setPoints([getCoordinates(e)]); setDrawScore(null); }}
                onTouchMove={(e) => isDrawing && setPoints(prev => [...prev, getCoordinates(e)])}
                onTouchEnd={stopDrawing}
            />
        </div>
    );
}