const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Motor de Cálculo de Cotizaciones
 * - Maneja compra individual, paquetes, mayoreo por volumen y sucursales.
 * - Aplica descuentos oficiales o solicita autorización si el margen cae por debajo del 35%.
 * - Alerta explícitamente si algún concepto utiliza precios provisionales.
 */
function calculateQuote(params) {
  const catalog = db.getCatalog();
  const tiers = db.getWholesaleTiers();
  const fin = db.getFinancialStructure();

  const items = params.items || [];
  let subtotal = 0;
  let totalCost = 0;
  let hasProvisionalPrice = false;
  let provisionalReasons = [];
  const processedItems = [];

  // Calcular cantidad total de displays físicos para determinar escala de mayoreo
  let totalDisplays = 0;
  for (const item of items) {
    if (item.type === 'product' || !item.type) {
      totalDisplays += Number(item.quantity || 1);
    }
  }

  // Encontrar escala de mayoreo aplicable
  let applicableTier = tiers.find(t => totalDisplays >= t.min_qty && totalDisplays <= t.max_qty);
  if (!applicableTier && totalDisplays > 0) {
    // Si excede la última escala
    applicableTier = tiers[tiers.length - 1];
  }
  const defaultDiscountPct = applicableTier ? applicableTier.discount_pct : 0;

  for (const rawItem of items) {
    const qty = Number(rawItem.quantity || 1);
    let unitPrice = 0;
    let unitCost = 0;
    let name = rawItem.name || 'Concepto';
    let details = rawItem.details || '';
    let itemStatus = 'CONFIRMADO';

    if (rawItem.type === 'service') {
      const srv = catalog.services.find(s => s.id === rawItem.service_id);
      if (srv) {
        name = `Servicio TIK: ${srv.name} (${rawItem.tier === 'PLUS' ? 'PLUS' : 'BÁSICO'})`;
        details = rawItem.tier === 'PLUS' ? srv.plus_description : srv.basic_description;
        unitPrice = rawItem.tier === 'PLUS' ? Number(srv.plus_extra_price || 189) : Number(srv.basic_extra_price || 0);
        unitCost = rawItem.tier === 'PLUS' ? 45.00 : 0.00;
        if (srv.plus_price_status === 'PROVISIONAL' && rawItem.tier === 'PLUS') {
          hasProvisionalPrice = true;
          itemStatus = 'PROVISIONAL';
          provisionalReasons.push(`Precio del complemento Plus para servicio ${srv.name} ($${unitPrice} MXN) es una referencia provisional.`);
        }
      }
    } else if (rawItem.type === 'addon') {
      const addon = catalog.add_ons.find(a => a.id === rawItem.addon_id);
      if (addon) {
        name = addon.name;
        details = addon.description;
        unitPrice = Number(addon.price);
        unitCost = Number(addon.cost || 0);
        if (addon.price_status === 'PROVISIONAL') {
          hasProvisionalPrice = true;
          itemStatus = 'PROVISIONAL';
          provisionalReasons.push(`El concepto ${addon.name} ($${unitPrice} MXN) tiene estatus provisional pendiente de confirmación.`);
        }
      }
    } else {
      // Producto por defecto: Display 10x15
      const prod = catalog.products[0];
      name = prod.name;
      unitPrice = Number(prod.base_price);
      unitCost = Number(prod.unit_cost);

      if (prod.price_status === 'PROVISIONAL') {
        hasProvisionalPrice = true;
        itemStatus = 'PROVISIONAL';
        provisionalReasons.push(`El precio base del Display Acrílico ($${unitPrice} MXN) es una referencia provisional.`);
      }

      // Si incluye servicio plus en el mismo ítem
      if (rawItem.tier === 'PLUS' || rawItem.include_plus) {
        const plusPrice = 189.00;
        unitPrice += plusPrice;
        unitCost += 45.00;
        details += ` | Incluye experiencia PLUS (+$${plusPrice} MXN)`;
        hasProvisionalPrice = true;
        provisionalReasons.push(`Complemento PLUS integrado ($${plusPrice} MXN) es provisional.`);
      }

      // Personalización adicional
      if (rawItem.custom_design) {
        const customPrice = 250.00;
        unitPrice += customPrice;
        unitCost += 50.00;
        details += ` | Personalización de diseño gráfico especial (+$${customPrice} MXN)`;
      }

      if (rawItem.service_name) {
        details = `Configuración para: ${rawItem.service_name} (${rawItem.tier || 'BÁSICO'}). ${details}`;
      }
    }

    // Permitir sobreescritura manual autorizada si se especificó
    if (rawItem.custom_unit_price !== undefined && rawItem.custom_unit_price !== null) {
      unitPrice = Number(rawItem.custom_unit_price);
    }

    const itemSubtotal = unitPrice * qty;
    const itemTotalCost = unitCost * qty;
    subtotal += itemSubtotal;
    totalCost += itemTotalCost;

    processedItems.push({
      type: rawItem.type || 'product',
      name,
      details,
      quantity: qty,
      unit_price: unitPrice,
      unit_cost: unitCost,
      subtotal: itemSubtotal,
      total_cost: itemTotalCost,
      status: itemStatus
    });
  }

  // Descuentos: porcentaje automático de mayoreo a menos que se fuerce un descuento manual
  let discountPct = params.discount_pct !== undefined ? Number(params.discount_pct) : defaultDiscountPct;
  let discountAmount = (subtotal * discountPct) / 100;
  let amountAfterDiscount = subtotal - discountAmount;

  // Gastos de envío / entrega
  let shippingCost = Number(params.shipping_cost || 0);
  let totalBeforeTax = amountAfterDiscount + shippingCost;

  // Impuestos
  let applyTax = Boolean(params.apply_tax);
  let taxRate = applyTax ? 0.16 : 0;
  let taxAmount = totalBeforeTax * taxRate;
  let grandTotal = totalBeforeTax + taxAmount;

  // Cálculos de rentabilidad de la cotización
  // Utilidad Bruta = Total antes de impuestos - Costo Total de producción
  const grossProfit = totalBeforeTax - totalCost;
  // Margen Porcentual = (Utilidad Bruta / Total antes de impuestos) * 100
  const grossMarginPct = totalBeforeTax > 0 ? (grossProfit / totalBeforeTax) * 100 : 0;
  // Markup = (Utilidad Bruta / Costo Total) * 100
  const markupPct = totalCost > 0 ? (grossProfit / totalCost) * 100 : 0;

  // Regla de aprobación: si el margen es menor al mínimo (35%)
  const minMargin = fin.margin_rules.min_margin_percentage || 35;
  const requiresOwnerApproval = grossMarginPct < minMargin;

  return {
    items: processedItems,
    total_displays: totalDisplays,
    applicable_tier: applicableTier ? applicableTier.tier_name : 'N/A',
    subtotal: Math.round(subtotal * 100) / 100,
    discount_pct: discountPct,
    discount_amount: Math.round(discountAmount * 100) / 100,
    shipping_cost: shippingCost,
    total_before_tax: Math.round(totalBeforeTax * 100) / 100,
    apply_tax: applyTax,
    tax_amount: Math.round(taxAmount * 100) / 100,
    total: Math.round(grandTotal * 100) / 100,
    financial_breakdown: {
      total_production_cost: Math.round(totalCost * 100) / 100,
      gross_profit: Math.round(grossProfit * 100) / 100,
      gross_margin_percentage: Math.round(grossMarginPct * 100) / 100,
      markup_percentage: Math.round(markupPct * 100) / 100,
      min_margin_threshold: minMargin,
      requires_approval: requiresOwnerApproval,
      approval_reason: requiresOwnerApproval ? `El margen resultante (${grossMarginPct.toFixed(1)}%) es inferior al mínimo permitido (${minMargin}%).` : null
    },
    provisional_flags: {
      has_provisional_pricing: hasProvisionalPrice,
      reasons: [...new Set(provisionalReasons)]
    }
  };
}

