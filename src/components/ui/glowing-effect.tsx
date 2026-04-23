import { useRef, useEffect, useState } from "react";

interface GlowingEffectProps {
    spread?: number;
    glow?: boolean;
    disabled?: boolean;
    proximity?: number;
    inactiveZone?: number;
    borderWidth?: number;
    className?: string;
}

/**
 * Mouse-tracking conic gradient glow that traces card borders
 * Inspired by Aceternity UI's glowing-effect component
 */
export function GlowingEffect({
    spread = 40,
    glow = true,
    disabled = false,
    proximity = 64,
    inactiveZone = 0.01,
    borderWidth = 2,
    className = "",
}: GlowingEffectProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        if (disabled) return;
        const el = containerRef.current?.parentElement;
        if (!el) return;

        const handleMouse = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;

            // Check if within proximity
            const dist = Math.sqrt(
                Math.pow(Math.max(0, Math.abs(dx) - rect.width / 2), 2) +
                Math.pow(Math.max(0, Math.abs(dy) - rect.height / 2), 2)
            );

            if (dist < proximity) {
                setIsActive(true);
                const a = Math.atan2(dy, dx) * (180 / Math.PI) + 180;
                setAngle(a);
            } else {
                setIsActive(false);
            }
        };

        const handleLeave = () => setIsActive(false);
        document.addEventListener("mousemove", handleMouse);
        document.addEventListener("mouseleave", handleLeave);
        return () => {
            document.removeEventListener("mousemove", handleMouse);
            document.removeEventListener("mouseleave", handleLeave);
        };
    }, [disabled, proximity]);

    if (disabled) return null;

    return (
        <div
            ref={containerRef}
            className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"
                } ${className}`}
            style={{
                // @ts-ignore
                "--glow-spread": `${spread}deg`,
                "--glow-angle": `${angle}deg`,
                "--glow-border-width": `${borderWidth}px`,
                "--glow-active": isActive ? 1 : 0,
            } as React.CSSProperties}
        >
            <div
                className="absolute inset-0 rounded-[inherit]"
                style={{
                    // Conic gradient border that follows cursor
                    background: `conic-gradient(from calc(${angle}deg - ${spread}deg), transparent 0deg, hsl(var(--primary)) ${spread}deg, hsl(var(--secondary)) ${spread * 1.5}deg, transparent ${spread * 2}deg)`,
                    // Mask so only the border is visible
                    WebkitMask: `linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)`,
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: `${borderWidth}px`,
                    filter: glow ? 'blur(4px)' : undefined,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.3s',
                }}
            />
            <div
                className="absolute inset-0 rounded-[inherit]"
                style={{
                    background: `conic-gradient(from calc(${angle}deg - ${spread}deg), transparent 0deg, hsl(var(--primary)) ${spread}deg, hsl(var(--secondary)) ${spread * 1.5}deg, transparent ${spread * 2}deg)`,
                    WebkitMask: `linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)`,
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    padding: `${borderWidth}px`,
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.3s',
                }}
            />
        </div>
    );
}

export default GlowingEffect;
