const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const { createCanvas } = require('canvas');
const db = require('../db');

/**
 * Generador Universal de Documentos TIK MASTER
 * Soporta los 16 tipos requeridos:
 * 1. Cotización comercial
 * 2. Cotización de mayoreo
 * 3. Propuesta comercial
 * 4. Comparativa Básico vs Plus
 * 5. Recomendación personalizada
 * 6. Ficha técnica del producto
 * 7. Garantía
 * 8. Comprobante de entrega
 * 9. Manual de uso
 * 10. Instrucciones de instalación
 * 11. Renovación de servicio
 * 12. Resumen de pedido
 * 13. Reporte de costos
 * 14. Reporte de rentabilidad
 * 15. Resumen de incidencias
 * 16. Documento de condiciones del servicio
 */

const DOC_TYPES = {
  1: { id: "cotizacion_comercial", title: "COTIZACIÓN COMERCIAL" },
  2: { id: "cotizacion_mayoreo", title: "COTIZACIÓN DE MAYOREO" },
  3: { id: "propuesta_comercial", title: "PROPUESTA COMERCIAL ESTRATÉGICA" },
  4: { id: "comparativa_basico_plus", title: "COMPARATIVA TIK BÁSICO VS PLUS" },
  5: { id: "recomendacion_personalizada", title: "RECOMENDACIÓN COMERCIAL A LA MEDIDA" },
  6: { id: "ficha_tecnica", title: "FICHA TÉCNICA OFICIAL — SMART DISPLAY" },
  7: { id: "garantia", title: "PÓLIZA DE GARANTÍA OFICIAL" },
  8: { id: "comprobante_entrega", title: "COMPROBANTE DE ENTREGA Y CONFORMIDAD" },
  9: { id: "manual_uso", title: "MINI MANUAL DE USO Y CUIDADOS" },
  10: { id: "instrucciones_instalacion", title: "GUÍA DE INSTALACIÓN Y UBICACIÓN ÓPTIMA" },
  11: { id: "renovacion_servicio", title: "AVISO Y ORDEN DE RENOVACIÓN DE SERVICIO" },
  12: { id: "resumen_pedido", title: "RESUMEN DE ORDEN DE FABRICACIÓN" },
  13: { id: "reporte_costos", title: "REPORTE INTERNO DE ESTRUCTURA DE COSTOS" },
  14: { id: "reporte_rentabilidad", title: "REPORTE FINANCIERO Y MARGEN DE RENTABILIDAD" },
  15: { id: "resumen_incidencias", title: "REPORTE DE INCIDENCIAS Y SOPORTE TÉCNICO" },
  16: { id: "condiciones_servicio", title: "TÉRMINOS Y CONDICIONES DE LOS SERVICIOS" }
};

