import { MapPin, Navigation, X, Plus } from 'lucide-react';

/**
 * Top navigation bar — contains the brand logo, tagline, and report action buttons.
 * Switches between normal and "adding mode" states.
 */
export default function Header({ isAddingMode, onAddReport, onCancelAdding, onGeolocate }) {
  return (
    <header className="bg-white border-b border-gray-100 shadow-soft sticky top-0 z-[1500]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* ── Brand ── */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
            <MapPin size={17} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">Kiyora</h1>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Smart Garbage Reporting</p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2">
          {isAddingMode ? (
            /* Adding-mode banner + cancel */
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg select-none">
                📍 Click anywhere on the map to place your report
              </span>
              <span className="sm:hidden text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg select-none">
                Tap the map
              </span>
              <button
                onClick={onCancelAdding}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Cancel adding mode"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            /* Normal: Use Location + Add Report */
            <>
              <button
                onClick={onGeolocate}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <Navigation size={14} strokeWidth={2} />
                <span className="hidden sm:inline">Use My Location</span>
              </button>

              <button
                onClick={onAddReport}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-px active:translate-y-0"
              >
                <Plus size={15} strokeWidth={2.5} />
                Add Report
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
