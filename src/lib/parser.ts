/**
 * Parses an FMS coordinate string into decimal degrees for latitude and longitude.
 * Expected format: [N/S]ddmm.m [E/W]dddmm.m
 * Example: "N4038.5 W07346.8" (JFK)
 * 
 * Or standard decimal degrees if already in that format.
 */

export interface Coordinates {
    lat: number;
    lng: number;
}

export function parseFMSCoordinates(input: string): Coordinates | null {
    const cleanStr = input.trim().toUpperCase().replace(/\s+/g, ' ');

    // Try parsing FMS format (e.g., N4038.5 W07346.8)
    const fmsRegex = /^([NS])(\d{2})(\d{2}\.?\d*)\s+([EW])(\d{3})(\d{2}\.?\d*)$/;
    const match = cleanStr.match(fmsRegex);

    if (match) {
        const latHemi = match[1];
        const latDeg = parseInt(match[2], 10);
        const latMin = parseFloat(match[3]);

        const lngHemi = match[4];
        const lngDeg = parseInt(match[5], 10);
        const lngMin = parseFloat(match[6]);

        let lat = latDeg + (latMin / 60);
        if (latHemi === 'S') lat = -lat;

        let lng = lngDeg + (lngMin / 60);
        if (lngHemi === 'W') lng = -lng;

        return { lat, lng };
    }

    // Fallback: try parsing generic decimal like "40.6416 -73.78" or "40.6416, -73.78"
    const decRegex = /^(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)$/;
    const decMatch = cleanStr.match(decRegex);

    if (decMatch) {
        const lat = parseFloat(decMatch[1]);
        const lng = parseFloat(decMatch[2]);
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            return { lat, lng };
        }
    }

    return null;
}
