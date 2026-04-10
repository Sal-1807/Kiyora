/**
 * Horizontal stats bar showing report counts by status.
 * Numbers update in real-time as reports are added / status changes.
 */
export default function Dashboard({ stats }) {
  const cards = [
    {
      label: 'Total Reports',
      value: stats.total,
      valueClass: 'text-gray-800',
      dot: 'bg-gray-400',
      icon: '🗂️',
    },
    {
      label: 'Reported',
      value: stats.reported,
      valueClass: 'text-gray-700',
      dot: 'bg-gray-400',
      icon: '📍',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      valueClass: 'text-blue-600',
      dot: 'bg-blue-400',
      icon: '🔧',
    },
    {
      label: 'Cleaned',
      value: stats.cleaned,
      valueClass: 'text-emerald-600',
      dot: 'bg-emerald-400',
      icon: '✅',
    },
  ];

  return (
    <div className="bg-white border-b border-gray-100" style={{ boxShadow: '0 1px 0 #e5e7eb' }}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
          {cards.map((card, i) => (
            <div key={card.label} className="flex items-center">
              {/* Stat card */}
              <div className="flex items-center gap-3 px-4 py-1.5 min-w-fit">
                <span className="text-xl leading-none" aria-hidden="true">
                  {card.icon}
                </span>
                <div>
                  <div className={`text-2xl font-bold leading-none tabular-nums ${card.valueClass}`}>
                    {card.value}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium mt-0.5 whitespace-nowrap">
                    {card.label}
                  </div>
                </div>
              </div>

              {/* Divider (not after last) */}
              {i < cards.length - 1 && (
                <div className="w-px h-8 bg-gray-100 mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
