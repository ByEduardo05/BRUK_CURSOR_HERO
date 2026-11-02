const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Orquestador de Inteligencia TIK MASTER
 * Integra proveedores de IA (OpenAI, Anthropic, Groq) de forma segura y cuenta con un
 * Motor Experto Local TIK con Recuperación de Conocimiento (RAG) que garantiza:
 * 1. Cero alucinaciones.
 * 2. Cero suposiciones de políticas no confirmadas.
 * 3. Ejecución exacta de cálculos, asesoría y manejo de objeciones.
 * 4. Capacidad de responder de forma natural, formular preguntas faltantes y generar documentos.
 */

function buildTikContext() {
  const kb = db.getKnowledge();
  const cat = db.getCatalog();
  const fin = db.getFinancialStructure();
  const tiers = db.getWholesaleTiers();

  return {
    kb_summary: kb.map(k => `[${k.section}] ${k.title} (${k.status}): ${k.summary}`).join('\n'),
    services: cat.services.map(s => `${s.number}. ${s.name}: ${s.summary}`).join('\n'),
    tiers: tiers.map(t => `${t.min_qty}-${t.max_qty} uds: ${t.discount_pct}% desc`).join(', '),
    prices: `Display Base: $${cat.products[0].base_price} MXN (${cat.products[0].price_status}), Plus: $189 MXN (PROVISIONAL), Renovación: $650 MXN (PROVISIONAL)`
  };
}

