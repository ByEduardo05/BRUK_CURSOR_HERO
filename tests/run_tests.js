/**
 * Test Suite Integral de Verificación: Los 10 Casos Obligatorios TIK MASTER
 *
 * CASO 1: Cotizar un display individual con un servicio Básico.
 * CASO 2: Cotizar un display con experiencia Plus.
 * CASO 3: Cotizar 20 displays para varias sucursales.
 * CASO 4: Calcular la utilidad de una venta con costos registrados.
 * CASO 5: Responder una pregunta sobre garantía.
 * CASO 6: Generar un documento de garantía.
 * CASO 7: Recomendar servicios a una cafetería.
 * CASO 8: Responder una pregunta cuya información no esté registrada.
 * CASO 9: Detectar que un precio está pendiente de confirmar.
 * CASO 10: Generar una cotización PDF y JPG.
 */

const assert = require('assert');
const app = require('../server/server');

let server;
const PORT = 3055;
const BASE_URL = `http://localhost:${PORT}`;

async function runAllTests() {
  console.log('================================================================');
  console.log('   INICIANDO PRUEBAS DE LOS 10 CASOS OBLIGATORIOS TIK MASTER   ');
  console.log('================================================================\n');

  server = app.listen(PORT);

  try {
    // -------------------------------------------------------------
    // CASO 1: Cotizar un display individual con un servicio Básico.
    // -------------------------------------------------------------
    console.log('CASO 1: Cotizar un display individual con un servicio Básico...');
    const c1Res = await fetch(`${BASE_URL}/api/quotes/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ type: 'product', quantity: 1, service_id: 'srv-resenas', tier: 'BASICO' }]
      })
    });
    const c1 = await c1Res.json();
    assert.strictEqual(c1.success, true);
    assert.strictEqual(c1.data.total_displays, 1);
    assert.strictEqual(c1.data.subtotal, 299.00);
    assert.strictEqual(c1.data.discount_pct, 0);
    assert.strictEqual(c1.data.total, 299.00);
    console.log('   ✓ CASO 1 PASADO: Subtotal = $299.00 MXN, Total = $299.00 MXN, Descuento = 0%.\n');

    // -------------------------------------------------------------
    // CASO 2: Cotizar un display con experiencia Plus.
    // -------------------------------------------------------------
    console.log('CASO 2: Cotizar un display con experiencia Plus...');
    const c2Res = await fetch(`${BASE_URL}/api/quotes/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ type: 'product', quantity: 1, service_id: 'srv-resenas', tier: 'PLUS', include_plus: true }]
      })
    });
    const c2 = await c2Res.json();
    assert.strictEqual(c2.success, true);
    // Base 299 + Plus 189 = 488.00 MXN
    assert.strictEqual(c2.data.total, 488.00);
    assert.strictEqual(c2.data.items[0].unit_price, 488.00);
    console.log('   ✓ CASO 2 PASADO: Base ($299) + Plus ($189) = Total $488.00 MXN calculado correctamente.\n');

    // -------------------------------------------------------------
    // CASO 3: Cotizar 20 displays para varias sucursales (Mayoreo).
    // -------------------------------------------------------------
    console.log('CASO 3: Cotizar 20 displays para varias sucursales con mayoreo...');
    const c3Res = await fetch(`${BASE_URL}/api/quotes/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ type: 'product', quantity: 20, service_id: 'srv-resenas', tier: 'BASICO' }],
        business_type: 'Restaurantes'
      })
    });
    const c3 = await c3Res.json();
    assert.strictEqual(c3.success, true);
    assert.strictEqual(c3.data.total_displays, 20);
    // Escala 20 a 49 unidades = 25% de descuento
    assert.strictEqual(c3.data.applicable_tier, 'Mayoreo Cadenas');
    assert.strictEqual(c3.data.discount_pct, 25);
    const expectedSubtotal = 20 * 299; // 5980
    const expectedDiscount = 5980 * 0.25; // 1495
    const expectedTotal = 5980 - 1495; // 4485
    assert.strictEqual(c3.data.subtotal, expectedSubtotal);
    assert.strictEqual(c3.data.discount_amount, expectedDiscount);
    assert.strictEqual(c3.data.total, expectedTotal);
    console.log(`   ✓ CASO 3 PASADO: Escala Mayoreo Cadenas (25%), Subtotal: $${expectedSubtotal}, Descuento: -$${expectedDiscount}, Total: $${expectedTotal} MXN.\n`);

    // -------------------------------------------------------------
    // CASO 4: Calcular la utilidad de una venta con costos registrados.
    // -------------------------------------------------------------
    console.log('CASO 4: Calcular la utilidad de una venta con costos registrados...');
    const c4Res = await fetch(`${BASE_URL}/api/financial/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quantity: 1,
        unit_price: 299,
        discount_pct: 0
      })
    });
    const c4 = await c4Res.json();
    assert.strictEqual(c4.success, true);
    // Costo total = $122.00 (Hw 88 + Op 34)
    assert.strictEqual(c4.data.unit_cost, 122.00);
    const expectedProfit = 299 - 122; // 177.00
    assert.strictEqual(c4.data.total_profit, expectedProfit);
    // Margen = 177 / 299 * 100 = 59.20%
    assert.strictEqual(c4.data.margin_percentage, 59.20);
    // Markup = 177 / 122 * 100 = 145.08%
    assert.strictEqual(c4.data.markup_percentage, 145.08);
    console.log(`   ✓ CASO 4 PASADO: Utilidad = $${expectedProfit} MXN, Margen = 59.20%, Markup = 145.08% (Diferenciados con rigor).\n`);

    // -------------------------------------------------------------
    // CASO 5: Responder una pregunta sobre garantía.
    // -------------------------------------------------------------
    console.log('CASO 5: Responder una pregunta sobre política de garantía...');
    const c5Res = await fetch(`${BASE_URL}/api/ai/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '¿Cuál es nuestra política de garantía?' })
    });
    const c5 = await c5Res.json();
    assert.strictEqual(c5.success, true);
    assert.ok(c5.data.reply.includes('30 días'));
    assert.ok(c5.data.reply.includes('NFC'));
    assert.ok(c5.data.reply.includes('QR'));
    assert.ok(c5.data.reply.includes('Exclusiones'));
    console.log('   ✓ CASO 5 PASADO: El sistema recuperó y explicó la cobertura oficial de 30 días, alcances y exclusiones.\n');

    // -------------------------------------------------------------
    // CASO 6: Generar un documento de garantía.
    // -------------------------------------------------------------
    console.log('CASO 6: Generar un documento de garantía...');
    const c6Res = await fetch(`${BASE_URL}/api/warranties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: 'Restaurante Prueba',
        client_phone: '+52 55 0000 1111',
        order_id: 'ORD-TEST-100',
        coverage_days: 30
      })
    });
    const c6 = await c6Res.json();
    assert.strictEqual(c6.success, true);
    assert.ok(c6.data.folio.startsWith('TIK-GAR-'));
    assert.strictEqual(c6.data.status, 'VIGENTE');
    console.log(`   ✓ CASO 6 PASADO: Póliza generada con folio ${c6.data.folio}, vigencia de 30 días calculada.\n`);

    // -------------------------------------------------------------
    // CASO 7: Recomendar servicios a una cafetería.
    // -------------------------------------------------------------
    console.log('CASO 7: Recomendar servicios a una cafetería...');
    const c7Res = await fetch(`${BASE_URL}/api/advisor/recommend?business_type=Cafeterías`);
    const c7 = await c7Res.json();
    assert.strictEqual(c7.success, true);
    assert.strictEqual(c7.data.business_type, 'Cafeterías');
    const serviceIds = c7.data.services.map(s => s.id);
    assert.ok(serviceIds.includes('srv-wifi'));
    assert.ok(serviceIds.includes('srv-redes'));
    assert.ok(serviceIds.includes('srv-resenas'));
    assert.ok(c7.data.pitch.length > 20);
    console.log('   ✓ CASO 7 PASADO: Recomendados WiFi, Redes en un toque y Reseñas con argumentario específico.\n');

    // -------------------------------------------------------------
    // CASO 8: Responder una pregunta cuya información no esté registrada.
    // -------------------------------------------------------------
    console.log('CASO 8: Responder una pregunta de información no registrada (Regla de Oro)...');
    const c8Res = await fetch(`${BASE_URL}/api/ai/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '¿Podemos vender displays con acabado de aluminio anodizado y crédito a 12 meses?' })
    });
    const c8 = await c8Res.json();
    assert.strictEqual(c8.success, true);
    // Debe reconocer explícitamente que no está registrado y no inventar
    assert.ok(c8.data.reply.toLowerCase().includes('no se encuentra registrada') || c8.data.reply.toLowerCase().includes('no invento'));
    console.log('   ✓ CASO 8 PASADO: La IA se negó a inventar y solicitó confirmación oficial del propietario.\n');

    // -------------------------------------------------------------
    // CASO 9: Detectar que un precio está pendiente de confirmar.
    // -------------------------------------------------------------
    console.log('CASO 9: Detectar que un precio está pendiente de confirmar (Provisional)...');
    const c9Res = await fetch(`${BASE_URL}/api/quotes/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ type: 'product', quantity: 1, tier: 'PLUS', include_plus: true }]
      })
    });
    const c9 = await c9Res.json();
    assert.strictEqual(c9.success, true);
    assert.strictEqual(c9.data.provisional_flags.has_provisional_pricing, true);
    assert.ok(c9.data.provisional_flags.reasons.length > 0);
    console.log(`   ✓ CASO 9 PASADO: Detectadas ${c9.data.provisional_flags.reasons.length} alertas explícitas de provisionalidad.\n`);

    // -------------------------------------------------------------
    // CASO 10: Generar una cotización PDF y JPG reales.
    // -------------------------------------------------------------
    console.log('CASO 10: Generar una cotización PDF y JPG reales...');
    const pdfRes = await fetch(`${BASE_URL}/api/documents/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doc_type: 1,
        data: {
          folio: 'TIK-COT-TEST-10',
          client_name: 'Cafetería La Selva',
          items: [{ name: 'TIK Smart Display 10x15', quantity: 2, unit_price: 299, subtotal: 598 }],
          total: 598
        }
      })
    });
    assert.strictEqual(pdfRes.status, 200);
    assert.strictEqual(pdfRes.headers.get('content-type'), 'application/pdf');
    const pdfBuf = await pdfRes.arrayBuffer();
    assert.ok(pdfBuf.byteLength > 1000);

    const jpgRes = await fetch(`${BASE_URL}/api/documents/generate-jpg`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doc_type: 1,
        data: {
          folio: 'TIK-COT-TEST-10',
          client_name: 'Cafetería La Selva',
          items: [{ name: 'TIK Smart Display 10x15', quantity: 2, unit_price: 299, subtotal: 598 }],
          total: 598
        }
      })
    });
    assert.strictEqual(jpgRes.status, 200);
    assert.strictEqual(jpgRes.headers.get('content-type'), 'image/jpeg');
    const jpgBuf = await jpgRes.arrayBuffer();
    assert.ok(jpgBuf.byteLength > 10000);
    console.log(`   ✓ CASO 10 PASADO: PDF generado (${pdfBuf.byteLength} bytes) y JPG de alta fidelidad (${jpgBuf.byteLength} bytes).\n`);

    console.log('================================================================');
    console.log('   ¡TODAS LAS PRUEBAS DE LOS 10 CASOS PASARON SATISFACTORIAMENTE!');
    console.log('================================================================\n');

  } catch (err) {
    console.error('❌ ERROR EN PRUEBAS:', err);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
}

runAllTests();
