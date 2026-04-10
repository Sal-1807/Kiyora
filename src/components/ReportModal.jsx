import { useState, useRef, useCallback } from 'react';
import { X, Upload, MapPin } from 'lucide-react';

// Severity options with colours
const SEVERITY_OPTIONS = [
  { value: 'low',    label: 'Low',    ring: 'ring-green-500',   bg: 'bg-green-500',   hover: 'hover:bg-green-50 hover:border-green-400' },
  { value: 'medium', label: 'Medium', ring: 'ring-orange-500',  bg: 'bg-orange-500',  hover: 'hover:bg-orange-50 hover:border-orange-400' },
  { value: 'high',   label: 'High',   ring: 'ring-red-500',     bg: 'bg-red-500',     hover: 'hover:bg-red-50 hover:border-red-400' },
];

/**
 * Modal dialog for submitting a new garbage report.
 * Location is pre-filled (from map click or geolocation) — read-only.
 * Image is converted to a base64 data URL via FileReader for local preview/storage.
 */
export default function ReportModal({ location, onSubmit, onClose }) {
  const [severity, setSeverity] = useState('medium');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Read selected file into a base64 data URL
  const loadImage = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e) => loadImage(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    loadImage(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      lat: location.lat,
      lng: location.lng,
      severity,
      description: description.trim(),
      image: imagePreview,
      // Address shows coordinates since there's no reverse-geocoding in this demo
      address: `${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}°`,
    });
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-lift w-full max-w-md overflow-hidden animate-in">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <MapPin size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Report a Garbage Spot</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5 overflow-y-auto max-h-[80vh]">

          {/* Location (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Location
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              <MapPin size={14} className="text-emerald-500 shrink-0" />
              <span className="text-sm text-gray-600 font-mono tracking-tight">
                {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </span>
              <span className="ml-auto text-[11px] text-gray-400 font-medium bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                Auto
              </span>
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {SEVERITY_OPTIONS.map((opt) => {
                const selected = severity === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSeverity(opt.value)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      selected
                        ? `${opt.bg} border-transparent text-white shadow-sm`
                        : `bg-white border-gray-200 text-gray-600 ${opt.hover}`
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Photo <span className="text-gray-400 font-normal">(optional)</span>
            </label>

            {imagePreview ? (
              /* Preview */
              <div className="relative rounded-xl overflow-hidden border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-lg p-1.5 text-gray-600 hover:text-gray-800 transition-colors"
                  aria-label="Remove photo"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              /* Drop zone */
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Upload size={22} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 font-medium">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG, WEBP up to 10 MB</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the situation — type of waste, smell, size, hazard…"
              rows={3}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 resize-none transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-px active:translate-y-0"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
