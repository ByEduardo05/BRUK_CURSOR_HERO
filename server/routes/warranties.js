const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar todas las pólizas de garantía
router.get('/', (req, res) => {
  const warranties = db.getWarranties();
  res.json({ success: true, count: warranties.length, data: warranties });
});

// Obtener póliza por ID o Folio
router.get('/:id', (req, res) => {
  const item = db.getWarrantyById(req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Garantía no encontrada' });
  res.json({ success: true, data: item });
});

// Registrar nueva póliza de garantía
router.post('/', (req, res) => {
  try {
    const {
      client_name,
      client_email,
      client_phone,
      order_id,
      product_name,
      quantity = 1,
      purchase_date,
      delivery_date,
      coverage_days = 30,
      coverage_details
    } = req.body;

    if (!client_name) {
      return res.status(400).json({ success: false, error: 'Nombre del cliente es obligatorio' });
    }

    const pDate = purchase_date ? new Date(purchase_date) : new Date();
    const dDate = delivery_date ? new Date(delivery_date) : new Date();

    // La garantía corre a partir de la fecha de entrega
    const startDate = dDate;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Number(coverage_days));

    const today = new Date();
    const isExpired = today > endDate;

    const warranty = {
      id: `war-${Date.now()}`,
      folio: `TIK-GAR-${new Date().getFullYear()}-${String(db.getWarranties().length + 1).padStart(3, '0')}`,
      order_id: order_id || `ORD-${Date.now().toString().slice(-5)}`,
      client_name,
      client_email: client_email || '',
      client_phone: client_phone || '',
      product_name: product_name || 'TIK Smart Display 10×15 cm',
      quantity: Number(quantity),
      purchase_date: pDate.toISOString().split('T')[0],
      delivery_date: dDate.toISOString().split('T')[0],
      warranty_start_date: startDate.toISOString().split('T')[0],
      warranty_end_date: endDate.toISOString().split('T')[0],
      status: isExpired ? 'VENCIDA' : 'VIGENTE',
      coverage_details: coverage_details || `${coverage_days} días de cobertura contra defectos de fábrica en chip NFC y legibilidad de código QR.`,
      incidents: []
    };

    const saved = db.saveWarranty(warranty, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Registrar incidencia técnica sobre una póliza
router.post('/:id/incidents', (req, res) => {
  try {
    const warranty = db.getWarrantyById(req.params.id);
    if (!warranty) return res.status(404).json({ success: false, error: 'Garantía no encontrada' });

    const { description, diagnosis, solution, status = 'EN_REVISION' } = req.body;
    if (!description) return res.status(400).json({ success: false, error: 'Descripción de la incidencia requerida' });

    const incident = {
      id: `inc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description,
      diagnosis: diagnosis || 'En análisis técnico preliminar.',
      solution: solution || '',
      status
    };

    if (!warranty.incidents) warranty.incidents = [];
    warranty.incidents.push(incident);
    warranty.status = status === 'RESUELTA' ? 'VIGENTE' : status;

    const saved = db.saveWarranty(warranty, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: saved, incident });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
