const express = require('express');
const store   = require('./store');
const router  = express.Router();

// GET /api/vitals — dernières mesures
router.get('/vitals', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json({
    success: true,
    data: store.getLatestVitals(limit),
  });
});

// GET /api/vitals/latest — dernière mesure uniquement
router.get('/vitals/latest', (req, res) => {
  const latest = store.getLastVital();
  if (!latest) {
    return res.status(404).json({ success: false, message: 'Aucune donnée disponible' });
  }
  res.json({ success: true, data: latest });
});

// GET /api/alerts — alertes récentes
router.get('/alerts', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  res.json({
    success: true,
    data: store.getAlerts(limit),
  });
});

// GET /api/devices — devices connectés
router.get('/devices', (req, res) => {
  res.json({
    success: true,
    data: store.getDevices(),
  });
});

// GET /api/health — statut du serveur
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'IoT Health Platform API running',
    uptime: process.uptime(),
  });
});

module.exports = router;