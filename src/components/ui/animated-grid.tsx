import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const AnimatedGrid = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
    return (
        <div className={cn("relative min-h-screen w-full bg-background overflow-hidden", className)}>
            <div className="absolute inset-0 z-0 h-full w-full [mask-image:linear-gradient(to_bottom,transparent,black)]">
                <div className="absolute inset-0 h-[200vh] w-full [background-image:linear-gradient(to_right,#1989ad33_1px,transparent_1px),linear-gradient(to_bottom,#1989ad33_1px,transparent_1px)] [background-size:4rem_4rem] [perspective:1000px] [transform-style:preserve-3d]">
                    <div className="absolute inset-0 bg-background/50 [transform:rotateX(60deg)_translateZ(-200px)_translateY(-100px)] animate-grid-flow" />
                    <div className="absolute inset-0 h-[200vh] w-[200vw] -translate-x-1/4 -translate-y-[20%] [background-image:linear-gradient(to_right,hsl(var(--primary)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.15)_1px,transparent_1px)] [background-size:60px_60px] [transform:rotateX(60deg)_translateZ(-100px)] animate-grid-flow" />
                </div>
            </div>

            {/* Radial vignette for focus */}
            <div className="absolute inset-0 z-0 bg-background/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};
