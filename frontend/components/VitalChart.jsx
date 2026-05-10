import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const VitalChart = ({ data, dataKey, color, unit, title, domain }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-[#0f1117] border border-[#1e2235] p-3">
          <p className="text-xs text-gray-300">
            {payload[0].value.toFixed(1)} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border-2 border-[#1e2235] backdrop-blur-md p-6" style={{ background: 'rgba(15, 17, 23, 0.6)' }}>
      <h3 className="text-sm font-medium text-gray-300 mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2235" vertical={false} />
          <XAxis dataKey="timestamp" tick={false} height={0} />
          <YAxis domain={domain} tick={{ fontSize: 12, fill: '#9ca3af' }} width={40} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