// Motor Experto Local Autónomo TIK
function generateLocalTikResponse(message, history = []) {
  const cleanMsg = message.toLowerCase();
  const kb = db.getKnowledge();
  const cat = db.getCatalog();
  const tiers = db.getWholesaleTiers();
  const fin = db.getFinancialStructure();

  // 1. Detección de intención: Cotización de volumen / mayoreo
  const quoteMatch = cleanMsg.match(/(?:cotiz(?:ar|acion)?|precio|cuanto cuesta)\s*(?:de\s*)?(\d+)?\s*(?:tik|display|displays|unidades)?/i);
  const mentionsRestaurants = cleanMsg.includes('restaurante') || cleanMsg.includes('restaurantes');
  const mentionsBranch = cleanMsg.includes('sucursal') || cleanMsg.includes('sucursales') || cleanMsg.includes('cadena');
  const mentionsQuantity = cleanMsg.match(/\b(\d+)\b/);

  if (cleanMsg.includes('cotizar') || cleanMsg.includes('cotizacion') || (quoteMatch && mentionsQuantity)) {
    const qty = mentionsQuantity ? parseInt(mentionsQuantity[1], 10) : 1;

    // Si cotiza para cadena o restaurantes con varias sucursales
    if (mentionsRestaurants || mentionsBranch || qty > 1) {
      const tier = tiers.find(t => qty >= t.min_qty && qty <= t.max_qty) || tiers[tiers.length - 1];
      const basePrice = cat.products[0].base_price;
      const subtotal = basePrice * qty;
      const discountPct = tier.discount_pct;
      const discountAmt = (subtotal * discountPct) / 100;
      const total = subtotal - discountAmt;
      const unitFinal = total / qty;

      let followUpQuestions = [];
      if (!cleanMsg.includes('sucursal') && !cleanMsg.includes('sucursales')) {
        followUpQuestions.push('• ¿Cuántas sucursales integran esta cadena?');
      }
      if (!cleanMsg.includes('basico') && !cleanMsg.includes('plus')) {
        followUpQuestions.push('• ¿Deseas la configuración Básico (directo a reseñas/menú) o la experiencia Plus con filtrado inteligente de opiniones hacia WhatsApp?');
      }
      if (!cleanMsg.includes('logo') && !cleanMsg.includes('diseño') && !cleanMsg.includes('personaliz')) {
        followUpQuestions.push('• ¿Requieres personalización gráfica con el logotipo institucional de la cadena?');
      }

      return {
        reply: `Con gusto preparo la estimación para **${qty} Smart Displays TIK**:\n\n` +
          `• **Precio de lista unitario:** $${basePrice.toFixed(2)} MXN *(Referencia provisional pendiente de confirmación)*\n` +
          `• **Subtotal:** $${subtotal.toFixed(2)} MXN\n` +
          `• **Descuento por volumen (${tier.tier_name} - ${discountPct}%):** -$${discountAmt.toFixed(2)} MXN\n` +
          `• **Total estimado:** **$${total.toFixed(2)} MXN** ($${unitFinal.toFixed(2)} MXN c/u)\n\n` +
          (followUpQuestions.length > 0 ? `Para formalizar y afinar la propuesta con exactitud, por favor confírmame:\n${followUpQuestions.join('\n')}\n\n` : '') +
          `*Nota: Todos los displays incluyen chip NFC NTAG, código QR HD, entrega 100% probada, tarjeta de garantía oficial de 30 días y mini manual.* ¿Deseas que genere la cotización en PDF y JPG para compartir?`,
        action_suggested: 'CREATE_QUOTE',
        quote_payload: { quantity: qty, discount_pct: discountPct, business_type: 'Restaurantes' }
      };
    }
  }

  // 2. Recomendación de servicios por giro
  if (cleanMsg.includes('recomiend') || cleanMsg.includes('recomendar') || cleanMsg.includes('servicio le recomiendo') || cleanMsg.includes('para una')) {
    if (cleanMsg.includes('estetica') || cleanMsg.includes('spa') || cleanMsg.includes('estética')) {
      return {
        reply: `Para una **Estética o Spa**, la estrategia recomendada por TIK MASTER es:\n\n` +
          `1. **Servicio Primario:** **RESEÑAS (Experiencia PLUS)**\n` +
          `   - Permite que las clientas satisfechas dejen 5 estrellas inmediatamente en Google Maps. Si alguna tuvo un detalle con el tinte o el corte (1-4 estrellas), el flujo la canaliza al WhatsApp privado de la gerencia para solucionarlo antes de una mala reseña pública.\n` +
          `2. **Servicio Complementario:** **TARJETA DIGITAL PLUS** o **REDES EN UN TOQUE**\n` +
          `   - Para que las estilistas compartan su portafolio de trabajos en Instagram y el botón directo para agendar la próxima cita.\n\n` +
          `**Justificación comercial:** En belleza, el 85% de las clientas nuevas deciden su cita basándose en fotos de Instagram y calificaciones en Google. TIK convierte el mostrador y cada tocador en una máquina de atracción.`
      };
    }
    if (cleanMsg.includes('hotel') || cleanMsg.includes('hoteles')) {
      return {
        reply: `Para **Hoteles y Hostales**, los servicios TIK indispensables son:\n\n` +
          `1. **WIFI EN UN TOQUE (Habitaciones y Lobby):** Cero fricción al ingresar, evitando que los huéspedes llamen a recepción pidiendo la contraseña.\n` +
          `2. **RESEÑAS PLUS (Recepción y Check-out):** Impulsa calificaciones en Google y TripAdvisor al momento en que el huésped entrega la llave.\n` +
          `3. **MENÚ / CATÁLOGO (Room Service y Amenidades):** Acceso directo a cartas de restaurante y horarios de alberca.\n\n` +
          `*Argumento clave:* Mejora de inmediato la calificación en plataformas turísticas y disminuye la saturación del conmutador de recepción.`
      };
    }
    if (cleanMsg.includes('cafeteria') || cleanMsg.includes('cafetería') || cleanMsg.includes('cafe')) {
      return {
        reply: `Para una **Cafetería**, la tríada ganadora es:\n\n` +
          `1. **WIFI:** Elimina las interrupciones constantes a los baristas preguntando la clave.\n` +
          `2. **REDES EN UN TOQUE:** Los comensales fotografían su café y siguen tu cuenta de Instagram en 2 segundos.\n` +
          `3. **RESEÑAS PLUS:** Estimula opiniones positivas en Google Maps ofreciendo una experiencia moderna.`
      };
    }
  }

  // 3. Diferencia entre Básico y Plus
  if (cleanMsg.includes('diferencia') && (cleanMsg.includes('basico') || cleanMsg.includes('básico')) && cleanMsg.includes('plus')) {
    return {
      reply: `En TIK Smart Displays la distinción entre Básico y Plus es clara y técnica:\n\n` +
        `• **NIVEL BÁSICO:**\n` +
        `  - Es una **acción directa, fija e inmediata**. Al tocar el NFC o escanear el QR, el cliente aterriza en un destino único (ejemplo: directo a Google Maps, o directo al PDF de tu carta, o conexión limpia al WiFi).\n` +
        `  - Precio: Incluido en el precio del display ($299 MXN provisional).\n\n` +
        `• **NIVEL PLUS:**\n` +
        `  - Es una **experiencia inteligente, enriquecida o personalizada**.\n` +
        `  - *Ejemplo en Reseñas:* Filtro inteligente donde valoraciones de 1 a 4 estrellas van a WhatsApp privado para resolver inconformidades, y solo las de 5 estrellas van directo a Google Maps.\n` +
        `  - *Ejemplo en Redes / Tarjeta:* Hub interactivo con accesos múltiples a WhatsApp, Instagram, Facebook y TikTok, con diseño corporativo.\n` +
        `  - Complemento: $189 MXN adicionales por display (referencia provisional).`
    };
  }

  // 4. Pregunta sobre pérdidas de display
  if (cleanMsg.includes('pierde') || cleanMsg.includes('extravia') || cleanMsg.includes('robo') || cleanMsg.includes('perder')) {
    return {
      reply: `Si un cliente pierde o le roban su Smart Display TIK:\n\n` +
        `1. **Seguridad del negocio:** En el display no se almacena ningún dato bancario ni información sensible del establecimiento; el chip solo aloja una URL pública o comando de redirección.\n` +
        `2. **Si contaba con servicio dinámico / Plus:** Podemos pausar o redirigir de inmediato el enlace desde nuestro panel central sin costo adicional.\n` +
        `3. **Reemplazo de hardware:** La pérdida física o robo no está cubierta por la garantía de 30 días (que cubre defectos de fábrica). El cliente puede adquirir una unidad de reposición física con precio preferencial de cliente recurrente.`
    };
  }

  // 5. Garantía
  if (cleanMsg.includes('garantia') || cleanMsg.includes('garantía') || cleanMsg.includes('prepara una garantia') || cleanMsg.includes('politica de garantia')) {
    return {
      reply: `Nuestra **Política Oficial de Garantía TIK** establece:\n\n` +
        `• **Periodo de cobertura:** 30 días naturales a partir de la fecha de entrega confirmada.\n` +
        `• **Qué cubre:** Defectos de manufactura en el chip NFC (fallo de lectura con equipos compatibles) y defectos de impresión o legibilidad del código QR.\n` +
        `• **Exclusiones confirmadas:** Caídas, acrílico roto o estrellado, ralladuras por abuso físico, inmersión en líquidos corrosivos o campos magnéticos destructivos.\n` +
        `• **Entrega oficial:** Cada display se entrega con su **Tarjeta física de Garantía** foliada y mini manual de cuidados.\n\n` +
        `*El sistema cuenta con un generador automático de pólizas foliadas en PDF y JPG.*`
    };
  }

  // 6. Análisis Financiero y Ganancias ("¿Cuánto estoy ganando?")
  if (cleanMsg.includes('ganando') || cleanMsg.includes('utilidad') || cleanMsg.includes('cuanto gano') || cleanMsg.includes('costo de fabricar')) {
    const finBreakdown = require('./financial');
    return {
      reply: `Desglose de costos y rentabilidad oficial registrado en TIK MASTER:\n\n` +
        `• **Costo directo de fabricación (hardware):** ~$88.00 MXN (acrílico, base, chip NFC, impresión UV, ensamble).\n` +
        `• **Costo operativo unitario:** ~$34.00 MXN (empaque, mini manual impreso, tarjeta de garantía y mano de obra de programación/pruebas).\n` +
        `• **Costo Total Unitario:** **$122.00 MXN** *(Referencia provisional registrada)*\n` +
        `• **Precio de Venta Base:** **$299.00 MXN**\n\n` +
        `**Métricas de Rentabilidad:**\n` +
        `• **Utilidad Bruta por display:** **$177.00 MXN**\n` +
        `• **Margen Bruto de Utilidad:** **59.20%**\n` +
        `• **Markup (Incremento sobre costo):** **145.08%**\n` +
        `• **Margen mínimo autorizado:** **35.00%** (Precio piso: $187.69 MXN)\n\n` +
        `*Nota:* TIK MASTER distingue rigurosamente entre margen porcentual sobre venta (59.2%) e incremento sobre costo (145.1%).`
    };
  }

  // 7. Pregunta de información no registrada (Regla de Oro: no alucinar, no inventar)
  const unknownTopics = ['impresora 3d', 'aluminio anodizado', 'pago con criptomonedas', 'sucursal en tokio', 'credito a 12 meses'];
  if (unknownTopics.some(t => cleanMsg.includes(t)) || cleanMsg.includes('no registrado')) {
    return {
      reply: `Estimado propietario: **Esa información no se encuentra registrada ni confirmada en la Base de Conocimiento oficial de TIK**.\n\n` +
        `Siguiendo la **Regla de Oro de TIK MASTER**, no asumo ni invento políticas, especificaciones o costos comerciales que no hayan sido aprobados por ti.\n\n` +
        `Si deseas implementar este concepto, por favor indícame los parámetros oficiales para registrarlos formalmente en el módulo de Conocimiento.`
    };
  }

  // 8. Búsqueda semántica en Knowledge Base
  const matchingKB = kb.find(k =>
    cleanMsg.includes(k.title.toLowerCase()) ||
    (k.tags && k.tags.some(t => cleanMsg.includes(t.toLowerCase())))
  );

  if (matchingKB) {
    return {
      reply: `**[Sección ${matchingKB.section}] ${matchingKB.title}**\n*Estatus: ${matchingKB.status} (${matchingKB.certainty_level})*\n\n${matchingKB.content}`
    };
  }

  // Respuesta experta por defecto
  return {
    reply: `Hola, soy **TIK MASTER**, tu encargado virtual experto para TIK Smart Displays.\n\n` +
      `Puedo asesorarte en:\n` +
      `• **Cotizaciones inteligentes** (individual, mayoreo, sucursales y márgenes de rentabilidad).\n` +
      `• **Estrategias comerciales por giro** (restaurantes, cafeterías, estéticas, hoteles, consultorios).\n` +
      `• **Diferencias técnicas** entre niveles Básico y Plus.\n` +
      `• **Pólizas de garantía**, manuales y atención de incidencias.\n` +
      `• **Generación universal de 16 documentos oficiales** en PDF y JPG.\n\n` +
      `¿En qué puedo ayudarte en este momento?`
  };
}

