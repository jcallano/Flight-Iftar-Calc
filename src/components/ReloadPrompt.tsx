/// <reference types="vite-plugin-pwa/client" />
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r: any) {
            console.log('SW Registered:', r);
        },
        onRegisterError(error: any) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    if (!offlineReady && !needRefresh) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-4 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl animate-fade-in max-w-sm">
            <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-medium text-slate-200">
                    {offlineReady
                        ? 'App is ready to work offline.'
                        : 'New version available. Click reload to update.'}
                </p>
                <button onClick={close} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            {needRefresh && (
                <button
                    onClick={() => updateServiceWorker(true)}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors mt-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Reload App
                </button>
            )}
        </div>
    );
}
