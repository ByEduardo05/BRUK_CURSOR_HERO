const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Motor Financiero TIK
 * Calcula con rigor matemático:
 * - Costo unitario y por lote de display
 * - Margen Porcentual = (Precio - Costo) / Precio * 100
 * - Markup (Porcentaje sobre costo) = (Precio - Costo) / Costo * 100
 * - Punto de equilibrio
 * - Descuento máximo permitido sin violar el margen mínimo
 */
function getCostBreakdown() {
  const fin = db.getFinancialStructure();
  const catalog = db.getCatalog();
  const baseProd = catalog.products[0] || {};

  const hardwareSum = (fin.hardware_costs || []).reduce((acc, c) => acc + Number(c.unit_cost || 0), 0);
  const operationalSum = (fin.operational_costs || []).reduce((acc, c) => acc + Number(c.unit_cost || 0), 0);
  const totalUnitCost = hardwareSum + operationalSum;

  const currentPrice = Number(baseProd.base_price || 299);
  const profit = currentPrice - totalUnitCost;
  const marginPct = currentPrice > 0 ? (profit / currentPrice) * 100 : 0;
  const markupPct = totalUnitCost > 0 ? (profit / totalUnitCost) * 100 : 0;

  const minMargin = Number(fin.margin_rules?.min_margin_percentage || 35);
  // Precio mínimo permitido para mantener el margen mínimo:
  // (P_min - Costo) / P_min = minMargin / 100 => P_min * (1 - minMargin/100) = Costo => P_min = Costo / (1 - minMargin/100)
  const minPriceAllowed = minMargin < 100 ? totalUnitCost / (1 - (minMargin / 100)) : totalUnitCost;
  const maxDiscountPercentage = currentPrice > 0 ? Math.max(0, ((currentPrice - minPriceAllowed) / currentPrice) * 100) : 0;

  // Punto de equilibrio mensual (si hay costos fijos)
  const fixedOverhead = Number(fin.fixed_overhead_monthly || 0);
  const breakEvenUnits = profit > 0 ? Math.ceil(fixedOverhead / profit) : 0;

  return {
    hardware_costs: fin.hardware_costs,
    hardware_total: Math.round(hardwareSum * 100) / 100,
    operational_costs: fin.operational_costs,
    operational_total: Math.round(operationalSum * 100) / 100,
    total_unit_cost: Math.round(totalUnitCost * 100) / 100,
    current_selling_price: currentPrice,
    unit_gross_profit: Math.round(profit * 100) / 100,
    unit_gross_margin_pct: Math.round(marginPct * 100) / 100,
    unit_markup_pct: Math.round(markupPct * 100) / 100,
    min_margin_pct: minMargin,
    min_selling_price_allowed: Math.round(minPriceAllowed * 100) / 100,
    max_discount_percentage: Math.round(maxDiscountPercentage * 100) / 100,
    fixed_overhead_monthly: fixedOverhead,
    break_even_units: breakEvenUnits
  };
}

// Obtener métricas y desglose financiero actual
router.get('/', (req, res) => {
  const breakdown = getCostBreakdown();
  res.json({ success: true, data: breakdown });
});

// Simulación de rentabilidad con parámetros personalizados
router.post('/simulate', (req, res) => {
  try {
    const { quantity = 1, unit_price, custom_unit_cost, discount_pct = 0 } = req.body;
    const current = getCostBreakdown();

    const price = unit_price !== undefined ? Number(unit_price) : current.current_selling_price;
    const cost = custom_unit_cost !== undefined ? Number(custom_unit_cost) : current.total_unit_cost;
    const qty = Number(quantity);

    const discountedPrice = price * (1 - (Number(discount_pct) / 100));
    const totalRevenue = discountedPrice * qty;
    const totalCost = cost * qty;
    const totalProfit = totalRevenue - totalCost;

    const unitProfit = discountedPrice - cost;
    const marginPct = discountedPrice > 0 ? (unitProfit / discountedPrice) * 100 : 0;
    const markupPct = cost > 0 ? (unitProfit / cost) * 100 : 0;

    const isProfitable = unitProfit > 0;
    const meetsMinMargin = marginPct >= current.min_margin_pct;

    res.json({
      success: true,
      data: {
        quantity: qty,
        original_price: price,
        discount_pct: Number(discount_pct),
        effective_unit_price: Math.round(discountedPrice * 100) / 100,
        unit_cost: cost,
        total_revenue: Math.round(totalRevenue * 100) / 100,
        total_cost: Math.round(totalCost * 100) / 100,
        total_profit: Math.round(totalProfit * 100) / 100,
        margin_percentage: Math.round(marginPct * 100) / 100,
        markup_percentage: Math.round(markupPct * 100) / 100,
        meets_min_margin: meetsMinMargin,
        is_profitable: isProfitable,
        warning: !meetsMinMargin ? `El margen obtenido (${marginPct.toFixed(1)}%) no alcanza la política del ${current.min_margin_pct}% y requiere autorización manual.` : null
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Actualizar estructura de costos
router.put('/costs', (req, res) => {
  try {
    const updated = db.updateFinancialStructure(req.body, req.headers['x-user'] || 'PROPIETARIO');
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
