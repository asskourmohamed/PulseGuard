require('dotenv').config();

const express              = require('express');
const cors                 = require('cors');
const routes               = require('./routes');
const { startMqttSubscriber } = require('./mqttClient');

const app        = express();
const PORT       = process.env.PORT       || 3001;
const BROKER_URL = process.env.MQTT_BROKER     || 'mqtt://127.0.0.1:1883';
const CLIENT_ID  = process.env.MQTT_CLIENT_ID  || 'iot-backend-server';

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Démarrer le subscriber MQTT
startMqttSubscriber(BROKER_URL, CLIENT_ID);

// Démarrer le serveur HTTP
app.listen(PORT, () => {
  console.log(`[SERVER] 🚀 API disponible sur http://localhost:${PORT}/api`);
});