/**
 * TIK MASTER — Cliente Web Principal
 * Gestiona navegación, peticiones al backend, cotizador en tiempo real,
 * interacción conversacional y descargas documentales.
 */

let currentCalculation = null;
let currentQuoteFolio = null;

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  runQuoteCalculation();
  loadAdvisorData();
  loadObjections();
  loadFinancialData();
  loadWarranties();
  loadDocTypes();
  loadKnowledgeData();
  loadClients();
  loadAuditLogs();
});

// Navegación fluida por pestañas
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.dataset.view;
      navTo(targetView);
    });
  });
}

function navTo(viewId) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));

  const navBtn = document.querySelector(`[data-view="${viewId}"]`);
  if (navBtn) navBtn.classList.add('active');

  const panel = document.getElementById(viewId);
  if (panel) panel.classList.add('active');

  // Actualizar títulos del header
  const titleMap = {
    chatView: ['Centro Conversacional: Pregúntale a TIK MASTER', 'Encargado virtual experto en decisiones comerciales, técnicas y operativas'],
    quotesView: ['Cotizador Inteligente TIK', 'Modo Manual y Asistido para Minoristas, Paquetes, Cadenas y Mayoreo'],
    advisorView: ['Asesor Comercial Estratégico', 'Recomendaciones por Giro y Manejo Experto de Objeciones'],
    financialView: ['Motor Financiero y Rentabilidad', 'Estructura de Costos Reales, Margen Porcentual vs Markup y Punto de Equilibrio'],
    warrantiesView: ['Centro de Garantías e Incidencias', 'Control de Vigencia, Diagnósticos y Certificados Oficiales'],
    documentsView: ['Generador Universal de Documentos', '16 Formatos Oficiales Listos en PDF y JPG para WhatsApp'],
    knowledgeView: ['Cerebro Empresarial: Knowledge Base', '21 Secciones de Conocimiento Estructurado (A-U) Oficial y Provisional'],
    clientsView: ['Directorio de Clientes', 'Historial Comercial, Sucursales y Datos de Contacto'],
    settingsView: ['Panel de Configuración y Seguridad', 'Control de IA, Auditoría de Cambios y Respaldo']
  };

  if (titleMap[viewId]) {
    document.getElementById('currentViewTitle').innerText = titleMap[viewId][0];
    document.getElementById('currentViewSubtitle').innerText = titleMap[viewId][1];
  }
}

// --- 1. CHAT CONVERSACIONAL ---
async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  appendChatBubble('user', message);
  input.value = '';

  const typingId = appendTypingIndicator();

  try {
    const res = await fetch('/api/ai/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    removeTypingIndicator(typingId);

    if (data.success && data.data) {
      appendChatBubble('agent', data.data.reply);
      if (data.data.action_suggested === 'CREATE_QUOTE' && data.data.quote_payload) {
        // Pre-cargar valores en el cotizador
        if (data.data.quote_payload.quantity) {
          document.getElementById('quoteQuantity').value = data.data.quote_payload.quantity;
        }
        if (data.data.quote_payload.business_type) {
          document.getElementById('quoteBusinessType').value = data.data.quote_payload.business_type;
        }
        runQuoteCalculation();
      }
    } else {
      appendChatBubble('agent', 'Hubo una dificultad técnica al consultar la base de conocimiento.');
    }
  } catch (err) {
    removeTypingIndicator(typingId);
    appendChatBubble('agent', 'Error de conexión con el motor TIK.');
  }
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChatMessage();
}

function sendPrompt(text) {
  document.getElementById('chatInput').value = text;
  sendChatMessage();
}

