// Store en mémoire — garde les 100 dernières mesures par device
const MAX_HISTORY = 100;

const store = {
  vitals: [],    // historique des mesures
  alerts: [],    // historique des alertes
  devices: {},   // statut des devices connectés
};

// Ajouter une mesure
function addVital(data) {
  store.vitals.unshift(data); // plus récent en premier
  if (store.vitals.length > MAX_HISTORY) {
    store.vitals.pop();
  }
}

// Ajouter une alerte
function addAlert(data) {
  store.alerts.unshift(data);
  if (store.alerts.length > MAX_HISTORY) {
    store.alerts.pop();
  }
}

// Mettre à jour le statut d'un device
function updateDevice(deviceId, status) {
  store.devices[deviceId] = {
    device_id: deviceId,
    status,
    last_seen: Date.now(),
  };
}

// Récupérer les dernières N mesures
function getLatestVitals(n = 20) {
  return store.vitals.slice(0, n);
}

// Récupérer la dernière mesure
function getLastVital() {
  return store.vitals[0] || null;
}

// Récupérer les alertes
function getAlerts(n = 20) {
  return store.alerts.slice(0, n);
}

// Récupérer les devices
function getDevices() {
  return Object.values(store.devices);
}

module.exports = {
  addVital,
  addAlert,
  updateDevice,
  getLatestVitals,
  getLastVital,
  getAlerts,
  getDevices,
};