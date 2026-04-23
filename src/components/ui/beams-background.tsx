"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface BeamsBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
    x: number;
    y: number;
    width: number;
    length: number;
    angle: number;
    speed: number;
    opacity: number;
    hue: number;
    pulse: number;
    pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
    const angle = -35 + Math.random() * 10;
    return {
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height * 1.5 - height * 0.25,
        width: 60 + Math.random() * 70,
        length: height * 2.5,
        angle,
        speed: 0.5 + Math.random() * 0.8,
        opacity: 0.06 + Math.random() * 0.08,
        hue: 190 + Math.random() * 70,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
    };
}

export function BeamsBackground({ className, children, intensity = "strong" }: BeamsBackgroundProps) {
    const opacityMap = { subtle: 0.6, medium: 0.8, strong: 1 };

    useEffect(() => {
        // Remove existing canvas if hot-reloaded
        document.getElementById("beams-bg-canvas")?.remove();

        const canvas = document.createElement("canvas");
        canvas.id = "beams-bg-canvas";
        Object.assign(canvas.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            zIndex: "0",
            pointerEvents: "none",
        });
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let beams: Beam[] = [];
        let animId: number;
        let paused = false;
        // Target 30 fps to halve CPU/GPU load vs native 60fps
        const TARGET_FPS = 30;
        const FRAME_INTERVAL = 1000 / TARGET_FPS;
        let lastFrameTime = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap DPR at 2
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);
            beams = Array.from({ length: 20 }, () =>  // reduced from 30 to 20 beams
                createBeam(window.innerWidth, window.innerHeight)
            );
        };

        resize();

        // Debounced resize — avoid thrashing on every pixel during resize drag
        let resizeTimer: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 200);
        };
        window.addEventListener("resize", onResize);

        // Pause when tab is hidden to save CPU
        const onVisibilityChange = () => {
            paused = document.hidden;
            if (!paused) animId = requestAnimationFrame(animate);
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        function resetBeam(beam: Beam, index: number) {
            const column = index % 3;
            const spacing = window.innerWidth / 3;
            beam.y = window.innerHeight + 100;
            beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
            beam.width = 60 + Math.random() * 70;
            beam.speed = 0.5 + Math.random() * 0.8;
            beam.hue = 190 + (index * 70) / 20;
            beam.opacity = 0.06 + Math.random() * 0.08;
        }

        function drawBeam(beam: Beam) {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);
            const p = beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity];

            const g = ctx.createLinearGradient(0, 0, 0, beam.length);
            g.addColorStop(0, `hsla(${beam.hue}, 90%, 65%, 0)`);
            g.addColorStop(0.1, `hsla(${beam.hue}, 90%, 65%, ${p * 0.5})`);
            g.addColorStop(0.4, `hsla(${beam.hue}, 90%, 65%, ${p})`);
            g.addColorStop(0.6, `hsla(${beam.hue}, 90%, 65%, ${p})`);
            g.addColorStop(0.9, `hsla(${beam.hue}, 90%, 65%, ${p * 0.5})`);
            g.addColorStop(1, `hsla(${beam.hue}, 90%, 65%, 0)`);

            ctx.fillStyle = g;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        function animate(now: number = 0) {
            if (paused) return;

            // Throttle to TARGET_FPS
            if (now - lastFrameTime < FRAME_INTERVAL) {
                animId = requestAnimationFrame(animate);
                return;
            }
            lastFrameTime = now;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.filter = "blur(25px)";
            beams.forEach((beam, i) => {
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;
                if (beam.y + beam.length < -100) resetBeam(beam, i);
                drawBeam(beam);
            });

            animId = requestAnimationFrame(animate);
        }

        animId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", onResize);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            clearTimeout(resizeTimer);
            cancelAnimationFrame(animId);
            canvas.remove();
        };
    }, [intensity]);

    return (
        <div className={cn("relative w-full animate-bg-glow", className)}>
            {children}
        </div>
    );
}
