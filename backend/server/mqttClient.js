const mqtt   = require('mqtt');
const store  = require('./store');

function startMqttSubscriber(brokerUrl, clientId) {
  const client = mqtt.connect(brokerUrl, {
    clientId,
    clean: true,
    reconnectPeriod: 3000,
  });

  client.on('connect', () => {
    console.log(`[MQTT] ✅ Connecté au broker → ${brokerUrl}`);

    // Souscrire à tous les topics health
    client.subscribe('health/#', { qos: 1 }, (err) => {
      if (err) console.error('[MQTT] ❌ Erreur souscription :', err);
      else console.log('[MQTT] 📡 Souscrit à health/#');
    });
  });

  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      console.log(`[MQTT]  ${topic}`, payload);

      if (topic.endsWith('/vitals')) {
        store.addVital(payload);
      } else if (topic.endsWith('/alerts')) {
        store.addAlert(payload);
      } else if (topic.endsWith('/status')) {
        store.updateDevice(payload.device_id, payload.status);
      }
    } catch (e) {
      console.error('[MQTT] ❌ Erreur parsing message :', e.message);
    }
  });

  client.on('error',     (err) => console.error('[MQTT] ❌ Erreur :', err.message));
  client.on('reconnect', ()    => console.log('[MQTT] 🔄 Reconnexion...'));

  return client;
}

module.exports = { startMqttSubscriber };