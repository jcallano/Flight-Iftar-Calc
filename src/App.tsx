import { useState, useEffect } from 'react';
import { Plane, Moon, Sun, MapPin, GaugeCircle, History, Info, Calendar, Download } from 'lucide-react';
import { parseFMSCoordinates } from './lib/parser';
import { calculateTimes } from './lib/calculator';
import type { IslamicMethod, IftarCalculationResult } from './lib/calculator';

function App() {
  const [fmsInput, setFmsInput] = useState<string>('');
  const [flightLevel, setFlightLevel] = useState<number>(350);
  const [method, setMethod] = useState<IslamicMethod>('Dubai');

  // Default to today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const [result, setResult] = useState<IftarCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  // Auto-calculate when inputs change (if valid)
  useEffect(() => {
    if (!fmsInput.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    const coords = parseFMSCoordinates(fmsInput);
    if (!coords) {
      setError('Invalid FMS Coordinate format. Use e.g. "N4038.5 W07346.8" or "40.6, -73.7"');
      setResult(null);
      return;
    }

    setError(null);
    try {
      // Create a date object from the selected string at 12:00 PM UTC to avoid timezone shift issues on the day
      const calcDate = new Date(`${selectedDate}T12:00:00Z`);
      const calcResult = calculateTimes(coords.lat, coords.lng, calcDate, flightLevel, method);
      setResult(calcResult);
    } catch (err) {
      console.error(err);
      setError('Error calculating times. Please check your inputs.');
      setResult(null);
    }
  }, [fmsInput, flightLevel, method, selectedDate]);

  const formatUTC = (date: Date) => {
    return date.toISOString().substring(11, 16) + ' Z';
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-100 flex flex-col items-center p-4 sm:p-8 font-sans relative overflow-hidden">

      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20 bg-amber-600 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20 bg-indigo-600 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-fade-in flex flex-col gap-6">

        {/* Header */}
        <header className="relative text-center mb-2">
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="absolute right-0 top-0 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white text-xs font-semibold rounded-full shadow-lg shadow-indigo-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Install App
            </button>
          )}

          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30">
              <Plane className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">Flight Iftar Calc</h1>
          <p className="text-slate-400 text-sm">Offline Fasting Times for Aviation</p>
        </header>

        {/* Input Form Card */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col gap-5">

          {/* Coordinates */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              FMS Position
            </label>
            <input
              type="text"
              value={fmsInput}
              onChange={e => setFmsInput(e.target.value)}
              placeholder="e.g. N4038.5 W07346.8"
              className="input-field w-full rounded-xl px-4 py-3 text-base placeholder-slate-500"
              autoComplete="off"
            />
            {error && <p className="text-red-400 text-xs mt-1 animate-fade-in">{error}</p>}
          </div>

          <div className="flex gap-4">
            {/* Date */}
            <div className="flex flex-col gap-2 flex-[0.7]">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="input-field w-full rounded-xl px-4 py-3 text-base"
                required
              />
            </div>

            {/* Flight Level */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <GaugeCircle className="w-4 h-4 text-emerald-400" />
                Flight Level
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">FL</span>
                <input
                  type="number"
                  value={flightLevel}
                  onChange={e => setFlightLevel(Number(e.target.value))}
                  min="0"
                  max="500"
                  step="10"
                  className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-base"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Method */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                Calculation Method
              </label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as IslamicMethod)}
                className="input-field w-full rounded-xl px-4 py-3 text-base appearance-none cursor-pointer"
              >
                <option value="Dubai">Dubai/Gulf (Standard 18.2°)</option>
                <option value="MWL">Muslim World League (Standard 18°)</option>
                <option value="UmmAlQura">Umm Al-Qura (Fixed +90m Isha)</option>
                <option value="Egypt">Egyptian (General Authority 19.5°)</option>
                <option value="ISNA">ISNA (North America 15°)</option>
              </select>
              <p className="text-[10px] text-slate-500 leading-tight">These methods dictate the sun angle used for Dawn (Fajr). Standard Gulf aviation uses Dubai or MWL.</p>
            </div>
          </div>
        </div>

        {/* Results Card */}
        {result && (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Suhoor (Fajr) Card */}
            <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-indigo-500 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-300 mb-1">
                  <Moon className="w-5 h-5" />
                  <span className="font-semibold tracking-wide">SUHOOR ENDS</span>
                </div>
                <div className="text-3xl font-bold font-mono text-white">
                  {formatUTC(result.fajr)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 mb-1">Altitude Offset</div>
                <div className="text-sm font-medium text-indigo-400">-{result.offsetMins} min</div>
              </div>
            </div>

            {/* Iftar (Maghrib) Card */}
            <div className="glass-panel rounded-2xl p-5 border-l-4 border-l-amber-500 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <Sun className="w-5 h-5" />
                  <span className="font-semibold tracking-wide">IFTAR TIME</span>
                </div>
                <div className="text-3xl font-bold font-mono text-white">
                  {formatUTC(result.maghrib)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 mb-1">Altitude Offset</div>
                <div className="text-sm font-medium text-amber-500">+{result.offsetMins} min</div>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-2 text-slate-400 text-xs p-4 glass-panel rounded-xl">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-400" />
              <div>
                <p className="mb-2"><strong>Why do times change with altitude?</strong></p>
                <p>As you climb, the horizon drops (horizon dip). This means you can see "over" the curvature of the earth.</p>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li><strong>Iftar (Sunset) is delayed:</strong> The sun takes longer to dip below this lowered horizon.</li>
                  <li><strong>Suhoor (Dawn) is advanced:</strong> The first light becomes visible earlier over the lowered horizon.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
