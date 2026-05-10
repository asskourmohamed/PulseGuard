import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Mock data utilisé si le backend est inaccessible
const mockLatest = { heart_rate: 78, spo2: 97, systolic: 125, diastolic: 82, temperature: 36.8 };
const mockHistory = Array.from({ length: 30 }, (_, i) => ({
  heart_rate  : 70 + Math.random() * 20,
  spo2        : 95 + Math.random() * 4,
  systolic    : 115 + Math.random() * 20,
  diastolic   : 80 + Math.random() * 10,
  temperature : 36.4 + Math.random() * 0.8,
  timestamp   : Date.now() - (30 - i) * 2000,
}));
const mockAlerts  = [];
const mockDevices = [{ device_id: 'esp32-health-01', status: 'online', last_seen: Date.now() }];

export const useVitals = () => {
  const [latest,      setLatest]      = useState(mockLatest);
  const [history,     setHistory]     = useState(mockHistory);
  const [alerts,      setAlerts]      = useState(mockAlerts);
  const [devices,     setDevices]     = useState(mockDevices);
  const [error,       setError]       = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    try {
      const [latestRes, historyRes, alertsRes, devicesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/vitals/latest`, { timeout: 5000 }),
        axios.get(`${API_BASE_URL}/vitals?limit=30`, { timeout: 5000 }),
        axios.get(`${API_BASE_URL}/alerts?limit=5`,  { timeout: 5000 }),
        axios.get(`${API_BASE_URL}/devices`,          { timeout: 5000 }),
      ]);

      // Notre backend renvoie { success: true, data: ... }
      setLatest(latestRes.data.data);
      setHistory([...historyRes.data.data].reverse()); // ordre chronologique
      setAlerts(alertsRes.data.data);
      setDevices(devicesRes.data.data);
      setError(null);
      setIsConnected(true);
    } catch (err) {
      console.error('API Error:', err.message);
      setError('Impossible de joindre le backend');
      setIsConnected(false);
      // On garde les dernières données connues (ou mock)
    }
  };

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return { latest, history, alerts, devices, error, isConnected };
};