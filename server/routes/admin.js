const express = require('express');
const router = express.Router();
const db = require('../db');

// Clientes
router.get('/clients', (req, res) => {
  res.json({ success: true, data: db.getClients() });
});

router.post('/clients', (req, res) => {
  try {
    const saved = db.saveClient(req.body, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Configuración general
router.get('/settings', (req, res) => {
  res.json({ success: true, data: db.getSettings() });
});

router.put('/settings', (req, res) => {
  try {
    const { owner_pin, updates } = req.body;
    const current = db.getPrivateSettings();
    // Validar PIN de propietario si se modifican llaves de IA o configuración crítica
    if (owner_pin && owner_pin !== current.owner_pin) {
      return res.status(403).json({ success: false, error: 'PIN de propietario inválido' });
    }
    const updated = db.updateSettings(updates || req.body, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Auditoría
router.get('/audit-logs', (req, res) => {
  res.json({ success: true, data: db.getAuditLogs() });
});

// Respaldos
router.post('/backup', (req, res) => {
  try {
    const result = db.createBackup();
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
