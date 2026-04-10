import { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  useMapEvents,
  useMap,
} from 'react-leaflet';

// ── Constants ────────────────────────────────────────────────────────────────

const SEVERITY_COLOR = {
  low: '#22C55E',    // green-500
  medium: '#F97316', // orange-500
  high: '#EF4444',   // red-500
};

const SEVERITY_RADIUS = { low: 9, medium: 11, high: 13 };

const SEVERITY_LABEL = { low: 'Low', medium: 'Medium', high: 'High' };

const STATUS_LABEL = {
  reported: 'Reported',
  in_progress: 'In Progress',
  cleaned: 'Cleaned',
};

// Badge color classes for Tailwind (must be in source, not dynamic)
const SEVERITY_BADGE = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
};

const STATUS_BADGE = {
  reported: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  cleaned: 'bg-emerald-100 text-emerald-700',
};

// ── Inner map-event handler ───────────────────────────────────────────────────

/**
 * Must live inside <MapContainer>. Fires onMapClick only while in adding mode.
 */
function MapClickHandler({ isAddingMode, onMapClick }) {
  useMapEvents({
    click(e) {
      if (isAddingMode) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

/**
 * Smoothly flies to a new center whenever the component mounts or center changes.
 * Unused currently — kept as a utility for potential future feature.
 */
// function FlyTo({ center, zoom }) {
//   const map = useMap();
//   useEffect(() => { map.flyTo(center, zoom, { duration: 1.2 }); }, [center]);
//   return null;
// }

// ── Popup content component ───────────────────────────────────────────────────

/**
 * Rich popup card rendered inside each Leaflet popup.
 * Buttons update state in App.jsx directly via callbacks.
 */
function PopupContent({ report, onClaimCleanup, onMarkCleaned }) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="font-sans text-left">
      {/* Image */}
      {report.image ? (
        <img
          src={report.image}
          alt="Reported garbage spot"
          className="w-full h-36 object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          <span className="text-2xl mr-2">🗑️</span> No photo
        </div>
      )}

      {/* Body */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${SEVERITY_BADGE[report.severity]}`}>
            {SEVERITY_LABEL[report.severity]} Severity
          </span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[report.status]}`}>
            {STATUS_LABEL[report.status]}
          </span>
        </div>

        {/* Address */}
        {report.address && (
          <p className="text-sm font-semibold text-gray-800 mb-1 leading-snug">
            📍 {report.address}
          </p>
        )}

        {/* Description */}
        {report.description && (
          <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-3">
            {report.description}
          </p>
        )}

        {/* Timestamp */}
        <p className="text-[11px] text-gray-400 mb-3">
          {fmt.format(new Date(report.timestamp))}
        </p>

        {/* Action button */}
        {report.status === 'reported' && (
          <button
            onClick={() => onClaimCleanup(report.id)}
            className="w-full py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Claim for Cleanup
          </button>
        )}
        {report.status === 'in_progress' && (
          <button
            onClick={() => onMarkCleaned(report.id)}
            className="w-full py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            ✓ Mark as Cleaned
          </button>
        )}
        {report.status === 'cleaned' && (
          <div className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-emerald-600 bg-emerald-50 rounded-lg">
            <span>✓</span> This spot has been cleaned!
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main MapView component ────────────────────────────────────────────────────

/**
 * Full-height interactive Leaflet map.
 * - CartoDB Positron tiles for a clean light aesthetic
 * - Colour-coded CircleMarkers per severity
 * - Tooltip on hover, Popup on click
 * - MapClickHandler activates only while isAddingMode === true
 */
export default function MapView({
  reports,
  isAddingMode,
  onMapClick,
  onClaimCleanup,
  onMarkCleaned,
}) {
  return (
    <div className="relative h-full w-full">
      {/* Floating hint overlay while in adding mode */}
      {isAddingMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm border border-amber-200 text-amber-800 text-sm font-medium px-4 py-2 rounded-full shadow-card flex items-center gap-2">
            <span className="animate-pulse">⬤</span>
            Click anywhere on the map to place your report
          </div>
        </div>
      )}

      <MapContainer
        center={[8.0, 108.0]}
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/* CartoDB Positron — clean, minimal, light tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Map-level click handler */}
        <MapClickHandler isAddingMode={isAddingMode} onMapClick={onMapClick} />

        {/* Render a CircleMarker for each report */}
        {reports.map((report) => (
          <CircleMarker
            key={report.id}
            center={[report.lat, report.lng]}
            radius={SEVERITY_RADIUS[report.severity]}
            fillColor={SEVERITY_COLOR[report.severity]}
            color="white"
            weight={2.5}
            fillOpacity={report.status === 'cleaned' ? 0.45 : 0.9}
            eventHandlers={{
              mouseover(e) {
                e.target.setStyle({ weight: 3, fillOpacity: 1 });
              },
              mouseout(e) {
                e.target.setStyle({
                  weight: 2.5,
                  fillOpacity: report.status === 'cleaned' ? 0.45 : 0.9,
                });
              },
            }}
          >
            {/* Hover tooltip */}
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
              <div className="font-sans text-xs font-medium text-gray-700">
                {report.address || 'Unknown location'}
                <span className={`ml-1.5 ${SEVERITY_BADGE[report.severity]} text-[10px] px-1.5 py-0.5 rounded-full font-semibold`}>
                  {SEVERITY_LABEL[report.severity]}
                </span>
              </div>
            </Tooltip>

            {/* Click popup */}
            <Popup minWidth={272} maxWidth={272} closeButton>
              <PopupContent
                report={report}
                onClaimCleanup={onClaimCleanup}
                onMarkCleaned={onMarkCleaned}
              />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
