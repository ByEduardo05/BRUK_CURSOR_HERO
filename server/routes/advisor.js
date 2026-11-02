const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener recomendaciones por tipo de negocio
router.get('/recommend', (req, res) => {
  const { business_type, goal } = req.query;
  const knowledge = db.getKnowledge();
  const catalog = db.getCatalog();
  const seed = require('../seedData');

  const bizTypes = seed.business_types || [];
  let found = null;

  if (business_type) {
    const q = business_type.toLowerCase();
    found = bizTypes.find(b => b.type.toLowerCase().includes(q) || q.includes(b.type.toLowerCase()));
  }

  if (!found) {
    // Si no coincide exactamente con uno predeterminado, responder con análisis inteligente
    return res.json({
      success: true,
      matched: false,
      message: `Giro comercial analizado dinámicamente`,
      recommendation: {
        business_type: business_type || 'General Comercial',
        recommended_tier: 'PLUS',
        primary_services: [
          catalog.services.find(s => s.id === 'srv-resenas'),
          catalog.services.find(s => s.id === 'srv-redes')
        ],
        pitch: `Para cualquier establecimiento comercial que atienda clientes físicos, el objetivo primordial es capitalizar las visitas convirtiéndolas en reseñas de 5 estrellas en Google y seguidores orgánicos en redes sociales.`,
        suggested_addons: ['addon-plus']
      },
      available_profiles: bizTypes.map(b => b.type)
    });
  }

  // Mapear los servicios recomendados
  const detailedServices = found.recommended_services.map(id =>
    catalog.services.find(s => s.id === id) || { id, name: id }
  );

  const detailedAddons = (found.potential_addons || []).map(id =>
    catalog.add_ons.find(a => a.id === id) || { id, name: id }
  );

  res.json({
    success: true,
    matched: true,
    data: {
      business_type: found.type,
      primary_needs: found.primary_needs,
      recommended_tier: found.recommended_tier,
      pitch: found.pitch,
      services: detailedServices,
      addons: detailedAddons
    }
  });
});

// Consultar manejo de objeciones comerciales
router.get('/objections', (req, res) => {
  const { query } = req.query;
  const secR = db.getKnowledgeById('sec-r');

  const standardObjections = [
    {
      objection: 'Está muy caro',
      key_response: 'TIK no es solo un acrílico, es una máquina de captar clientes. Un display de $299 MXN que te consiga solo 10 reseñas de 5 estrellas en Google posiciona tu local sobre tu competencia. Una sola mesa o cliente extra paga el display 3 veces. ¿Vale la pena invertir menos de $10 al día el primer mes para dominar tu zona?'
    },
    {
      objection: 'Ya tengo un código QR impreso en un papel',
      key_response: 'El papel se ensucia, se arruga y transmite descuido. Con TIK tienes la elegancia del acrílico premium y la inmediatez del NFC: solo tocas y abre. Y quien no use NFC, tiene el QR impecable de respaldo.'
    },
    {
      objection: '¿Para qué necesito NFC si ya todo mundo usa QR?',
      key_response: 'El NFC es la experiencia del futuro hoy. Reduce el tiempo a un solo toque, sin abrir cámara ni lidiar con mala luz. Da una experiencia tecnológica que sorprende a tus clientes y los hace hablar de tu negocio.'
    },
    {
      objection: 'Ya tengo redes sociales activas',
      key_response: 'Excelente, pero el 90% de los clientes que entran a tu local se van sin seguirte porque buscarlos en Instagram toma tiempo. Con TIK lo hacen en 2 segundos mientras esperan su cuenta.'
    },
    {
      objection: '¿Qué pasa si cambio mi número de WhatsApp o mi carta?',
      key_response: 'Por eso ofrecemos el servicio Plus o gestión dinámica: el display se mantiene intacto y nosotros actualizamos la ruta en la nube para que nunca pierdas tu inversión.'
    }
  ];

  if (query) {
    const q = query.toLowerCase();
    const matched = standardObjections.find(o => o.objection.toLowerCase().includes(q) || q.includes(o.objection.toLowerCase()));
    if (matched) {
      return res.json({ success: true, match: true, data: matched });
    }
  }

  res.json({
    success: true,
    all_objections: standardObjections,
    full_guide: secR ? secR.content : ''
  });
});

module.exports = router;
