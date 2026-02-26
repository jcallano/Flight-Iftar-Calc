// test.js
import { parseFMSCoordinates } from './src/lib/parser.js';
import { calculateDipAngle, calculateAltitudeTimeOffset } from './src/lib/calculator.js';

console.log("--- Testing Coordinate Parser ---");

const testCases = [
    { input: "N4038.5 W07346.8", expectedLat: 40.6416, expectedLng: -73.78 },
    { input: "S3436.0 E05822.0", expectedLat: -34.6, expectedLng: 58.3666 },
    { input: "N2515.0 E05520.0", expectedLat: 25.25, expectedLng: 55.3333 }, // Dubai
    { input: "40.6416, -73.78", expectedLat: 40.6416, expectedLng: -73.78 }
];

let parserPass = true;
testCases.forEach((tc, idx) => {
    const result = parseFMSCoordinates(tc.input);
    if (!result) {
        console.error(`❌ Test ${idx} failed to parse: ${tc.input}`);
        parserPass = false;
        return;
    }

    const latDiff = Math.abs(result.lat - tc.expectedLat);
    const lngDiff = Math.abs(result.lng - tc.expectedLng);

    if (latDiff > 0.05 || lngDiff > 0.05) {
        console.error(`❌ Test ${idx} failed accuracy: ${tc.input} -> Got ${result.lat}, ${result.lng}. Expected ${tc.expectedLat}, ${tc.expectedLng}`);
        parserPass = false;
    } else {
        console.log(`✅ Test ${idx} passed: ${tc.input} -> ${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}`);
    }
});

console.log("\n--- Testing Altitude Offsets ---");
// FL350 = 35,000 ft = 10,668 meters
const fl350_meters = 10668;
const dip = calculateDipAngle(fl350_meters);
console.log(`Dip Angle at FL350: ${dip.toFixed(2)} degrees`);

// Test at equator
const offsetEquator = calculateAltitudeTimeOffset(0, dip);
console.log(`Offset at Equator (0 lat): ${offsetEquator} mins`);

// Test at Dubai (Lat 25)
const offsetDubai = calculateAltitudeTimeOffset(25, dip);
console.log(`Offset at Dubai (25 lat): ${offsetDubai} mins`);

// Test at high Lat (Lat 60, e.g. Oslo)
const offsetOslo = calculateAltitudeTimeOffset(60, dip);
console.log(`Offset at Oslo (60 lat): ${offsetOslo} mins`);

if (offsetEquator > 0 && offsetDubai > offsetEquator && offsetOslo > offsetDubai) {
    console.log("✅ Altitude test passed: Higher latitudes correctly have longer offsets due to horizon geometry.");
} else {
    console.log("❌ Altitude test failed: Unexpected offset curves.");
}

console.log("\nTests finished.");