// Generar PDF limpio y profesional en estilo TIK (Black / Zinc / Minimal)
function buildPDFStream(docTypeNum, data, res) {
  const docInfo = DOC_TYPES[docTypeNum] || DOC_TYPES[1];
  const doc = new PDFDocument({ size: 'LETTER', margin: 45 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="TIK_${docInfo.id}_${data.folio || Date.now()}.pdf"`);
  doc.pipe(res);

  const primaryColor = '#111827';
  const accentColor = '#3b82f6';
  const grayColor = '#6b7280';
  const lightBg = '#f3f4f6';

  // Header Banner
  doc.rect(45, 45, 522, 60).fill('#0f172a');
  doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold').text('TIK SMART DISPLAYS', 60, 58);
  doc.fontSize(9).font('Helvetica').fillColor('#94a3b8').text('Conectamos experiencias físicas con digitales | NFC + QR', 60, 82);

  // Document Type & Folio Tag
  doc.rect(400, 55, 155, 40).fill('#1e293b');
  doc.fillColor('#38bdf8').fontSize(9).font('Helvetica-Bold').text(docInfo.title.slice(0, 24), 408, 62, { width: 140, align: 'right' });
  doc.fillColor('#f8fafc').fontSize(11).font('Helvetica-Bold').text(`FOLIO: ${data.folio || 'TIK-' + Date.now().toString().slice(-6)}`, 408, 77, { width: 140, align: 'right' });

  // Metadata Row
  let y = 120;
  doc.rect(45, y, 522, 45).fill(lightBg);
  doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text('CLIENTE / PROSPECTO:', 55, y + 8);
  doc.font('Helvetica').fontSize(10).text(data.client_name || 'Cliente Particular', 185, y + 8);

  doc.font('Helvetica-Bold').text('FECHA:', 380, y + 8);
  doc.font('Helvetica').text(data.date || new Date().toISOString().split('T')[0], 430, y + 8);

  doc.font('Helvetica-Bold').text('CONTACTO:', 55, y + 26);
  doc.font('Helvetica').text(`${data.client_email || 'No registrado'} | ${data.client_phone || 'N/A'}`, 185, y + 26);

  doc.font('Helvetica-Bold').text('VIGENCIA:', 380, y + 26);
  doc.font('Helvetica').text(`${data.validity_days || 15} días`, 445, y + 26);

  y += 60;

  // Body Content depending on Doc Type
  doc.fillColor(primaryColor).fontSize(13).font('Helvetica-Bold').text(docInfo.title, 45, y);
  y += 20;

  // Table or structured list
  const items = data.items || [
    { name: 'TIK Smart Display 10x15 cm Acrílico', details: 'Incluye NFC de alta velocidad y código QR configurado.', quantity: 1, unit_price: 299.00, subtotal: 299.00 },
    { name: 'Experiencia Digital PLUS', details: 'Filtrado inteligente / Enlaces dinámicos personalizados', quantity: 1, unit_price: 189.00, subtotal: 189.00 }
  ];

  // Table Header
  doc.rect(45, y, 522, 22).fill('#1e293b');
  doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
  doc.text('CONCEPTO / DESCRIPCIÓN', 55, y + 6);
  doc.text('CANT', 360, y + 6, { width: 40, align: 'center' });
  doc.text('P. UNIT', 415, y + 6, { width: 60, align: 'right' });
  doc.text('SUBTOTAL', 485, y + 6, { width: 70, align: 'right' });
  y += 24;

  let grandTotal = 0;
  for (const it of items) {
    const rowHeight = 32;
    doc.rect(45, y, 522, rowHeight).fill(y % 2 === 0 ? '#f8fafc' : '#ffffff');
    doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text(it.name || 'Concepto', 55, y + 4, { width: 290 });
    doc.fillColor(grayColor).fontSize(8).font('Helvetica').text(it.details || '', 55, y + 16, { width: 290, lineBreak: false });

    doc.fillColor(primaryColor).fontSize(9).font('Helvetica').text(String(it.quantity || 1), 360, y + 10, { width: 40, align: 'center' });
    doc.text(`$${Number(it.unit_price || 0).toFixed(2)}`, 415, y + 10, { width: 60, align: 'right' });
    const sub = Number(it.subtotal || (it.quantity * it.unit_price) || 0);
    grandTotal += sub;
    doc.font('Helvetica-Bold').text(`$${sub.toFixed(2)}`, 485, y + 10, { width: 70, align: 'right' });

    y += rowHeight;
    if (y > 680) {
      doc.addPage();
      y = 50;
    }
  }

  // Totals Box
  y += 15;
  const totalsX = 350;
  const totalsW = 217;
  const subtotalVal = data.subtotal !== undefined ? Number(data.subtotal) : grandTotal;
  const discountVal = data.discount_amount !== undefined ? Number(data.discount_amount) : 0;
  const totalVal = data.total !== undefined ? Number(data.total) : (subtotalVal - discountVal);

  doc.rect(totalsX, y, totalsW, 75).fill('#f1f5f9');
  doc.fillColor(grayColor).fontSize(9).font('Helvetica').text('Subtotal Lista:', totalsX + 15, y + 10);
  doc.fillColor(primaryColor).text(`$${subtotalVal.toFixed(2)} MXN`, totalsX + 120, y + 10, { width: 85, align: 'right' });

  doc.fillColor(grayColor).text(`Descuento (${data.discount_pct || 0}%):`, totalsX + 15, y + 26);
  doc.fillColor('#dc2626').text(`-$${discountVal.toFixed(2)} MXN`, totalsX + 120, y + 26, { width: 85, align: 'right' });

  doc.rect(totalsX, y + 44, totalsW, 31).fill('#0f172a');
  doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text('TOTAL:', totalsX + 15, y + 54);
  doc.fillColor('#38bdf8').fontSize(12).font('Helvetica-Bold').text(`$${totalVal.toFixed(2)} MXN`, totalsX + 90, y + 53, { width: 115, align: 'right' });

  y += 95;

  // Cláusulas, Condiciones y Notas
  doc.rect(45, y, 522, 70).fill('#f8fafc');
  doc.fillColor(primaryColor).fontSize(9).font('Helvetica-Bold').text('TÉRMINOS Y CONDICIONES COMERCIALES:', 55, y + 8);
  doc.fillColor(grayColor).fontSize(8).font('Helvetica');
  const termsText = data.terms || [
    '• Cada display se entrega 100% configurado y probado físicamente en NFC y QR.',
    '• Incluye póliza de garantía oficial de 30 días y mini manual de cuidados.',
    '• Precios expresados en Pesos Mexicanos (MXN). Entrega garantizada.',
    '• Cualquier modificación posterior a enlaces estáticos puede gestionarse a través de soporte técnico.'
  ].join('\n');
  doc.text(termsText, 55, y + 22, { width: 500 });

  // Footer
  doc.rect(45, 730, 522, 30).fill('#0f172a');
  doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold').text('TIK SMART DISPLAYS — Encargado Virtual y Asistencia Oficial', 55, 740);
  doc.fillColor('#94a3b8').fontSize(8).text('contacto@tiksmartdisplays.com | www.tiksmartdisplays.com', 320, 740, { width: 235, align: 'right' });

  doc.end();
}

// Generador de Imagen JPG de Alta Definición (Node Canvas)
function generateJPGBuffer(docTypeNum, data) {
  const docInfo = DOC_TYPES[docTypeNum] || DOC_TYPES[1];
  const width = 1200;
  const height = 1600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, width, height);

  // Card Container
  ctx.fillStyle = '#111318';
  ctx.fillRect(40, 40, width - 80, height - 80);

  // Header
  ctx.fillStyle = '#171923';
  ctx.fillRect(40, 40, width - 80, 160);

  // Logo Brand
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('TIK SMART DISPLAYS', 80, 120);

  ctx.fillStyle = '#00d2ff';
  ctx.font = '20px sans-serif';
  ctx.fillText('NFC + QR INTERACTIVE TECH', 80, 155);

  // Document Badge
  ctx.fillStyle = '#222634';
  ctx.fillRect(720, 70, 400, 100);
  ctx.fillStyle = '#00e599';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(docInfo.title.slice(0, 24), 740, 110);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(`FOLIO: ${data.folio || 'TIK-' + Date.now().toString().slice(-6)}`, 740, 148);

  // Client Metadata Box
  ctx.fillStyle = '#161922';
  ctx.fillRect(80, 230, width - 160, 130);

  ctx.fillStyle = '#8e96a8';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('CLIENTE:', 110, 275);
  ctx.fillText('FECHA:', 740, 275);
  ctx.fillText('CONTACTO:', 110, 325);
  ctx.fillText('VIGENCIA:', 740, 325);

  ctx.fillStyle = '#ffffff';
  ctx.font = '22px sans-serif';
  ctx.fillText(data.client_name || 'Cliente Particular', 220, 275);
  ctx.fillText(data.date || new Date().toISOString().split('T')[0], 830, 275);
  ctx.fillText(`${data.client_email || 'Sin correo'} | ${data.client_phone || 'N/A'}`, 240, 325);
  ctx.fillText(`${data.validity_days || 15} días`, 850, 325);

  // Items Table
  let y = 420;
  ctx.fillStyle = '#1e2330';
  ctx.fillRect(80, y, width - 160, 55);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('CONCEPTO Y DETALLES', 110, y + 36);
  ctx.fillText('CANT', 700, y + 36);
  ctx.fillText('UNITARIO', 820, y + 36);
  ctx.fillText('TOTAL', 980, y + 36);

  y += 65;

  const items = data.items || [
    { name: 'TIK Smart Display 10x15 cm Acrílico', details: 'Acrílico cristal de alta densidad con chip NFC integrado y QR', quantity: 1, unit_price: 299.00, subtotal: 299.00 },
    { name: 'Experiencia Digital PLUS', details: 'Filtro inteligente hacia WhatsApp (1-4*) y Google Maps (5*)', quantity: 1, unit_price: 189.00, subtotal: 189.00 }
  ];

  let calculatedSubtotal = 0;
  for (const it of items) {
    ctx.fillStyle = '#141720';
    ctx.fillRect(80, y, width - 160, 80);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(it.name || 'Concepto', 110, y + 34);

    ctx.fillStyle = '#8e96a8';
    ctx.font = '16px sans-serif';
    ctx.fillText((it.details || '').slice(0, 55), 110, y + 62);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.fillText(String(it.quantity || 1), 720, y + 45);
    ctx.fillText(`$${Number(it.unit_price || 0).toFixed(2)}`, 820, y + 45);

    const sub = Number(it.subtotal || (it.quantity * it.unit_price) || 0);
    calculatedSubtotal += sub;
    ctx.fillStyle = '#00d2ff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`$${sub.toFixed(2)}`, 980, y + 45);

    y += 90;
  }

  // Totals Area
  y += 20;
  const subtotalVal = data.subtotal !== undefined ? Number(data.subtotal) : calculatedSubtotal;
  const discountVal = data.discount_amount !== undefined ? Number(data.discount_amount) : 0;
  const totalVal = data.total !== undefined ? Number(data.total) : (subtotalVal - discountVal);

  ctx.fillStyle = '#171b26';
  ctx.fillRect(680, y, 440, 180);

  ctx.fillStyle = '#8e96a8';
  ctx.font = '20px sans-serif';
  ctx.fillText('Subtotal Base:', 710, y + 45);
  ctx.fillText(`Descuento (${data.discount_pct || 0}%):`, 710, y + 90);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(`$${subtotalVal.toFixed(2)} MXN`, 920, y + 45);
  ctx.fillStyle = '#ff4b4b';
  ctx.fillText(`-$${discountVal.toFixed(2)} MXN`, 920, y + 90);

  ctx.fillStyle = '#0f131c';
  ctx.fillRect(680, y + 115, 440, 65);
  ctx.fillStyle = '#00e599';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('TOTAL A PAGAR:', 700, y + 158);
  ctx.fillText(`$${totalVal.toFixed(2)} MXN`, 910, y + 158);

  // Terms and Trust
  y += 210;
  ctx.fillStyle = '#161922';
  ctx.fillRect(80, y, width - 160, 160);

  ctx.fillStyle = '#00d2ff';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('POLÍTICA Y GARANTÍA OFICIAL TIK:', 110, y + 40);

  ctx.fillStyle = '#abb4c7';
  ctx.font = '17px sans-serif';
  ctx.fillText('• 30 días de cobertura total contra cualquier defecto en chip NFC y QR.', 110, y + 75);
  ctx.fillText('• Se entrega configurado, verificado con equipo de prueba y listo para mostrador.', 110, y + 105);
  ctx.fillText('• Incluye tarjeta de garantía foliada y mini manual de uso para el personal.', 110, y + 135);

  // Footer Brand
  ctx.fillStyle = '#0b0d12';
  ctx.fillRect(40, height - 120, width - 80, 80);
  ctx.fillStyle = '#7a8499';
  ctx.font = '17px sans-serif';
  ctx.fillText('TIK SMART DISPLAYS — Sistema Operativo Empresarial TIK MASTER', 80, height - 75);
  ctx.fillText('contacto@tiksmartdisplays.com | WhatsApp Oficial', 720, height - 75);

  return canvas.toBuffer('image/jpeg', { quality: 0.95 });
}

// Endpoint de catálogo de los 16 tipos de documentos
router.get('/types', (req, res) => {
  res.json({ success: true, count: Object.keys(DOC_TYPES).length, data: DOC_TYPES });
});

// Endpoint Generación PDF
router.post('/generate-pdf', (req, res) => {
  try {
    const docTypeNum = Number(req.body.doc_type || 1);
    const data = req.body.data || {};
    buildPDFStream(docTypeNum, data, res);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint Generación JPG de alta calidad para WhatsApp
router.post('/generate-jpg', (req, res) => {
  try {
    const docTypeNum = Number(req.body.doc_type || 1);
    const data = req.body.data || {};
    const buffer = generateJPGBuffer(docTypeNum, data);
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `inline; filename="TIK_${Date.now()}.jpg"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
