/**
 * Filter bar — lets users narrow visible map markers by severity or status.
 * Stateless; controlled by parent (App.jsx).
 */

const SEVERITY_OPTIONS = [
  { value: 'all',    label: 'All',    active: 'bg-gray-700 text-white',      idle: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { value: 'low',    label: 'Low',    active: 'bg-green-600 text-white',     idle: 'bg-green-50 text-green-700 hover:bg-green-100' },
  { value: 'medium', label: 'Medium', active: 'bg-orange-500 text-white',    idle: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
  { value: 'high',   label: 'High',   active: 'bg-red-500 text-white',       idle: 'bg-red-50 text-red-700 hover:bg-red-100' },
];

const STATUS_OPTIONS = [
  { value: 'all',         label: 'All' },
  { value: 'reported',    label: 'Reported' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'cleaned',     label: 'Cleaned' },
];

function PillButton({ active, activeClass, idleClass, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
        active ? activeClass : idleClass
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div
      className="bg-[#F7F7F5] border-b border-gray-200/70 px-4 sm:px-6 py-2.5 flex items-center gap-4 flex-wrap"
      style={{ boxShadow: 'inset 0 -1px 0 #e5e7eb' }}
    >
      {/* Severity filter */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest select-none">
          Severity
        </span>
        <div className="flex gap-1.5">
          {SEVERITY_OPTIONS.map((opt) => (
            <PillButton
              key={opt.value}
              active={filters.severity === opt.value}
              activeClass={opt.active}
              idleClass={opt.idle}
              onClick={() => onFilterChange({ ...filters, severity: opt.value })}
            >
              {opt.label}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Vertical divider */}
      <div className="w-px h-5 bg-gray-200 shrink-0" />

      {/* Status filter */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest select-none">
          Status
        </span>
        <div className="flex gap-1.5">
          {STATUS_OPTIONS.map((opt) => (
            <PillButton
              key={opt.value}
              active={filters.status === opt.value}
              activeClass="bg-gray-700 text-white"
              idleClass="bg-gray-100 text-gray-600 hover:bg-gray-200"
              onClick={() => onFilterChange({ ...filters, status: opt.value })}
            >
              {opt.label}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="ml-auto hidden md:flex items-center gap-3 text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          Low
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
          Medium
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          High
        </span>
      </div>
    </div>
  );
}
