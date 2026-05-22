const mqtt = require('mqtt');

// ─── Configuration ───────────────────────────────────────────────
const BROKER_URL = 'mqtt://127.0.0.1:1883';
const DEVICE_ID    = 'esp32-health-01';
const PUBLISH_INTERVAL_MS = 2000; // toutes les 2 secondes

const TOPICS = {
  vitals : `health/${DEVICE_ID}/vitals`,
  alerts : `health/${DEVICE_ID}/alerts`,
  status : `health/${DEVICE_ID}/status`,
};

// ─── Connexion au broker ─────────────────────────────────────────
const client = mqtt.connect(BROKER_URL, {
  clientId: DEVICE_ID,
  clean: true,
  reconnectPeriod: 3000,
});

// ─── Helpers : génération de données réalistes ───────────────────

/**
 * Marche aléatoire bornée :
 * la valeur évolue doucement autour d'une moyenne (simulation réaliste)
 */
function randomWalk(current, min, max, step) {
  const delta = (Math.random() - 0.5) * 2 * step;
  return Math.min(max, Math.max(min, parseFloat((current + delta).toFixed(1))));
}

// État interne du "patient simulé"
const state = {
  heartRate : 72,   // bpm        — plage normale : 60–100
  spo2      : 98,   // %%         — plage normale : 95–100
  systolic  : 120,  // mmHg       — plage normale : 100–140
  diastolic : 80,   // mmHgg     — plage normale : 60–90
  temp      : 36.6, // °C         — plage normale : 36.1–37.5
};

function updateVitals() {
  state.heartRate = randomWalk(state.heartRate, 45,  160, 3);
  state.spo2      = randomWalk(state.spo2,      85,  100, 0.5);
  state.systolic  = randomWalk(state.systolic,  90,  180, 2);
  state.diastolic = randomWalk(state.diastolic, 55,  110, 1.5);
  state.temp      = randomWalk(state.temp,      35.0, 39.5, 0.1);
}

function detectAlerts() {
  const alerts = [];
  if (state.heartRate > 120) alerts.push({ type: 'TACHYCARDIE',   value: state.heartRate, unit: 'bpm' });
  if (state.heartRate < 50)  alerts.push({ type: 'BRADYCARDIE',   value: state.heartRate, unit: 'bpm' });
  if (state.spo2 < 92)       alerts.push({ type: 'HYPOXIE',       value: state.spo2,      unit: '%'   });
  if (state.systolic > 160)  alerts.push({ type: 'HYPERTENSION',  value: state.systolic,  unit: 'mmHg'});
  if (state.temp > 38.0)     alerts.push({ type: 'FIEVRE',        value: state.temp,      unit: '°C'  });
  return alerts;
}

// ─── Publication périodique ───────────────────────────────────────
function publishData() {
  updateVitals();

  // 1) Vitals
  const vitalsPayload = {
    device_id  : DEVICE_ID,
    timestamp  : Date.now(),
    heart_rate : state.heartRate,
    spo2       : state.spo2,
    systolic   : state.systolic,
    diastolic  : state.diastolic,
    temperature: state.temp,
  };
  client.publish(TOPICS.vitals, JSON.stringify(vitalsPayload), { qos: 1 });
  console.log(`[EDGE][${new Date().toLocaleTimeString()}] Vitals publié →`, vitalsPayload);

  // 2) Alertes (seulement si anomalie)
  const alerts = detectAlerts();
  if (alerts.length > 0) {
    const alertPayload = {
      device_id : DEVICE_ID,
      timestamp : Date.now(),
      alerts,
    };
    client.publish(TOPICS.alerts, JSON.stringify(alertPayload), { qos: 1 });
    console.warn(`[EDGE][ALERTE] ⚠️  ${alerts.map(a => a.type).join(', ')}`);
  }
}

// ─── Événements MQTT ─────────────────────────────────────────────
client.on('connect', () => {
  console.log(`[EDGE] ✅ ESP32 simulé connecté au broker → ${BROKER_URL}`);

  // Publier un message de statut "online"
  client.publish(TOPICS.status, JSON.stringify({
    device_id: DEVICE_ID,
    status   : 'online',
    timestamp: Date.now(),
  }), { qos: 1, retain: true });

  // Démarrer la publication périodique
  setInterval(publishData, PUBLISH_INTERVAL_MS);
});

client.on('error', (err) => {
  console.error('[EDGE] ❌ Erreur MQTT :', err.message);
});

client.on('reconnect', () => {
  console.log('[EDGE] 🔄 Reconnexion en cours...');
});

client.on('offline', () => {
  console.log('[EDGE] 📴 Simulateur hors ligne');
});