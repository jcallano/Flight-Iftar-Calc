import { useState, useEffect } from 'react';
import { Plane, Moon, Sun, MapPin, Info, Download, Navigation } from 'lucide-react';
import { parseFMSCoordinates } from './lib/parser';
import { calculateTimes, calculateFlightTimes } from './lib/calculator';
import type { IslamicMethod, IftarCalculationResult, FlightCalculationResult } from './lib/calculator';
import { OMAN_AIR_AIRPORTS } from './lib/airports';
import { getDeviceType } from './lib/device';

function App() {
  const [mode, setMode] = useState<'single' | 'flight'>('flight');
  const [device] = useState(getDeviceType());

  // Single Point State
  const [fmsInput, setFmsInput] = useState<string>('');
  const [selectedAirport, setSelectedAirport] = useState<string>('MCT');
  const [manualCoords, setManualCoords] = useState<boolean>(false);

  // Flight Mode State
  const [originIata, setOriginIata] = useState<string>('MCT');
  const [destIata, setDestIata] = useState<string>('DXB');

  const now = new Date();
  const later = new Date(now.getTime() + 4 * 60 * 60 * 1000);

  const toLocalISO = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [departureTime, setDepartureTime] = useState<string>(toLocalISO(now));
  const [arrivalTime, setArrivalTime] = useState<string>(toLocalISO(later));

  const [flightLevel, setFlightLevel] = useState<number>(350);
  const [method, setMethod] = useState<IslamicMethod>('Dubai');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [result, setResult] = useState<IftarCalculationResult | null>(null);
  const [flightResult, setFlightResult] = useState<FlightCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };

  useEffect(() => {
    if (mode === 'single') {
      let lat: number, lng: number;

      if (manualCoords) {
        if (!fmsInput.trim()) {
          setResult(null);
          setError(null);
          return;
        }
        const coords = parseFMSCoordinates(fmsInput);
        if (!coords) {
          setError('Invalid FMS format. e.g. "N4038.5 W07346.8"');
          setResult(null);
          return;
        }
        lat = coords.lat;
        lng = coords.lng;
      } else {
        const airport = OMAN_AIR_AIRPORTS.find(a => a.iata === selectedAirport);
        if (!airport) return;
        lat = airport.lat;
        lng = airport.lng;
      }

      setError(null);
      try {
        const calcDate = new Date(`${selectedDate}T12:00:00Z`);
        const calcResult = calculateTimes(lat, lng, calcDate, flightLevel, method);
        setResult(calcResult);
        setFlightResult(null);
      } catch (err) {
        setError('Error calculating times.');
        setResult(null);
      }
    } else {
      // Flight Mode
      const origin = OMAN_AIR_AIRPORTS.find(a => a.iata === originIata);
      const dest = OMAN_AIR_AIRPORTS.find(a => a.iata === destIata);

      if (!origin || !dest) return;

      try {
        const depDate = new Date(departureTime);
        const arrDate = new Date(arrivalTime);

        if (arrDate <= depDate) {
          setError('Arrival must be after departure');
          setFlightResult(null);
          return;
        }

        const calcResult = calculateFlightTimes({
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: dest.lat, lng: dest.lng },
          departureTime: depDate,
          arrivalTime: arrDate,
          flightLevel,
          method
        });

        setFlightResult(calcResult);
        setResult(null);
        setError(null);
      } catch (err) {
        setError('Check date/time format');
      }
    }
  }, [mode, fmsInput, selectedAirport, manualCoords, originIata, destIata, departureTime, arrivalTime, flightLevel, method, selectedDate]);

  const formatUTC = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toISOString().substring(11, 16) + ' Z';
  };

  return (
    <div className={`min-h-screen w-full bg-[#0f172a] text-slate-100 flex flex-col items-center p-4 sm:p-8 font-sans relative overflow-hidden device-${device}`}>

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 bg-amber-600 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20 bg-indigo-600 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-fade-in flex flex-col gap-6">

        <header className="relative text-center mb-2">
          {deferredPrompt && (
            <button onClick={handleInstallClick} className="absolute right-0 top-0 flex items-center gap-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-xs font-semibold rounded-full shadow-lg">
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          )}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30">
              <Plane className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Flight Iftar Calc</h1>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Oman Air Edition</p>
        </header>

        {/* Mode Toggle */}
        <div className="bg-slate-800/50 p-1 rounded-xl flex gap-1 border border-slate-700">
          <button
            onClick={() => setMode('flight')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${mode === 'flight' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Navigation className="w-4 h-4" />
            Flight Path
          </button>
          <button
            onClick={() => setMode('single')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${mode === 'single' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <MapPin className="w-4 h-4" />
            Single Point
          </button>
        </div>

        {/* Dynamic Form */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4">

          {mode === 'flight' ? (
            <>
              {/* Origin / Dest */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Origin</label>
                  <select
                    value={originIata}
                    onChange={e => setOriginIata(e.target.value)}
                    className="input-field w-full rounded-xl px-3 py-2.5 text-sm bg-slate-900/50 border-slate-700 outline-none"
                  >
                    {OMAN_AIR_AIRPORTS.map(a => <option key={a.iata} value={a.iata}>{a.iata} - {a.city}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Destination</label>
                  <select
                    value={destIata}
                    onChange={e => setDestIata(e.target.value)}
                    className="input-field w-full rounded-xl px-3 py-2.5 text-sm bg-slate-900/50 border-slate-700 outline-none"
                  >
                    {OMAN_AIR_AIRPORTS.map(a => <option key={a.iata} value={a.iata}>{a.iata} - {a.city}</option>)}
                  </select>
                </div>
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Departure (Local)</label>
                  <input
                    type="datetime-local"
                    value={departureTime}
                    onChange={e => setDepartureTime(e.target.value)}
                    className="input-field w-full rounded-xl px-3 py-2 text-xs bg-slate-900/50 border-slate-700 text-slate-200"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Arrival (Local)</label>
                  <input
                    type="datetime-local"
                    value={arrivalTime}
                    onChange={e => setArrivalTime(e.target.value)}
                    className="input-field w-full rounded-xl px-3 py-2 text-xs bg-slate-900/50 border-slate-700 text-slate-200"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Location Select or Manual */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Location</label>
                  <button
                    onClick={() => setManualCoords(!manualCoords)}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {manualCoords ? 'USE AIRPORT LIST' : 'ENTER COORDINATES'}
                  </button>
                </div>

                {manualCoords ? (
                  <input
                    type="text"
                    value={fmsInput}
                    onChange={e => setFmsInput(e.target.value)}
                    placeholder="N4038.5 W07346.8"
                    className="input-field w-full rounded-xl px-4 py-3 text-base placeholder-slate-600"
                  />
                ) : (
                  <select
                    value={selectedAirport}
                    onChange={e => setSelectedAirport(e.target.value)}
                    className="input-field w-full rounded-xl px-4 py-3 text-base"
                  >
                    {OMAN_AIR_AIRPORTS.slice().sort((a, b) => a.city.localeCompare(b.city)).map(a => (
                      <option key={a.iata} value={a.iata}>{a.city} ({a.iata})</option>
                    ))}
                  </select>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Calculation Date</label>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="input-field w-full rounded-xl px-4 py-3 text-base" />
                </div>
              </div>
            </>
          )}

          {/* Shared Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Flight Level</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">FL</span>
                <input type="number" value={flightLevel} onChange={e => setFlightLevel(Number(e.target.value))} className="input-field w-full rounded-xl pl-8 pr-3 py-3 text-base" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Method</label>
              <select value={method} onChange={e => setMethod(e.target.value as IslamicMethod)} className="input-field w-full rounded-xl px-3 py-3 text-sm">
                <option value="Dubai">Dubai (18.2°)</option>
                <option value="MWL">MWL (18°)</option>
                <option value="UmmAlQura">Umm Al-Qura</option>
              </select>
            </div>
          </div>
          {error && <p className="text-red-400 text-[10px] font-bold text-center mt-1 uppercase tracking-tight">{error}</p>}
        </div>

        {/* Results */}
        {(result || flightResult) && (
          <div className="flex flex-col gap-4 animate-scale-in">
            {/* Suhoor */}
            <div className="glass-panel border-l-4 border-l-indigo-500 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 mb-1">
                  <Moon className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-extrabold tracking-widest">Suhoor Ends</span>
                </div>
                <div className="text-3xl font-bold font-mono text-white tracking-tighter">
                  {mode === 'flight' ? formatUTC(flightResult?.fajr || null) : formatUTC(result?.fajr || null)}
                </div>
              </div>
              {mode === 'flight' && flightResult?.fajr && (
                <div className="text-right">
                  <div className="text-[8px] text-slate-500 font-bold mb-1">LATITUDE</div>
                  <div className="text-[10px] font-mono font-bold text-indigo-400">{flightResult.fajrCoords?.lat.toFixed(1)}°</div>
                </div>
              )}
              {mode === 'single' && result && (
                <div className="text-right">
                  <div className="text-[8px] text-slate-500 font-bold mb-1">ALT OFFSET</div>
                  <div className="text-xs font-bold text-indigo-500">-{result.offsetMins}m</div>
                </div>
              )}
            </div>

            {/* Iftar */}
            <div className="glass-panel border-l-4 border-l-amber-500 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <Sun className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-extrabold tracking-widest">Iftar Begins</span>
                </div>
                <div className="text-3xl font-bold font-mono text-white tracking-tighter">
                  {mode === 'flight' ? formatUTC(flightResult?.maghrib || null) : formatUTC(result?.maghrib || null)}
                </div>
              </div>
              {mode === 'flight' && flightResult?.maghrib && (
                <div className="text-right">
                  <div className="text-[8px] text-slate-500 font-bold mb-1">LATITUDE</div>
                  <div className="text-[10px] font-mono font-bold text-amber-500">{flightResult.maghribCoords?.lat.toFixed(1)}°</div>
                </div>
              )}
              {mode === 'single' && result && (
                <div className="text-right">
                  <div className="text-[8px] text-slate-500 font-bold mb-1">ALT OFFSET</div>
                  <div className="text-xs font-bold text-amber-500">+{result.offsetMins}m</div>
                </div>
              )}
            </div>

            {mode === 'flight' && (!flightResult?.fajr && !flightResult?.maghrib) && (
              <div className="text-center p-4 glass-panel rounded-xl text-slate-500 text-xs italic font-medium">
                Iftar or Suhoor does not occur during this flight.
              </div>
            )}
          </div>
        )}

        <footer className="text-center pb-8">
          <div className="flex items-center justify-center gap-1.5 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            <Info className="w-3 h-3" />
            Horizon Dip correction applied
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