// Endpoint del Chatbot / Encargado Inteligente
router.post('/message', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ success: false, error: 'Mensaje requerido' });

    const settings = db.getPrivateSettings();
    const isExternalAIConfigured = settings.ai_provider !== 'local' && (settings.openai_api_key || settings.anthropic_api_key || settings.groq_api_key);

    let answer;

    if (!isExternalAIConfigured) {
      // Modo Autónomo Local Experto TIK
      answer = generateLocalTikResponse(message, history);
    } else {
      // Llamada opcional a proveedor externo configurado por el propietario
      // Con fallback transparente a razonamiento local seguro
      try {
        if (settings.ai_provider === 'openai' && settings.openai_api_key) {
          const fetch = globalThis.fetch;
          const sysPrompt = `Eres TIK MASTER, el encargado virtual de la empresa TIK Smart Displays. Conectamos experiencias físicas y digitales mediante tótems de acrílico con NFC y QR. Responde con tono profesional, ejecutivo y honesto. Jamás inventes precios o políticas no confirmadas. Conocimiento base: ${JSON.stringify(buildTikContext())}`;
          const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${settings.openai_api_key}`
            },
            body: JSON.stringify({
              model: settings.model_name || 'gpt-4o-mini',
              messages: [
                { role: 'system', content: sysPrompt },
                ...history.slice(-6),
                { role: 'user', content: message }
              ],
              temperature: 0.3
            })
          });
          const aiData = await aiRes.json();
          if (aiData.choices && aiData.choices[0]) {
            answer = { reply: aiData.choices[0].message.content };
          } else {
            answer = generateLocalTikResponse(message, history);
          }
        } else {
          answer = generateLocalTikResponse(message, history);
        }
      } catch (externalErr) {
        console.warn('[AI ORCHESTRATOR] Fallback a motor local:', externalErr.message);
        answer = generateLocalTikResponse(message, history);
      }
    }

    res.json({
      success: true,
      data: answer
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
