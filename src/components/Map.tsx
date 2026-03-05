
import React from 'react';
import { WORLD_PATH, WORLD_MAP_WIDTH, WORLD_MAP_HEIGHT } from '../lib/worldData';

interface MapProps {
    origin: { lat: number, lng: number };
    destination: { lat: number, lng: number };
    eventPoint?: { lat: number, lng: number } | null;
    label?: string;
    color?: string;
}

const Map: React.FC<MapProps> = ({ origin, destination, eventPoint, label, color = '#f59e0b' }) => {
    // Equirectangular projection (Plate Carrée)
    // Maps -180..180 to 0..800 and 90..-90 to 0..400
    const project = (lat: number, lng: number) => {
        const x = (lng + 180) * (WORLD_MAP_WIDTH / 360);
        const y = (90 - lat) * (WORLD_MAP_HEIGHT / 180);
        return { x, y };
    };

    const pOrigin = project(origin.lat, origin.lng);
    const pDest = project(destination.lat, destination.lng);
    const pEvent = eventPoint ? project(eventPoint.lat, eventPoint.lng) : null;

    // Zoom into the relevant area for better visibility
    // We calculate a bounding box with some padding
    const minX = Math.min(pOrigin.x, pDest.x, pEvent?.x ?? pOrigin.x) - 50;
    const maxX = Math.max(pOrigin.x, pDest.x, pEvent?.x ?? pDest.x) + 50;
    const minY = Math.min(pOrigin.y, pDest.y, pEvent?.y ?? pOrigin.y) - 50;
    const maxY = Math.max(pOrigin.y, pDest.y, pEvent?.y ?? pDest.y) + 50;

    const width = maxX - minX;
    const height = maxY - minY;

    // Aspect ratio check and centering
    const viewBox = `${minX} ${minY} ${width} ${height}`;

    return (
        <div className="w-full bg-slate-950/40 rounded-xl border border-slate-800 p-2 overflow-hidden shadow-inner mt-2">
            <svg viewBox={viewBox} className="w-full h-auto">
                {/* World Landmass / Borders */}
                <path
                    d={WORLD_PATH}
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="0.5"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Flight Path Line */}
                <line
                    x1={pOrigin.x} y1={pOrigin.y}
                    x2={pDest.x} y2={pDest.y}
                    stroke="#4f46e5"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                    opacity="0.6"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Origin & Destination Nodes */}
                <circle cx={pOrigin.x} cy={pOrigin.y} r="2.5" fill="#6366f1" stroke="#0f172a" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                <circle cx={pDest.x} cy={pDest.y} r="2.5" fill="#6366f1" stroke="#0f172a" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

                {/* Estimated Event Position (Iftar/Suhoor) */}
                {pEvent && (
                    <g>
                        <circle
                            cx={pEvent.x} cy={pEvent.y} r="6"
                            fill={color} className="animate-ping opacity-30"
                            vectorEffect="non-scaling-stroke"
                        />
                        <circle
                            cx={pEvent.x} cy={pEvent.y} r="4"
                            fill={color} stroke="#fff" strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                        />
                    </g>
                )}
            </svg>
            {label && (
                <div className="mt-2 flex justify-between items-center px-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
                    {eventPoint && (
                        <span className="text-[9px] font-mono font-bold text-slate-400">
                            {Math.abs(eventPoint.lat).toFixed(1)}°{eventPoint.lat >= 0 ? 'N' : 'S'} {Math.abs(eventPoint.lng).toFixed(1)}°{eventPoint.lng >= 0 ? 'E' : 'W'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default Map;
