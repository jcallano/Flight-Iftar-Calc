import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import * as L from 'leaflet';

// Import Leaflet CSS is handled centrally in index.css

export interface MapProps {
    origin: { lat: number, lng: number };
    destination: { lat: number, lng: number };
    eventPoint?: { lat: number, lng: number } | null;
    label?: string;
    color?: string;
}

// Helper to fit bounding box to our markers accurately
function FitBounds({ origin, destination, eventPoint }: MapProps) {
    const map = useMap();

    useEffect(() => {
        const bounds = L.latLngBounds([origin.lat, origin.lng], [destination.lat, destination.lng]);
        if (eventPoint) {
            bounds.extend([eventPoint.lat, eventPoint.lng]);
        }

        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
    }, [map, origin, destination, eventPoint]);

    return null;
}

export const Map = ({ origin, destination, eventPoint, label, color = '#f59e0b' }: MapProps) => {

    const posOrigin: [number, number] = [origin.lat, origin.lng];
    const posDest: [number, number] = [destination.lat, destination.lng];
    const posEvent: [number, number] | null = eventPoint ? [eventPoint.lat, eventPoint.lng] : null;

    const pathPositions = [posOrigin, posDest];

    return (
        <div className="w-full rounded-xl border border-slate-700/60 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] mt-2 relative shrink-0" style={{ height: '300px' }}>
            <MapContainer
                center={posOrigin}
                zoom={4}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
                style={{ height: '100%', width: '100%', background: '#090f19' }} // Dark ocean fallback
            >
                {/* 
                    CartoDB Positron Dark theme for maps 
                    Provides a flawless aesthetic matching our dark App
                 */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <FitBounds origin={origin} destination={destination} eventPoint={eventPoint} />

                {/* Flight Path */}
                <Polyline positions={pathPositions} pathOptions={{ color: '#4f46e5', weight: 2, dashArray: '5, 5', opacity: 0.6 }} />

                {/* Origin / Dest Markers */}
                <CircleMarker center={posOrigin} radius={5} pathOptions={{ fillColor: '#6366f1', color: '#0f172a', weight: 1, fillOpacity: 1 }} />
                <CircleMarker center={posDest} radius={5} pathOptions={{ fillColor: '#6366f1', color: '#0f172a', weight: 1, fillOpacity: 1 }} />

                {/* Event Marker (Iftar / Suhoor) */}
                {posEvent && (
                    <>
                        <CircleMarker center={posEvent} radius={12} pathOptions={{ fillColor: color, stroke: false, fillOpacity: 0.2 }} className="animate-pulse" />
                        <CircleMarker center={posEvent} radius={5} pathOptions={{ fillColor: color, color: '#ffffff', weight: 1.5, fillOpacity: 1 }} />
                    </>
                )}
            </MapContainer>

            {/* Floating Label */}
            {label && (
                <div className="absolute top-2 right-2 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded backdrop-blur-sm z-[1000] shadow-lg flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-400 justify-end uppercase tracking-widest leading-none mb-1">{label}</span>
                    {eventPoint && (
                        <span className="text-xs font-mono font-bold text-slate-200 leading-none" style={{ color: color }}>
                            {Math.abs(eventPoint.lat).toFixed(1)}°{eventPoint.lat >= 0 ? 'N' : 'S'} {Math.abs(eventPoint.lng).toFixed(1)}°{eventPoint.lng >= 0 ? 'E' : 'W'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default Map;
