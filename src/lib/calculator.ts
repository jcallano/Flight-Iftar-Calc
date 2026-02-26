import { Coordinates, CalculationMethod, PrayerTimes, CalculationParameters } from 'adhan';

/**
 * Calculates horizon dip angle in degrees based on altitude in meters.
 * Formula: Dip = 0.0347 * sqrt(Altitude) 
 */
export function calculateDipAngle(altitudeMeters: number): number {
    if (altitudeMeters <= 0) return 0;
    return 0.0347 * Math.sqrt(altitudeMeters);
}

/**
 * Calculates the time difference in minutes for sunset/sunrise due to dip angle.
 * Uses simplified solar declination delta for average year. 
 * For higher accuracy, we use the rule of thumb that 1 degree of dip ~ 4-6 mins depending on latitude.
 * For aviation, 1 degree usually translates strictly via solar hour angle.
 * 
 * However, a very common and robust aviation/marine approximation:
 * Time Diff (mins) = DipAngle / (15 * cos(Latitude) * cos(Declination))
 * We can simplify by just using the Adhan library's built-in high elevation adjustment if needed,
 * but adhan doesn't natively take altitude for the standard objects without custom parameters.
 * 
 * Actually, `adhan` allows setting custom `adjustments` in minutes, so we calculate the minute offset.
 * A standard approximation for time difference (in minutes) is:
 * ΔT = Dip / (15 * cos(Lat) * cos(Decl)) 
 * We'll use an average Declination of 0 (Equinox) to keep it safe, or calculate it.
 * But taking an even simpler robust astronomical rule: 
 * ΔT ≈ Dip / (15 * Math.cos(latitude * Math.PI / 180))
 */
export function calculateAltitudeTimeOffset(latitude: number, dipAngleDeg: number): number {
    if (dipAngleDeg === 0) return 0;

    // Convert latitude to radians
    const latRad = latitude * (Math.PI / 180);

    // Calculate offset in hours, then convert to minutes
    // At extreme latitudes (near poles), cos(lat) gets very small, making offset huge.
    // We'll cap the latitude in the math to 65 degrees to avoid Infinity errors in standard flights
    const safeLatRad = Math.min(Math.abs(latRad), 65 * Math.PI / 180);

    const offsetHours = dipAngleDeg / (15 * Math.cos(safeLatRad));
    const offsetMins = offsetHours * 60;

    return Math.round(offsetMins);
}

export type IslamicMethod = 'Dubai' | 'MWL' | 'ISNA' | 'UmmAlQura' | 'Egypt';

export function getBaseParameters(method: IslamicMethod): CalculationParameters {
    switch (method) {
        case 'Dubai':
            return CalculationMethod.Dubai();
        case 'MWL':
            return CalculationMethod.MuslimWorldLeague();
        case 'ISNA':
            return CalculationMethod.NorthAmerica();
        case 'UmmAlQura':
            return CalculationMethod.UmmAlQura();
        case 'Egypt':
            return CalculationMethod.Egyptian();
        default:
            return CalculationMethod.Dubai();
    }
}

export interface IftarCalculationResult {
    fajr: Date;       // Suhoor ends
    maghrib: Date;    // Iftar begins
    baseFajr: Date;   // Without altitude
    baseMaghrib: Date;// Without altitude
    offsetMins: number; // The calculated adjustment
}

/**
 * Calculate Iftar and Suhoor times given parameters.
 */
export function calculateTimes(
    lat: number,
    lng: number,
    date: Date,
    flightLevel: number,
    methodName: IslamicMethod
): IftarCalculationResult {
    const coordinates = new Coordinates(lat, lng);
    const params = getBaseParameters(methodName);

    // Calculate base times at sea level
    const basePrayerTimes = new PrayerTimes(coordinates, date, params);

    // Calculate altitude adjustments
    // 1 Flight Level (FL) = 100 feet = 30.48 meters
    const altitudeMeters = flightLevel * 30.48;
    const dipAngle = calculateDipAngle(altitudeMeters);

    // Minutes to adjust. Sunset is delayed (+), Sunrise/Fajr is advanced (-)
    const offsetMins = calculateAltitudeTimeOffset(lat, dipAngle);

    // Apply offsets
    const fajr = new Date(basePrayerTimes.fajr.getTime() - offsetMins * 60000);
    const maghrib = new Date(basePrayerTimes.maghrib.getTime() + offsetMins * 60000);

    return {
        fajr,
        maghrib,
        baseFajr: basePrayerTimes.fajr,
        baseMaghrib: basePrayerTimes.maghrib,
        offsetMins
    };
}