function appendChatBubble(role, text) {
  const history = document.getElementById('chatHistory');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${role}`;

  const avatar = document.createElement('div');
  avatar.className = `avatar ${role === 'user' ? 'avatar-user' : 'avatar-agent'}`;
  avatar.innerText = role === 'user' ? 'YO' : 'TIK';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  // Formato simple de markdown
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  bubble.innerHTML = `<p>${formatted}</p>`;

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  history.appendChild(msgDiv);
  history.scrollTop = history.scrollHeight;
}

function appendTypingIndicator() {
  const id = `typing-${Date.now()}`;
  const history = document.getElementById('chatHistory');
  const div = document.createElement('div');
  div.id = id;
  div.className = 'chat-msg';
  div.innerHTML = `
    <div class="avatar avatar-agent">TIK</div>
    <div class="msg-bubble" style="color: var(--text-muted); font-style: italic;">
      Consultando base de conocimiento oficial...
    </div>
  `;
  history.appendChild(div);
  history.scrollTop = history.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// --- 2. COTIZADOR INTELIGENTE ---
async function runQuoteCalculation() {
  const qty = parseInt(document.getElementById('quoteQuantity').value || '1', 10);
  const serviceId = document.getElementById('quoteService').value;
  const tier = document.getElementById('quoteTier').value;
  const customDesign = document.getElementById('quoteCustomDesign').checked;
  const applyTax = document.getElementById('quoteApplyTax').checked;
  const shipping = parseFloat(document.getElementById('quoteShipping').value || '0');
  const discountInput = document.getElementById('quoteDiscount').value;

  const payload = {
    items: [
      {
        type: 'product',
        quantity: qty,
        service_id: serviceId,
        tier: tier,
        include_plus: tier === 'PLUS',
        custom_design: customDesign
      }
    ],
    shipping_cost: shipping,
    apply_tax: applyTax
  };

  if (discountInput !== '') {
    payload.discount_pct = parseFloat(discountInput);
  }

  try {
    const res = await fetch('/api/quotes/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      currentCalculation = result.data;
      updateQuoteUI(result.data);
    }
  } catch (err) {
    console.error('Error calculando cotización:', err);
  }
}

function updateQuoteUI(data) {
  document.getElementById('quoteSubtotalDisplay').innerText = `$${data.subtotal.toFixed(2)}`;
  document.getElementById('quoteUnitsDisplay').innerText = `${data.total_displays} display(s)`;
  document.getElementById('quoteTotalDisplay').innerText = `$${data.total.toFixed(2)} MXN`;
  document.getElementById('quoteEscalaBadge').innerText = data.applicable_tier;

  if (data.discount_pct > 0) {
    document.getElementById('quoteDiscountDisplay').innerText = `Descuento: ${data.discount_pct}% (-$${data.discount_amount.toFixed(2)})`;
  } else {
    document.getElementById('quoteDiscountDisplay').innerText = 'Precio de lista regular';
  }

  // Desglose Financiero
  const fin = data.financial_breakdown;
  document.getElementById('quoteCostDisplay').innerText = `$${fin.total_production_cost.toFixed(2)} MXN`;
  document.getElementById('quoteProfitDisplay').innerText = `$${fin.gross_profit.toFixed(2)} MXN`;
  document.getElementById('quoteMarginDisplay').innerText = `${fin.gross_margin_percentage.toFixed(1)}%`;
  document.getElementById('quoteMarkupDisplay').innerText = `${fin.markup_percentage.toFixed(1)}%`;

  // Alerta provisional
  const alertBox = document.getElementById('quoteProvisionalAlert');
  if (data.provisional_flags.has_provisional_pricing) {
    alertBox.style.display = 'block';
    alertBox.innerHTML = `⚠️ <strong>Aviso de Provisionalidad:</strong> ${data.provisional_flags.reasons.join(' ')}`;
  } else {
    alertBox.style.display = 'none';
  }
}

async function saveAndGenerateQuote() {
  if (!currentCalculation) await runQuoteCalculation();
  const clientName = document.getElementById('quoteClientName').value || 'Cliente General';
  const bizType = document.getElementById('quoteBusinessType').value;

  const quotePayload = {
    client_name: clientName,
    business_type: bizType,
    ...currentCalculation
  };

  try {
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quotePayload)
    });
    const saved = await res.json();
    if (saved.success) {
      currentQuoteFolio = saved.data.folio;
      alert(`¡Cotización guardada exitosamente!\nFolio asignado: ${currentQuoteFolio}`);
      exportQuotePDF();
    }
  } catch (err) {
    alert('Error al guardar la cotización');
  }
}

function exportQuotePDF() {
  if (!currentCalculation) return;
  const clientName = document.getElementById('quoteClientName').value || 'Cliente General';
  const postData = {
    doc_type: 1, // Cotización comercial
    data: {
      folio: currentQuoteFolio || `TIK-COT-${Date.now().toString().slice(-5)}`,
      client_name: clientName,
      items: currentCalculation.items,
      subtotal: currentCalculation.subtotal,
      discount_amount: currentCalculation.discount_amount,
      discount_pct: currentCalculation.discount_pct,
      total: currentCalculation.total
    }
  };

  fetch('/api/documents/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  })
  .then(res => res.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cotizacion_${postData.data.folio}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

function exportQuoteJPG() {
  if (!currentCalculation) return;
  const clientName = document.getElementById('quoteClientName').value || 'Cliente General';
  const postData = {
    doc_type: 1,
    data: {
      folio: currentQuoteFolio || `TIK-COT-${Date.now().toString().slice(-5)}`,
      client_name: clientName,
      items: currentCalculation.items,
      subtotal: currentCalculation.subtotal,
      discount_amount: currentCalculation.discount_amount,
      discount_pct: currentCalculation.discount_pct,
      total: currentCalculation.total
    }
  };

  fetch('/api/documents/generate-jpg', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  })
  .then(res => res.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cotizacion_${postData.data.folio}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

function autoSuggestServices() {
  const type = document.getElementById('quoteBusinessType').value;
  const map = {
    'Restaurantes': 'srv-resenas',
    'Cafeterías': 'srv-wifi',
    'Barberías': 'srv-redes',
    'Estéticas': 'srv-resenas',
    'Hoteles': 'srv-wifi',
    'Consultorios': 'srv-tarjeta'
  };
  if (map[type]) {
    document.getElementById('quoteService').value = map[type];
    runQuoteCalculation();
  }
}

// --- 3. ASESOR COMERCIAL ---
async function loadAdvisorData() {
  const biz = document.getElementById('advisorBizSelect').value;
  try {
    const res = await fetch(`/api/advisor/recommend?business_type=${encodeURIComponent(biz)}`);
    const data = await res.json();
    if (data.success && data.data) {
      const d = data.data;
      let html = `
        <div style="background-color: var(--bg-sidebar); border-left: 3px solid var(--brand-blue); padding: 12px; margin-bottom: 14px; border-radius: 4px;">
          <strong style="color: #fff;">Argumento Comercial Recomendado:</strong>
          <p style="margin-top: 6px;">${d.pitch}</p>
        </div>
        <div style="margin-bottom: 12px;">
          <strong style="color: #fff; font-size: 11px; text-transform: uppercase;">Servicios Primarios Recomendados (${d.recommended_tier}):</strong>
          <ul style="margin-left: 20px; margin-top: 6px;">
            ${d.services.map(s => `<li><strong>${s.name}:</strong> ${s.summary}</li>`).join('')}
          </ul>
        </div>
        <div>
          <strong style="color: #fff; font-size: 11px; text-transform: uppercase;">Necesidades Clave a Resolver:</strong>
          <ul style="margin-left: 20px; margin-top: 6px;">
            ${d.primary_needs.map(n => `<li>${n}</li>`).join('')}
          </ul>
        </div>
      `;
      document.getElementById('advisorOutput').innerHTML = html;
    }
  } catch (err) {
    console.error('Error cargando asesor:', err);
  }
}

async function loadObjections() {
  try {
    const res = await fetch('/api/advisor/objections');
    const data = await res.json();
    if (data.success && data.all_objections) {
      const container = document.getElementById('objectionsList');
      container.innerHTML = data.all_objections.map(o => `
        <div style="background-color: var(--bg-sidebar); border: 1px solid var(--border-subtle); padding: 12px; border-radius: 6px;">
          <div style="font-weight: 700; color: var(--brand-amber); margin-bottom: 6px; font-size: 13px;">
            🗣️ "${o.objection}"
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">
            ${o.key_response}
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

// --- 4. MOTOR FINANCIERO ---
async function loadFinancialData() {
  try {
    const res = await fetch('/api/financial');
    const data = await res.json();
    if (data.success && data.data) {
      const f = data.data;
      document.getElementById('finHwCost').innerText = `$${f.hardware_total.toFixed(2)}`;
      document.getElementById('finOpCost').innerText = `$${f.operational_total.toFixed(2)}`;
      document.getElementById('finTotalCost').innerText = `$${f.total_unit_cost.toFixed(2)}`;
      document.getElementById('finMarginVal').innerText = `${f.unit_gross_margin_pct.toFixed(1)}%`;

      // Tabla de costos
      const tbody = document.getElementById('finCostTableBody');
      const allCosts = [
        ...(f.hardware_costs || []).map(c => ({ ...c, cat: 'Hardware' })),
        ...(f.operational_costs || []).map(c => ({ ...c, cat: 'Operativo' }))
      ];
      tbody.innerHTML = allCosts.map(c => `
        <tr>
          <td><strong>${c.item}</strong></td>
          <td>${c.cat}</td>
          <td>$${Number(c.unit_cost).toFixed(2)} MXN</td>
          <td><span class="badge badge-provisional">${c.status || 'PROVISIONAL'}</span></td>
        </tr>
      `).join('');

      runFinSim();
    }
  } catch (err) {
    console.error(err);
  }
}

async function runFinSim() {
  const qty = document.getElementById('simQty').value || 1;
  const price = document.getElementById('simPrice').value || 299;
  const discount = document.getElementById('simDiscount').value || 0;

  try {
    const res = await fetch('/api/financial/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: qty, unit_price: price, discount_pct: discount })
    });
    const data = await res.json();
    if (data.success && data.data) {
      const s = data.data;
      document.getElementById('simResults').innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <span>Ingreso Total:</span>
          <strong>$${s.total_revenue.toFixed(2)} MXN</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <span>Costo Total:</span>
          <strong>$${s.total_cost.toFixed(2)} MXN</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <span>Utilidad Proyectada:</span>
          <strong style="color: var(--brand-emerald);">$${s.total_profit.toFixed(2)} MXN</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
          <span>Margen Porcentual Bruto:</span>
          <strong>${s.margin_percentage.toFixed(1)}%</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 12px;">
          <span>Markup (Sobre Costo):</span>
          <strong>${s.markup_percentage.toFixed(1)}%</strong>
        </div>
        ${s.warning ? `<div style="margin-top: 10px; padding: 8px; border-radius: 4px; background-color: rgba(244, 63, 94, 0.15); color: var(--brand-rose); font-size: 11px;">⚠️ ${s.warning}</div>` : ''}
      `;
    }
  } catch (err) {
    console.error(err);
  }
}

// --- 5. GARANTÍAS ---
async function loadWarranties() {
  try {
    const res = await fetch('/api/warranties');
    const data = await res.json();
    if (data.success && data.data) {
      const tbody = document.getElementById('warrantiesTableBody');
      tbody.innerHTML = data.data.map(w => `
        <tr>
          <td><strong style="color: var(--brand-blue);">${w.folio}</strong></td>
          <td>${w.client_name}</td>
          <td>${w.product_name} (${w.quantity})</td>
          <td>${w.delivery_date}</td>
          <td>${w.warranty_end_date}</td>
          <td><span class="badge ${w.status === 'VIGENTE' ? 'badge-official' : 'badge-provisional'}">${w.status}</span></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="downloadWarrantyPDF('${w.id}')">PDF</button>
            <button class="btn btn-secondary btn-sm" onclick="downloadWarrantyJPG('${w.id}')">JPG</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

async function createWarranty() {
  const client = document.getElementById('warClient').value.trim();
  const phone = document.getElementById('warPhone').value.trim();
  const order = document.getElementById('warOrder').value.trim();

  if (!client) {
    alert('Ingresa el nombre del cliente');
    return;
  }

  try {
    const res = await fetch('/api/warranties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: client,
        client_phone: phone,
        order_id: order || 'ORD-TIK-01'
      })
    });
    const data = await res.json();
    if (data.success) {
      alert(`Póliza registrada con éxito:\nFolio: ${data.data.folio}\nVigencia: 30 días.`);
      loadWarranties();
      downloadWarrantyPDF(data.data.id);
    }
  } catch (err) {
    alert('Error al registrar la garantía');
  }
}

