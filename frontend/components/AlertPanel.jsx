import { AlertTriangle, CheckCircle2, Heart, Zap, Wind, Thermometer } from 'lucide-react';

const alertIconMap = {
  TACHYCARDIE: { icon: Heart, color: '#f43f5e' },
  HYPOXIE: { icon: Wind, color: '#818cf8' },
  HYPERTENSION: { icon: Zap, color: '#06b6d4' },
  HYPOTHERMIE: { icon: Thermometer, color: '#f59e0b' },
};

export const AlertPanel = ({ alerts }) => {
  const hasAlerts = alerts && alerts.length > 0 && alerts[0]?.alerts?.length > 0;

  return (
    <div className="rounded-2xl border-2 border-[#1e2235] backdrop-blur-md p-6 col-span-full" style={{ background: 'rgba(15, 17, 23, 0.6)' }}>
      <h3 className="text-sm font-medium text-gray-300 mb-4">Recent Alerts</h3>

      {hasAlerts ? (
        <div className="space-y-3">
          {alerts.map((alertGroup, idx) =>
            alertGroup.alerts.map((alert, aIdx) => {
              const alertConfig = alertIconMap[alert.type] || { icon: AlertTriangle, color: '#f43f5e' };
              const AlertIcon = alertConfig.icon;
              const timeAgo = Math.round((Date.now() - alertGroup.timestamp) / 1000);

              return (
                <div key={`${idx}-${aIdx}`} className="flex items-center gap-3 p-3 rounded-lg bg-[#13172a]/50">
                  <AlertIcon size={20} style={{ color: alertConfig.color }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">{alert.type}</p>
                    <p className="text-xs text-gray-400">
                      {alert.value} {alert.unit}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">{timeAgo}s ago</p>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 py-8">
          <CheckCircle2 size={20} className="text-green-500" />
          <p className="text-sm text-gray-400">All parameters normal</p>
        </div>
      )}
    </div>
  );
};
