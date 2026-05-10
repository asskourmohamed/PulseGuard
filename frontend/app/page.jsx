'use client';

import { Heart, Wind, Zap, Thermometer } from 'lucide-react';
import { useVitals } from '@/hooks/useVitals';
import { MetricCard } from '@/components/MetricCard';
import { VitalChart } from '@/components/VitalChart';
import { AlertPanel } from '@/components/AlertPanel';
import { DeviceStatus } from '@/components/DeviceStatus';

const getStatus = (value, thresholds) => {
  if (value >= thresholds.critical) return 'critical';
  if (value >= thresholds.warning) return 'warning';
  return 'normal';
};

const getHeartRateStatus = (value) => getStatus(value, { warning: 100, critical: 120 });
const getSpO2Status = (value) => {
  if (value <= 90) return 'critical';
  if (value <= 94) return 'warning';
  return 'normal';
};
const getSystolicStatus = (value) => getStatus(value, { warning: 140, critical: 160 });
const getDiastolicStatus = (value) => getStatus(value, { warning: 90, critical: 100 });
const getTempStatus = (value) => getStatus(value, { warning: 37.5, critical: 38.5 });

export default function Dashboard() {
  const { latest, history, alerts, devices, error, isConnected } = useVitals();

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Navbar */}
      <nav className="border-b border-[#1e2235] bg-[#13172a]/50 backdrop-blur-md">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart size={28} className="text-red-500" />
            <h1 className="text-2xl font-bold text-white">PulseGuard</h1>
          </div>
          <DeviceStatus devices={devices} />
        </div>
      </nav>

      {/* Error Banner */}
      {error && !isConnected && (
        <div className="bg-red-500/10 border-b border-red-500/30 px-6 py-3">
          <p className="text-sm text-red-400">
            ⚠️ {error} - Using mock data
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <MetricCard
              icon={Heart}
              name="Heart Rate"
              value={latest.heart_rate}
              unit="bpm"
              normalRange="60-100"
              status={getHeartRateStatus(latest.heart_rate)}
            />
            <MetricCard
              icon={Wind}
              name="SpO2"
              value={latest.spo2}
              unit="%"
              normalRange="95-100"
              status={getSpO2Status(latest.spo2)}
            />
            <MetricCard
              icon={Zap}
              name="Systolic BP"
              value={latest.systolic}
              unit="mmHg"
              normalRange={"< 120"}
              status={getSystolicStatus(latest.systolic)}
            />
            <MetricCard
              icon={Zap}
              name="Diastolic BP"
              value={latest.diastolic}
              unit="mmHg"
              normalRange={"< 80"}
              status={getDiastolicStatus(latest.diastolic)}
            />
            <MetricCard
              icon={Thermometer}
              name="Temperature"
              value={latest.temperature}
              unit="°C"
              normalRange="36.5-37.5"
              status={getTempStatus(latest.temperature)}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <VitalChart
              data={history}
              dataKey="heart_rate"
              color="#f43f5e"
              unit="bpm"
              title="Heart Rate Trend"
              domain={[50, 150]}
            />
            <VitalChart
              data={history}
              dataKey="spo2"
              color="#818cf8"
              unit="%"
              title="SpO2 Trend"
              domain={[85, 100]}
            />
            <VitalChart
              data={history}
              dataKey="systolic"
              color="#06b6d4"
              unit="mmHg"
              title="Blood Pressure (Systolic)"
              domain={[80, 160]}
            />
            <VitalChart
              data={history}
              dataKey="temperature"
              color="#f59e0b"
              unit="°C"
              title="Temperature Trend"
              domain={[35, 39]}
            />
          </div>

          {/* Alerts */}
          <AlertPanel alerts={alerts} />
        </div>
      </main>
    </div>
  );
}
