export const MetricCard = ({ icon: Icon, name, value, unit, normalRange, status }) => {
  const statusStyles = {
    normal: 'border-blue-500 bg-blue-500/10',
    warning: 'border-amber-500 bg-amber-500/10',
    critical: 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20',
  };

  const statusColor = {
    normal: '#3b82f6',
    warning: '#f59e0b',
    critical: '#f43f5e',
  };

  return (
    <div
      className={`rounded-2xl border-2 backdrop-blur-md p-6 transition-all duration-300 ${statusStyles[status]}`}
      style={{
        background: `rgba(15, 17, 23, 0.6)`,
        borderColor: statusColor[status],
      }}
    >
      {/* Icon and Name */}
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon size={24} style={{ color: statusColor[status] }} />}
        <h3 className="text-sm font-medium text-gray-300">{name}</h3>
      </div>

      {/* Value */}
      <div className="mb-3">
        <div className="text-4xl font-bold text-white">
          {typeof value === 'number' ? value.toFixed(0) : value}
        </div>
        <div className="text-xs text-gray-400 mt-1">{unit}</div>
      </div>

      {/* Normal Range */}
      <div className="text-xs text-gray-500">
        Normal: {normalRange}
      </div>
    </div>
  );
};