function downloadWarrantyPDF(id) {
  fetch('/api/documents/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doc_type: 7, // Garantía
      data: { folio: id, client_name: 'Póliza de Garantía Oficial' }
    })
  })
  .then(r => r.blob())
  .then(blob => {
    const u = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `Garantia_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

function downloadWarrantyJPG(id) {
  fetch('/api/documents/generate-jpg', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doc_type: 7,
      data: { folio: id, client_name: 'Póliza de Garantía Oficial' }
    })
  })
  .then(r => r.blob())
  .then(blob => {
    const u = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `Garantia_${id}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

// --- 6. DOCUMENTOS (16 FORMATOS) ---
async function loadDocTypes() {
  try {
    const res = await fetch('/api/documents/types');
    const data = await res.json();
    if (data.success && data.data) {
      const container = document.getElementById('docTypesGrid');
      container.innerHTML = Object.entries(data.data).map(([num, d]) => `
        <div class="doc-card">
          <div>
            <div class="doc-number">DOCUMENTO ${String(num).padStart(2, '0')}</div>
            <div class="doc-name">${d.title}</div>
          </div>
          <div style="display: flex; gap: 6px; margin-top: 10px;">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="generateGenericDoc(${num}, 'pdf')">PDF</button>
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="generateGenericDoc(${num}, 'jpg')">JPG</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

function generateGenericDoc(typeNum, format) {
  const url = format === 'pdf' ? '/api/documents/generate-pdf' : '/api/documents/generate-jpg';
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doc_type: typeNum,
      data: {
        folio: `TIK-DOC-${Date.now().toString().slice(-5)}`,
        client_name: 'Cliente Comercial TIK'
      }
    })
  })
  .then(r => r.blob())
  .then(blob => {
    const u = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = `Documento_${typeNum}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

// --- 7. BASE DE CONOCIMIENTO (A - U) ---
async function loadKnowledgeData() {
  const filter = document.getElementById('kbFilterStatus').value;
  let url = '/api/knowledge';
  if (filter) url += `?status=${filter}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.success && data.data) {
      const tbody = document.getElementById('kbTableBody');
      tbody.innerHTML = data.data.map(k => `
        <tr>
          <td><strong style="color: var(--brand-blue);">${k.section}</strong></td>
          <td><strong>${k.title}</strong><div style="font-size: 11px; color: var(--text-muted);">${k.summary}</div></td>
          <td>${k.category}</td>
          <td><span class="badge ${k.status === 'OFICIAL' ? 'badge-official' : (k.status === 'PROVISIONAL' ? 'badge-provisional' : 'badge-rule')}">${k.status}</span></td>
          <td>${k.certainty_level}</td>
          <td>
            ${k.status === 'PROVISIONAL' ? `<button class="btn btn-success btn-sm" onclick="confirmKnowledgeOfficial('${k.id}')">✓ Confirmar</button>` : `<span style="color: var(--brand-emerald); font-size: 11px;">Oficial</span>`}
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

async function confirmKnowledgeOfficial(id) {
  if (!confirm('¿Deseas confirmar formalmente este dato como POLÍTICA OFICIAL de TIK Smart Displays?')) return;
  try {
    const res = await fetch(`/api/knowledge/${id}/confirm`, { method: 'PATCH' });
    const data = await res.json();
    if (data.success) {
      alert('Dato actualizado como Oficial Confirmado.');
      loadKnowledgeData();
      loadAuditLogs();
    }
  } catch (err) {
    alert('Error al confirmar dato');
  }
}

// --- 8. CLIENTES ---
async function loadClients() {
  try {
    const res = await fetch('/api/admin/clients');
    const data = await res.json();
    if (data.success && data.data) {
      const tbody = document.getElementById('clientsTableBody');
      tbody.innerHTML = data.data.map(c => `
        <tr>
          <td><strong>${c.business_name}</strong></td>
          <td>${c.contact_name}</td>
          <td>${c.business_type}</td>
          <td>${c.branches_count || 1} sucursal(es)</td>
          <td>${c.phone}</td>
          <td>${c.city}</td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

// --- 9. CONFIGURACIÓN Y AUDITORÍA ---
async function loadAuditLogs() {
  try {
    const res = await fetch('/api/admin/audit-logs');
    const data = await res.json();
    if (data.success && data.data) {
      const container = document.getElementById('auditLogsContainer');
      container.innerHTML = data.data.map(l => `
        <div style="font-size: 11px; padding: 8px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between;">
          <div>
            <strong style="color: var(--brand-blue);">${l.action}</strong> | ${l.entity}
            <div style="color: var(--text-muted);">${l.details}</div>
          </div>
          <div style="color: var(--text-muted); font-size: 10px;">${l.timestamp.split('T')[1].slice(0, 5)}</div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

async function saveSettings() {
  const provider = document.getElementById('setAiProvider').value;
  const apiKey = document.getElementById('setApiKey').value;
  const pin = document.getElementById('setPin').value;

  try {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner_pin: pin,
        updates: {
          ai_provider: provider,
          ...(apiKey ? { [`${provider}_api_key`]: apiKey } : {})
        }
      })
    });
    const data = await res.json();
    if (data.success) {
      alert('Configuración guardada correctamente.');
      loadAuditLogs();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (err) {
    alert('Error al guardar configuración');
  }
}

async function showQuickModal(action) {
  if (action === 'backup') {
    try {
      const res = await fetch('/api/admin/backup', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(`Respaldo creado con éxito:\n${data.data.filename}\nFecha: ${data.data.timestamp}`);
        loadAuditLogs();
      }
    } catch (err) {
      alert('Error al generar respaldo');
    }
  }
}