// Endpoint de cálculo y simulación instantánea
router.post('/calculate', (req, res) => {
  try {
    const calculation = calculateQuote(req.body);
    res.json({ success: true, data: calculation });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Listar cotizaciones guardadas
router.get('/', (req, res) => {
  const quotes = db.getQuotes();
  res.json({ success: true, count: quotes.length, data: quotes });
});

// Obtener cotización por ID o Folio
router.get('/:id', (req, res) => {
  const quote = db.getQuoteById(req.params.id);
  if (!quote) return res.status(404).json({ success: false, error: 'Cotización no encontrada' });
  res.json({ success: true, data: quote });
});

// Guardar cotización formal
router.post('/', (req, res) => {
  try {
    const calc = calculateQuote(req.body);
    const quoteData = {
      ...req.body,
      ...calc,
      id: req.body.id || `q-${Date.now()}`,
      folio: req.body.folio || `TIK-COT-${new Date().getFullYear()}-${String(db.getQuotes().length + 1).padStart(3, '0')}`,
      client_name: req.body.client_name || 'Prospecto General',
      client_email: req.body.client_email || '',
      client_phone: req.body.client_phone || '',
      business_type: req.body.business_type || 'Comercial',
      valid_until_days: req.body.valid_until_days || 15,
      notes: req.body.notes || 'Precios expresados en Moneda Nacional Mexicana (MXN). Entrega probada e incluye garantía oficial.'
    };
    const saved = db.saveQuote(quoteData, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
