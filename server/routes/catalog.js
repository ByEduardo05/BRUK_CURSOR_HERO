const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener catálogo completo
router.get('/', (req, res) => {
  const catalog = db.getCatalog();
  const tiers = db.getWholesaleTiers();
  res.json({
    success: true,
    data: {
      ...catalog,
      wholesale_tiers: tiers
    }
  });
});

// Actualizar producto
router.put('/products/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Actualizar servicio
router.put('/services/:id', (req, res) => {
  try {
    const updated = db.updateService(req.params.id, req.body, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Actualizar complemento
router.put('/addons/:id', (req, res) => {
  try {
    const updated = db.updateAddon(req.params.id, req.body, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Actualizar escalas de mayoreo
router.put('/wholesale-tiers', (req, res) => {
  try {
    const { tiers } = req.body;
    if (!Array.isArray(tiers)) return res.status(400).json({ success: false, error: 'tiers debe ser un arreglo' });
    const updated = db.updateWholesaleTiers(tiers, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
