const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar todas las secciones o filtrar
router.get('/', (req, res) => {
  const { status, category, query } = req.query;
  const items = db.getKnowledge({ status, category, query });
  res.json({
    success: true,
    count: items.length,
    data: items
  });
});

// Obtener sección por ID
router.get('/:id', (req, res) => {
  const item = db.getKnowledgeById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Sección no encontrada' });
  }
  res.json({ success: true, data: item });
});

// Crear o actualizar sección
router.post('/', (req, res) => {
  try {
    const { id, section, category, title, status, certainty_level, summary, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Título y contenido son obligatorios' });
    }
    const item = {
      id: id || `sec-${Date.now()}`,
      section: section || 'Custom',
      category: category || 'General',
      title,
      status: status || 'OFICIAL',
      certainty_level: certainty_level || 'CONFIRMADO',
      summary: summary || title,
      content,
      tags: Array.isArray(tags) ? tags : []
    };
    const saved = db.saveKnowledge(item, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Confirmar estado oficial de un dato provisional
router.patch('/:id/confirm', (req, res) => {
  try {
    const item = db.getKnowledgeById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Elemento no encontrado' });
    item.status = 'OFICIAL';
    item.certainty_level = 'CONFIRMADO';
    const updated = db.saveKnowledge(item, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, message: 'Dato confirmado como oficial', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
