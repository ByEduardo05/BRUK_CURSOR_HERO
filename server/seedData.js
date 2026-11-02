/**
 * TIK MASTER - Datos Semilla Iniciales
 * Contiene todo el conocimiento empresarial oficial y referencias provisionales iniciales.
 * Cumple con la Regla de Oro: diferenciar con exactitud lo oficial de lo provisional y pendiente.
 */

const SEED_DATA = {
  // 1. Identidad y configuración general
  business: {
    name: "TIK Smart Displays",
    tagline: "Conectamos experiencias físicas con digitales mediante NFC y QR",
    currency: "MXN",
    owner_name: "Propietario TIK",
    support_phone: "+52 55 0000 0000",
    support_email: "contacto@tiksmartdisplays.com",
    address: "Ciudad de México, México",
    website: "https://tiksmartdisplays.com"
  },

  // 2. Base de Conocimiento estructurada (Secciones A - U)
  knowledge_base: [
    {
      id: "sec-a",
      section: "A",
      category: "Identidad",
      title: "Identidad y filosofía de TIK",
      status: "OFICIAL", // OFICIAL, PROVISIONAL, PENDIENTE, HISTORICO, REGLA_PROPIETARIO
      certainty_level: "CONFIRMADO",
      summary: "TIK Smart Displays conecta puntos de contacto físicos en el mundo real con flujos y activos digitales instantáneos.",
      content: `TIK Smart Displays es una marca innovadora enfocada en cerrar la brecha entre el espacio físico del negocio y su ecosistema digital. Creemos que la fricción para interactuar con una marca debe ser cero: con un toque NFC o escaneo de código QR, el cliente accede de inmediato a reseñas, redes, menús, pagos y servicios sin necesidad de descargar aplicaciones complejas.`,
      tags: ["identidad", "filosofia", "mision", "propuesta"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-b",
      section: "B",
      category: "Identidad",
      title: "Historia y propuesta de valor",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "La propuesta de valor radica en la inmediatez, elegancia del acrílico y la garantía de entrega 100% configurado.",
      content: `Frente a códigos QR de papel arrugados o links olvidados, TIK ofrece un tótem elegante de acrílico de alta durabilidad con doble tecnología: chip NFC ultrarrápido y código QR de alta legibilidad. La propuesta de valor incluye que el display se entrega listo para usar, probado y garantizado, eliminando toda complicación técnica para el comerciante.`,
      tags: ["historia", "propuesta de valor", "ventaja competitiva"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-c",
      section: "C",
      category: "Productos",
      title: "Productos y formatos físicos",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Modelo oficial: Acrílico vertical 10x15 cm con base de soporte, NFC integrado y QR obligatorio.",
      content: `Modelo Inicial Oficial:
- Material: Acrílico premium de alta resistencia, acabado pulido.
- Orientación: Vertical.
- Medidas: 10 × 15 cm.
- Base: Soporte de acrílico sólido para mostrador/mesa.
- Tecnología integrada: Chip NFC NTAG de alta sensibilidad embebido + Código QR serigrafiado o impreso en alta definición.
- Reglas inquebrantables de producto:
  1. Siempre debe incluir NFC y QR de forma complementaria.
  2. Se entrega completamente configurado con la URL/flujo acordado.
  3. Se comprueba su lectura física NFC y escaneo QR antes del despacho.
  4. Siempre incluye tarjeta física de garantía.
  5. Siempre incluye mini manual de recomendaciones de cuidado y uso.
  6. Se entrega 100% listo para utilizar.`,
      tags: ["producto", "acrilico", "medidas", "nfc", "qr", "formato"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-d",
      section: "D",
      category: "Servicios",
      title: "Catálogo oficial de los 8 servicios",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Los 8 servicios oficiales: Reseñas, Redes en un toque, Menú/Catálogo, WiFi, Tarjeta Digital, Delivery, Pagos, Factura.",
      content: `TIK opera bajo 8 servicios oficiales estructurados:
1. RESEÑAS: Acceso inmediato a reseñas y calificaciones en plataformas (Google Maps, TripAdvisor).
2. REDES EN UN TOQUE: Conexión centralizada a WhatsApp, Instagram, Facebook y TikTok.
3. MENÚ / CATÁLOGO: Acceso digital directo a productos, servicios y cartas interactivas.
4. WIFI: Conexión simplificada e inmediata a la red WiFi del establecimiento sin teclear contraseñas largas.
5. TARJETA DIGITAL: Compartir datos esenciales de contacto profesional (VCF) y enlaces corporativos.
6. DELIVERY: Enlace directo a plataformas de pedidos y despacho (UberEats, Didi, Rappi o delivery propio).
7. PAGOS: Pasarelas de cobro, terminales virtuales, cuentas CLABE o enlaces CoDi/Mercado Pago.
8. FACTURA: Acceso directo al portal o formulario de facturación electrónica CFDI para comensales/clientes.`,
      tags: ["servicios", "catalogo", "resenas", "redes", "menu", "wifi", "tarjeta", "delivery", "pagos", "factura"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-e",
      section: "E",
      category: "Técnica",
      title: "Características técnicas del hardware y software",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Chips NTAG213/215, rango de lectura 1-4cm, códigos QR dinámicos/estáticos según nivel.",
      content: `Hardware:
- Chips compatibles con el 99% de smartphones Android y iOS (iPhone XS en adelante lectura nativa en segundo plano).
- Rango de lectura NFC óptimo: 1 a 4 cm de distancia.
- Acrílico cristal óptico de 3mm con base termosellada/ensamblada.
Software / Enlace:
- Redirección HTTP/HTTPS con latencia menor a 1 segundo.
- Compatibilidad universal con navegadores móviles modernos.`,
      tags: ["hardware", "software", "compatibilidad", "nfc", "ntag"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-f",
      section: "F",
      category: "Servicios",
      title: "Niveles comerciales: BÁSICO vs PLUS",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Básico = 1 acción directa y sencilla. Plus = Experiencia personalizada, multi-enlace o filtrado inteligente.",
      content: `Diferencia estructural de niveles:
- BÁSICO:
  Acción directa, limpia y sencilla. Al acercar el teléfono o escanear el QR, el usuario aterriza directamente en el enlace destino único (ejemplo: directo a Google Maps, o directo al PDF del menú, o directo a la red WiFi).
- PLUS:
  Experiencia más completa, enriquecida y personalizada para el servicio.
  Ejemplos de Plus:
  * Reseñas Plus: Filtro inteligente donde valoraciones de 1 a 4 estrellas se dirigen al WhatsApp del propietario para resolver quejas en privado, y las de 5 estrellas van directo a Google Maps (sujeto a viabilidad técnica y políticas aplicables).
  * Tarjeta Digital Plus: Perfil web interactivo con redes sociales, botón de llamada, botón guardar en agenda y enlaces secundarios.
  * Menú Plus: Interfaz interactiva visual con categorías y enlaces a pedidos.`,
      tags: ["basico", "plus", "comparativa", "niveles"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-g",
      section: "G",
      category: "Precios",
      title: "Precios y políticas comerciales (Referencias iniciales)",
      status: "PROVISIONAL",
      certainty_level: "REQUIERE_CONFIRMACION",
      summary: "Display acrílico base: $299 MXN. Plus: $189 MXN. Renovación: $650 MXN. TIK Mini Web: $1,499 MXN. Dominio: $2,250 MXN.",
      content: `IMPORTANTE: Estos precios son valores de referencia iniciales provistos para arranque y deben ser confirmados/validados formalmente por el propietario antes de considerarse definitivos.
- Display Acrílico Básico: $299 MXN (Precio de lista unitario provisional).
- Complemento PLUS (por display o servicio): $189 MXN adicionales.
- Renovación anual de servicio cloud/hosting: $650 MXN (referencia de servicio activo).
- TIK Mini Web (Desarrollo web express integrado): $1,499 MXN referencia.
- Dominio personalizado anual: $2,250 MXN en ejemplo comercial de referencia.`,
      tags: ["precios", "tarifas", "provisional", "renovacion", "mini web"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-h",
      section: "H",
      category: "Finanzas",
      title: "Costos de fabricación de hardware",
      status: "PROVISIONAL",
      certainty_level: "REQUIERE_CONFIRMACION",
      summary: "Acrílico cortado, chip NFC, impresión UV/vinil, base y ensamble. Estimado base $65 - $95 MXN.",
      content: `Estructura de costos directos de manufactura (sujetos a confirmación con proveedores reales):
- Pieza de acrílico cristal 10x15cm cortada láser: ~$35.00 MXN.
- Base de acrílico termoformada/ensamble: ~$18.00 MXN.
- Etiqueta / Tag NFC NTAG213/215: ~$14.00 MXN.
- Impresión gráfica / Serigrafía / Vinil UV: ~$16.00 MXN.
- Materiales de ensamble y adhesivo industrial: ~$5.00 MXN.
Costo unitario directo promedio estimado: ~$88.00 MXN por display.`,
      tags: ["costos", "fabricacion", "acrilico", "nfc", "costo directo"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-i",
      section: "I",
      category: "Finanzas",
      title: "Costos operativos y empaque",
      status: "PROVISIONAL",
      certainty_level: "REQUIERE_CONFIRMACION",
      summary: "Empaque protector, mini manual impreso, tarjeta de garantía y mano de obra de configuración: ~$25 - $35 MXN.",
      content: `Costos operativos por unidad entregada:
- Empaque protector acolchado / caja individual: ~$12.00 MXN.
- Mini manual de usuario impreso: ~$4.00 MXN.
- Tarjeta física de garantía foliada: ~$3.00 MXN.
- Mano de obra de programación, vinculación NFC y prueba física: ~$15.00 MXN.
Costo operativo estimado por display: ~$34.00 MXN.
Costo total unitario estimado (Fabricación + Operativo): ~$122.00 MXN.`,
      tags: ["costos", "operativos", "empaque", "mano de obra", "configuracion"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-j",
      section: "J",
      category: "Finanzas",
      title: "Márgenes, rentabilidad y distinción de fórmulas",
      status: "REGLA_PROPIETARIO",
      certainty_level: "CONFIRMADO",
      summary: "Distinción estricta: Margen de utilidad = (Precio - Costo)/Precio * 100. Markup = (Precio - Costo)/Costo * 100.",
      content: `Reglas Financieras Obligatorias de TIK MASTER:
1. Utilidad Bruta = Precio de Venta - Costo Total Unitario.
2. Margen Bruto Porcentual = (Utilidad Bruta / Precio de Venta) * 100.
3. Incremento sobre costo (Markup) = (Utilidad Bruta / Costo Total Unitario) * 100.
Ejemplo con precio $299 MXN y costo $122 MXN:
- Utilidad Bruta = $177 MXN.
- Margen = 59.20%.
- Markup = 145.08%.
Margen mínimo obligatorio autorizado: 35%. Cualquier venta con margen inferior a 35% requiere autorización manual del propietario.`,
      tags: ["finanzas", "margen", "markup", "rentabilidad", "utilidad"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-k",
      section: "K",
      category: "Precios",
      title: "Políticas de mayoreo y descuentos por volumen",
      status: "REGLA_PROPIETARIO",
      certainty_level: "CONFIRMADO",
      summary: "Escalas de volumen: 1-4 unidades lista, 5-9 (-10%), 10-19 (-18%), 20-49 (-25%), 50+ (-32% o negociación).",
      content: `Escala oficial configurada para mayoreo de displays TIK:
- 1 a 4 unidades: Precio de lista ($299 MXN c/u).
- 5 a 9 unidades: 10% de descuento ($269.10 MXN c/u).
- 10 a 19 unidades: 18% de descuento ($245.18 MXN c/u).
- 20 a 49 unidades: 25% de descuento ($224.25 MXN c/u).
- 50+ unidades: 32% de descuento ($203.32 MXN c/u) o cotización institucional a la medida.
Regla de oro: Nunca inventar descuentos que no pertenezcan a la tabla sin solicitar autorización al propietario. Margen nunca inferior a 35%.`,
      tags: ["mayoreo", "volumen", "descuentos", "escalas"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-l",
      section: "L",
      category: "Garantías",
      title: "Políticas de garantías y cobertura",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "30 días de cobertura estándar sobre defectos de fábrica del chip NFC y código QR.",
      content: `Términos de la Garantía TIK:
- Cobertura de referencia estándar: 30 días naturales a partir de la fecha de entrega confirmada al cliente.
- Cobertura: Defectos en el chip NFC (imposibilidad de lectura con dispositivos compatibles) y desvanecimiento de código QR por defecto de impresión.
- Exclusiones confirmadas: Golpes, caídas, acrílico roto o estrellado, rayaduras profundas por mal uso, inmersión en agua o químicos abrasivos, chips dañados por microondas o campos electromagnéticos extremos.
- Entrega obligatoria: Cada display incluye su tarjeta de garantía foliada y fechada.
- Procedimiento: En caso de incidencia, el cliente contacta a soporte, se realiza diagnóstico en 24-48 horas hábiles y se reemplaza o reprograma sin costo si aplica.`,
      tags: ["garantia", "cobertura", "30 dias", "exclusiones", "politica"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-m",
      section: "M",
      category: "Soporte",
      title: "Soporte técnico y atención postventa",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Soporte básico gratuito de funcionamiento. Cambios de URL sujetos a nivel de servicio.",
      content: `El soporte técnico básico de funcionamiento es 100% gratuito:
- Verificación remota del enlace.
- Guía para el cliente de cómo activar NFC en su dispositivo.
- Asistencia en caso de cambios menores de enlaces durante los primeros 15 días.
- En servicios con QR dinámico o renovaciones activas, las modificaciones de destino se gestionan sin cargo dentro del plan contratado.`,
      tags: ["soporte", "atencion", "postventa", "gratuito"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-n",
      section: "N",
      category: "Operaciones",
      title: "Instalación, ubicación y configuración",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Recomendaciones de colocación estratégica en mostrador, cajas, mesas o recepción.",
      content: `Pautas de ubicación para máxima efectividad:
- Colocar a la altura de la vista o en el punto de contacto obligado (caja de cobro, mesa, recepción, barra).
- Evitar superficies metálicas directas sin aislante magnético (el metal absorbe ondas NFC; los displays TIK cuentan con base para alejar el tag de la mesa).
- Iluminación adecuada para que el código QR sea legible sin reflejos extremos.
- El mini manual detalla al comensal cómo acercar su teléfono (parte superior en iPhones, zona media/trasera en Android).`,
      tags: ["instalacion", "ubicacion", "operacion", "recomendaciones"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-o",
      section: "O",
      category: "Operaciones",
      title: "Proceso de entrega y recepción",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Checklist de entrega: probado en NFC, escaneado QR, mini manual y tarjeta de garantía foliada.",
      content: `Protocolo obligatorio antes de entregar cualquier display TIK:
1. Inspección visual: acrílico sin rayaduras, rebabas ni huellas.
2. Prueba de lectura NFC con al menos un teléfono iOS y un teléfono Android.
3. Prueba de lectura visual de código QR.
4. Verificación de que el destino abra en menos de 2 segundos.
5. Inclusión de tarjeta física de garantía con fecha y firma.
6. Inclusión de mini manual de usuario.
7. Firma de comprobante de entrega o confirmación digital del cliente.`,
      tags: ["entrega", "recepcion", "checklist", "calidad"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-p",
      section: "P",
      category: "Ventas",
      title: "Preguntas Frecuentes de Clientes (FAQ)",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Respuestas clave: ¿Requiere app? No. ¿Requiere batería? No. ¿Qué teléfonos lo leen? Prácticamente todos.",
      content: `FAQ Oficiales:
- ¿El cliente necesita descargar una app especial? No. El NFC abre automáticamente en el teléfono del cliente al acercarlo, y el QR se escanea con la cámara nativa.
- ¿El display necesita cargarse con batería o electricidad? No. Los chips NFC son pasivos y se alimentan magnéticamente de la antena del smartphone por milisegundos.
- ¿Qué pasa si cambio de número o de menú? Si contrataste nivel Plus o QR dinámico, podemos cambiar el enlace destino sin reemplazar el display físico. Si es Básico estático, se puede reprogramar en taller o requerir re-etiquetado.
- ¿Es resistente al agua? El acrílico tolera salpicaduras y limpieza con microfibra ligeramente húmeda. No sumergir.`,
      tags: ["faq", "preguntas frecuentes", "bateria", "app"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-q",
      section: "Q",
      category: "Ventas",
      title: "Argumentos de venta por beneficio tangible",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Incremento comprobado de reseñas en Google Maps de 3x a 5x, reducción de tiempos en caja, imagen moderna.",
      content: `Argumentos de alto impacto:
1. Reputación online y posicionamiento SEO local: Un negocio con 500 reseñas en Google Maps supera a toda su competencia local en búsquedas orgánicas. TIK convierte comensales felices en reseñas en menos de 5 segundos.
2. Profesionalismo y modernidad: Sustituye papelitos, notas plastificadas y cartones desgastados por un acrílico premium de alta estética.
3. Agilidad operativa: No perder tiempo deletreando la red WiFi o el WhatsApp del negocio.
4. ROI Inmediato: Un solo cliente fidelizado o una venta adicional por delivery recupera el valor completo del display.`,
      tags: ["argumentos", "beneficios", "ventas", "roi"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-r",
      section: "R",
      category: "Ventas",
      title: "Manejo experto de objeciones comerciales",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Respuestas estructuradas para: 'Está muy caro', 'Ya tengo QR', '¿Para qué NFC?', 'Ya tengo redes', etc.",
      content: `Guía para superar objeciones:
1. Objeción: 'Está muy caro'.
   Respuesta: 'Te comprendo. Si fuera solo un pedazo de plástico, sería caro. Pero TIK es un canal de captación automática de clientes y reseñas. Un display de $299 MXN que te consigue solo 10 reseñas de 5 estrellas al mes te posiciona en el top de Google Maps de tu zona. Una sola mesa adicional que te visite por esa reputación paga el display 3 veces. ¿Vale la pena invertir menos de $10 al día el primer mes por dominar tu zona?'.
2. Objeción: 'Ya tengo un código QR impreso en un papel'.
   Respuesta: 'El papel se arruga, se ensucia con grasa o salsas y transmite descuido. Además, muchos clientes no quieren abrir la cámara o no enfocan bien. Con TIK tienes la elegancia del acrílico premium y la inmediatez del NFC: solo tocas y listo. Quien no use NFC, tiene el QR impecable de respaldo'.
3. Objeción: '¿Para qué necesito NFC si ya todo mundo conoce el QR?'.
   Respuesta: 'El NFC es la experiencia del futuro hoy. Reduce el tiempo a un solo toque, sin abrir cámara ni enfocar con poca luz. Da una experiencia tecnológica que sorprende a tus clientes y los hace hablar de tu negocio'.
4. Objeción: 'Ya tengo redes sociales activas'.
   Respuesta: 'Excelente, pero ¿cuántos de los clientes que entran a tu local te siguen realmente? El 90% sale sin seguirte porque buscarte en Instagram toma tiempo. Con TIK lo hacen en 2 segundos mientras esperan su cuenta'.
5. Objeción: '¿Qué pasa si cambio mi número de WhatsApp o mi carta?'.
   Respuesta: 'Por eso ofrecemos el servicio Plus o gestión dinámica: el display se mantiene intacto y nosotros actualizamos la ruta en la nube para que nunca pierdas tu inversión'.`,
      tags: ["objeciones", "muy caro", "ya tengo qr", "nfc", "respuestas"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-s",
      section: "S",
      category: "Asesoría",
      title: "Recomendaciones por tipo y giro de negocio",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Estrategias específicas para 10 giros: Restaurantes, Cafeterías, Barberías, Estéticas, Hoteles, Consultorios, etc.",
      content: `Matriz de recomendaciones especializadas:
1. RESTAURANTES: Reseñas Plus en cajas/mostrador + Menú/Catálogo en cada mesa + Facturación rápida.
2. CAFETERÍAS: WiFi rápido en barra/mesas + Redes en un toque para contenido visual en Instagram + Reseñas.
3. BARBERÍAS: Reseñas en estación de corte + Redes en un toque (TikTok/Instagram) para lucir cortes + Pagos por transferencia/CoDi.
4. ESTÉTICAS Y SPAS: Reseñas con filtro de satisfacción + Tarjeta Digital Plus de las estilistas + Agenda/WhatsApp de citas.
5. HOTELES / HOSTALES: WiFi en habitaciones y lobby + Menú de amenidades + Reseñas de TripAdvisor/Google en recepción.
6. CONSULTORIOS Y CLÍNICAS: Facturación directa + WiFi en sala de espera + Tarjeta digital del especialista con cédula y teléfono de urgencias.
7. TIENDAS Y BOUTIQUES: Redes en un toque para comunidad + Pagos y terminal digital + Reseñas en punto de pago.
8. GIMNASIOS / STUDIOS: Redes para seguir rutinas + WiFi en piso de entrenamiento + Reseñas para captar nuevos socios.
9. NEGOCIOS DE SERVICIOS (Talleres, despachos): Factura directa + Reseñas de confianza + Tarjeta digital con vCard.
10. PROFESIONALES INDEPENDIENTES: Tarjeta Digital Plus con portafolio + Pagos directos + Enlace directo a llamada/WhatsApp.`,
      tags: ["giros", "restaurantes", "cafeterias", "barberias", "esteticas", "hoteles", "consultorios", "recomendaciones"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-t",
      section: "T",
      category: "Políticas",
      title: "Políticas de renovación de servicios digitales",
      status: "PROVISIONAL",
      certainty_level: "REQUIERE_CONFIRMACION",
      summary: "Renovación anual de hosting y redirección dinámica: referencia $650 MXN/año. Incluye soporte y cambios.",
      content: `Condiciones de renovación anual (sujetas a confirmación final):
- El hardware físico no tiene mensualidades ni cargos obligatorios si se utiliza con enlaces estáticos directos.
- Los servicios que requieran infraestructura en la nube (Plus con redirección dinámica, TIK Mini Web, landing pages de filtrado) cuentan con un costo de mantenimiento anual referencial de $650 MXN.
- Notificación al cliente: 30 y 15 días antes de la fecha de vencimiento.
- Periodo de gracia: 7 días hábiles posteriores a la fecha de vencimiento antes de pausar la redirección.`,
      tags: ["renovacion", "anual", "provisional", "mantenimiento", "politicas"],
      updated_at: new Date().toISOString()
    },
    {
      id: "sec-u",
      section: "U",
      category: "Términos",
      title: "Condiciones y limitaciones de los servicios",
      status: "OFICIAL",
      certainty_level: "CONFIRMADO",
      summary: "Compatibilidad sujeta a hardware del usuario final; Google prohíbe manipular reseñas con incentivos monetarios.",
      content: `Limitaciones técnicas y legales que todo asesor debe comunicar con ética:
1. Compatibilidad NFC: Requiere smartphones con lector NFC activo. Dispositivos de gama de entrada sin NFC deben recurrir al código QR incluido.
2. Filtrado de reseñas (Plus): El desvío de feedback no viola las políticas de Google siempre que no se bloquee ni coaccione al usuario que explícitamente desee publicar en Maps. Se ofrece como un canal de atención directa a clientes insatisfechos.
3. No manipulación: TIK no vende ni genera reseñas falsas. Es un acelerador para que clientes reales publiquen opiniones genuinas.
4. Conectividad: El smartphone del usuario debe tener conexión a internet celular o WiFi para navegar el enlace.`,
      tags: ["limitaciones", "condiciones", "etica", "google", "terminos"],
      updated_at: new Date().toISOString()
    }
  ],

  // 3. Catálogo de Productos y Servicios
  catalog: {
    products: [
      {
        id: "prod-display-10x15",
        name: "TIK Smart Display 10×15 cm",
        format: "Acrílico vertical de alta densidad con base",
        dimensions: "10 x 15 cm",
        technologies: ["NFC NTAG213/215", "Código QR HD"],
        includes: ["Display acrílico", "Chip NFC", "QR serigrafiado/impreso", "Configuración 100%", "Tarjeta de Garantía", "Mini Manual"],
        base_price: 299.00,
        price_status: "PROVISIONAL", // PROVISIONAL hasta confirmación
        unit_cost: 122.00,
        cost_status: "PROVISIONAL",
        description: "Tótem de acrílico cristal vertical de 10×15 cm con base sólida. Integra NFC y QR probado y listo para usar."
      }
    ],

    services: [
      {
        id: "srv-resenas",
        number: 1,
        name: "RESEÑAS",
        summary: "Acceso instantáneo a reseñas y opiniones en Google Maps y plataformas clave.",
        basic_description: "Enlace directo sin escalas a la ficha de reseñas de Google Maps del negocio.",
        basic_extra_price: 0.00,
        plus_description: "Filtro inteligente de satisfacción: 1-4 estrellas canalizan a WhatsApp privado para resolver incidencias; 5 estrellas dirigen a Google Maps.",
        plus_extra_price: 189.00,
        plus_price_status: "PROVISIONAL",
        recommended_for: ["Restaurantes", "Cafeterías", "Barberías", "Hoteles", "Estéticas", "Consultorios"]
      },
      {
        id: "srv-redes",
        number: 2,
        name: "REDES EN UN TOQUE",
        summary: "Acceso centralizado a WhatsApp, Instagram, Facebook y TikTok.",
        basic_description: "Enlace directo a la red principal elegida por el cliente (ej. Instagram o WhatsApp).",
        basic_extra_price: 0.00,
        plus_description: "Hub digital interactivo con acceso a las 4 redes principales y botón directo de suscripción.",
        plus_extra_price: 189.00,
        plus_price_status: "PROVISIONAL",
        recommended_for: ["Cafeterías", "Boutiques", "Barberías", "Gimnasios", "Restaurantes"]
      },
      {
        id: "srv-menu",
        number: 3,
        name: "MENÚ / CATÁLOGO",
        summary: "Acceso digital a productos, servicios y cartas interactivas.",
        basic_description: "Apertura directa de menú digital en PDF o enlace a catálogo existente.",
        basic_extra_price: 0.00,
        plus_description: "Menú web visual interactivo con fotos, filtros por categorías y botón para ordenar por WhatsApp.",
        plus_extra_price: 189.00,
        plus_price_status: "PROVISIONAL",
        recommended_for: ["Restaurantes", "Cafeterías", "Bares", "Salones de té"]
      },
      {
        id: "srv-wifi",
        number: 4,
        name: "WIFI",
        summary: "Acceso simplificado a la red WiFi del establecimiento sin teclear contraseñas.",
        basic_description: "Conexión directa inmediata por NFC/QR a la red WiFi elegida.",
        basic_extra_price: 0.00,
        plus_description: "Conexión a WiFi acompañada de pantalla de bienvenida con promociones del día y redes.",
        plus_extra_price: 189.00,
        plus_price_status: "PROVISIONAL",
        recommended_for: ["Cafeterías", "Hoteles", "Consultorios", "Gimnasios", "Coworkings"]
      },
      {
        id: "srv-tarjeta",
        number: 5,
        name: "TARJETA DIGITAL",
        summary: "Compartir datos esenciales de contacto profesional (VCard) en un solo toque.",
        basic_description: "Descarga instantánea del contacto en la agenda del teléfono (vCard/VCF).",
        basic_extra_price: 0.00,
        plus_description: "Tarjeta de presentación digital interactiva con foto, biografía, redes, vCard y portafolio.",
        plus_extra_price: 189.00,
        plus_price_status: "PROVISIONAL",
        recommended_for: ["Profesionales independientes", "Médicos", "Abogados", "Agentes", "Estilistas"]
      },
      {
        id: "srv-delivery",
        number: 6,
        name: "DELIVERY",
        summary: "Acceso directo a pedidos a domicilio en plataformas o canal propio.",
        basic_description: "Redirección a la plataforma de delivery principal (UberEats, Didi, Rappi o WhatsApp).",
        basic_extra_price: 0.00,
        plus_description: "Selector multicanal de pedidos que permite al cliente elegir su app favorita o pedir directo con descuento.",
        plus_extra_price: 189.00,
        plus_price_status: "PROVISIONAL",
        recommended_for: ["Restaurantes", "Dark Kitchens", "Pizzerías", "Pastelerías"]
      },
      {
        id: "srv-pagos",
        number: 7,
        name: "PAGOS",
        summary: "Acceso a opciones de cobro rápido y transferencias.",
        basic_description: "Apertura directa de enlace de pago único (ej. Mercado Pago, PayPal o cuenta CLABE).",
        basic_extra_price: 0.00,
        plus_description: "Centro de cobro con opciones múltiples: Transferencia bancaria (copiar CLABE en 1 clic), CoDi y pasarelas con tarjeta.",
        plus_extra_price: 189.00,
        plus_price_status: "PROVISIONAL",
        recommended_for: ["Tiendas", "Barberías", "Profesionales", "Consultorios", "Bazares"]
      },
      {
        id: "srv-factura",
        number: 8,
        name: "FACTURA",
        summary: "Acceso directo al flujo de facturación electrónica CFDI para clientes.",
        basic_description: "Enlace directo al portal web de facturación del negocio.",
        basic_extra_price: 0.00,
        plus_description: "Formulario asistido de captura de datos fiscales para emitir la factura sin que el comensal espere en caja.",
        plus_extra_price: 189.00,
        plus_price_status: "PROVISIONAL",
        recommended_for: ["Restaurantes", "Talleres", "Gasolineras", "Consultorios", "Hoteles"]
      }
    ],

    // Complementos y servicios adicionales referenciales
    add_ons: [
      {
        id: "addon-plus",
        name: "Complemento Experiencia PLUS",
        price: 189.00,
        cost: 45.00,
        price_status: "PROVISIONAL",
        cost_status: "PROVISIONAL",
        description: "Configuración de experiencia interactiva enriquecida o redirección filtrada."
      },
      {
        id: "addon-renovacion",
        name: "Renovación Anual Cloud & Mantenimiento",
        price: 650.00,
        cost: 150.00,
        price_status: "PROVISIONAL",
        cost_status: "PROVISIONAL",
        description: "Mantenimiento anual de redirección dinámica, soporte y hosting seguro."
      },
      {
        id: "addon-mini-web",
        name: "TIK Mini Web Personalizada",
        price: 1499.00,
        cost: 350.00,
        price_status: "PROVISIONAL",
        cost_status: "PROVISIONAL",
        description: "Landing page express optimizada para móviles con catálogo y enlaces."
      },
      {
        id: "addon-dominio",
        name: "Dominio Personalizado .com / .mx Anual",
        price: 2250.00,
        cost: 700.00,
        price_status: "PROVISIONAL",
        cost_status: "PROVISIONAL",
        description: "Ejemplo comercial de referencia de dominio propio corporativo anual."
      },
      {
        id: "addon-diseno-personalizado",
        name: "Personalización de Diseño Gráfico Especial",
        price: 250.00,
        cost: 50.00,
        price_status: "REGLA_PROPIETARIO",
        cost_status: "PROVISIONAL",
        description: "Adaptación de logotipo a dos tintas, diseño gráfico a medida de la placa."
      }
    ]
  },

  // 4. Estructura de Costos del Motor Financiero
  financial_cost_structure: {
    fixed_overhead_monthly: 0.00,
    hardware_costs: [
      { item: "Acrílico cristal 10×15 cm cortado láser", unit_cost: 35.00, category: "material", status: "PROVISIONAL" },
      { item: "Base de acrílico soporte maquinada", unit_cost: 18.00, category: "material", status: "PROVISIONAL" },
      { item: "Chip NFC NTAG213/215 adhesivo de alta sensibilidad", unit_cost: 14.00, category: "componente", status: "PROVISIONAL" },
      { item: "Impresión de alta resolución / vinil UV con QR", unit_cost: 16.00, category: "impresion", status: "PROVISIONAL" },
      { item: "Adhesivos industriales y ensamble físico", unit_cost: 5.00, category: "material", status: "PROVISIONAL" }
    ],
    operational_costs: [
      { item: "Empaque acolchado / caja unitaria", unit_cost: 12.00, category: "empaque", status: "PROVISIONAL" },
      { item: "Mini manual de uso impreso", unit_cost: 4.00, category: "papeleria", status: "PROVISIONAL" },
      { item: "Tarjeta de garantía física foliada", unit_cost: 3.00, category: "papeleria", status: "PROVISIONAL" },
      { item: "Mano de obra (programación NFC, control de calidad y prueba)", unit_cost: 15.00, category: "mano_de_obra", status: "PROVISIONAL" }
    ],
    margin_rules: {
      min_margin_percentage: 35.00, // Margen mínimo (%)
      target_margin_percentage: 55.00, // Margen objetivo (%)
      require_owner_approval_under_min: true
    }
  },

  // 5. Escala Oficial de Mayoreo por Volumen
  wholesale_tiers: [
    { min_qty: 1, max_qty: 4, discount_pct: 0, tier_name: "Minorista", requires_approval: false },
    { min_qty: 5, max_qty: 9, discount_pct: 10, tier_name: "Paquete Negocio", requires_approval: false },
    { min_qty: 10, max_qty: 19, discount_pct: 18, tier_name: "Volumen Comercial", requires_approval: false },
    { min_qty: 20, max_qty: 49, discount_pct: 25, tier_name: "Mayoreo Cadenas", requires_approval: false },
    { min_qty: 50, max_qty: 99999, discount_pct: 32, tier_name: "Corporativo / Mayorista", requires_approval: false }
  ],

  // 6. Asesor de Giros y Recomendaciones
  business_types: [
    {
      type: "Restaurantes",
      primary_needs: ["Aumentar reseñas positivas en Google", "Digitalizar carta/menú", "Agilizar facturación CFDI"],
      recommended_services: ["srv-resenas", "srv-menu", "srv-factura"],
      recommended_tier: "PLUS",
      pitch: "Para un restaurante, la rotación de comensales y la reputación en Google Maps lo son todo. Con Reseñas Plus filtras comensales molestos a WhatsApp y concentras los felices en 5 estrellas en Google. Además, un display en mesa con Menú Plus y Factura reduce la carga de los meseros en un 40%.",
      potential_addons: ["addon-plus", "addon-diseno-personalizado"]
    },
    {
      type: "Cafeterías",
      primary_needs: ["Acceso a WiFi sin molestar al barista", "Seguidores en Instagram", "Reseñas de calidad"],
      recommended_services: ["srv-wifi", "srv-redes", "srv-resenas"],
      recommended_tier: "PLUS",
      pitch: "El cliente de café pasa tiempo consumiendo y tomando fotos. Con TIK WiFi entra en un toque y con Redes en un toque sigue tu Instagram al instante, logrando una comunidad activa sin esfuerzo.",
      potential_addons: ["addon-plus"]
    },
    {
      type: "Barberías",
      primary_needs: ["Mostrar cortes y estilos en redes", "Cobros rápidos", "Reseñas"],
      recommended_services: ["srv-redes", "srv-resenas", "srv-pagos"],
      recommended_tier: "PLUS",
      pitch: "Un cliente recién cortado es el mejor momento para una foto en Instagram y una reseña inmediata de 5 estrellas mientras paga por transferencia con un toque.",
      potential_addons: ["addon-plus"]
    },
    {
      type: "Estéticas y Spas",
      primary_needs: ["Agenda de citas", "Portafolio de transformaciones", "Fidelización"],
      recommended_services: ["srv-resenas", "srv-tarjeta", "srv-redes"],
      recommended_tier: "PLUS",
      pitch: "Las estilistas pueden tener su Tarjeta Digital Plus para agendar citas directas y asegurar que cada clienta satisfecha deje 5 estrellas en Google.",
      potential_addons: ["addon-plus", "addon-mini-web"]
    },
    {
      type: "Hoteles y Hostales",
      primary_needs: ["WiFi inmediato", "TripAdvisor / Google reviews", "Servicios de habitación"],
      recommended_services: ["srv-wifi", "srv-resenas", "srv-menu"],
      recommended_tier: "PLUS",
      pitch: "Facilita la estancia de huéspedes extranjeros sin barreras de idioma con WiFi instantáneo y catapulta tu puntuación de satisfacción en plataformas turísticas.",
      potential_addons: ["addon-renovacion"]
    },
    {
      type: "Consultorios y Clínicas",
      primary_needs: ["Tarjeta profesional del médico", "Factura de honorarios", "WiFi en sala"],
      recommended_services: ["srv-tarjeta", "srv-factura", "srv-wifi"],
      recommended_tier: "PLUS",
      pitch: "Ofrece a tus pacientes una imagen de alta tecnología médica: tu tarjeta digital queda guardada en su agenda y emiten su factura sin fricción.",
      potential_addons: ["addon-plus"]
    },
    {
      type: "Tiendas y Boutiques",
      primary_needs: ["Comunidad de seguidores", "Pagos digitales", "Catálogo"],
      recommended_services: ["srv-redes", "srv-pagos", "srv-menu"],
      recommended_tier: "PLUS",
      pitch: "Convierte a cada comprador en seguidor de Instagram para avisarle de nuevas temporadas y acepta pagos digitales en segundos.",
      potential_addons: ["addon-plus"]
    },
    {
      type: "Gimnasios y Estudios",
      primary_needs: ["Horarios de clases", "Redes sociales", "Reseñas de motivación"],
      recommended_services: ["srv-redes", "srv-menu", "srv-resenas"],
      recommended_tier: "BASICO",
      pitch: "Tus alumnos acceden al horario de clases en un toque y etiquetan tu gimnasio en sus historias de entrenamiento.",
      potential_addons: ["addon-plus"]
    },
    {
      type: "Negocios de Servicios",
      primary_needs: ["Generación de confianza", "Facturación", "Contacto de urgencia"],
      recommended_services: ["srv-resenas", "srv-factura", "srv-tarjeta"],
      recommended_tier: "PLUS",
      pitch: "Cierra la venta demostrando solvencia y opiniones reales verificables.",
      potential_addons: ["addon-plus"]
    },
    {
      type: "Profesionales Independientes",
      primary_needs: ["Networking eficaz", "Cobros en el acto", "Portafolio"],
      recommended_services: ["srv-tarjeta", "srv-pagos", "srv-redes"],
      recommended_tier: "PLUS",
      pitch: "Olvídate de las tarjetas de papel que terminan en la basura. Entrega tus datos completos, portafolio y redes con un toque en el celular de tu cliente.",
      potential_addons: ["addon-plus", "addon-mini-web"]
    }
  ],

  // 7. Clientes iniciales para demostraciones y cotizaciones
  clients: [
    {
      id: "cli-001",
      business_name: "Cafetería La Selva",
      contact_name: "Carlos Méndez",
      email: "contacto@laselvacafes.com",
      phone: "+52 55 1234 5678",
      business_type: "Cafeterías",
      branches_count: 1,
      city: "Ciudad de México",
      created_at: new Date().toISOString()
    },
    {
      id: "cli-002",
      business_name: "Grupo Gastronómico El Mesón (Cadena 4 sucursales)",
      contact_name: "Valeria Soto",
      email: "operaciones@elmesonrestaurantes.com",
      phone: "+52 55 9876 5432",
      business_type: "Restaurantes",
      branches_count: 4,
      city: "Guadalajara, Jalisco",
      created_at: new Date().toISOString()
    }
  ],

  // 8. Garantías iniciales
  warranties: [
    {
      id: "war-2025-001",
      folio: "TIK-GAR-2025-001",
      order_id: "ORD-2025-089",
      client_name: "Cafetería La Selva",
      client_email: "contacto@laselvacafes.com",
      client_phone: "+52 55 1234 5678",
      product_name: "TIK Smart Display 10×15 cm",
      quantity: 2,
      purchase_date: "2025-02-15",
      delivery_date: "2025-02-18",
      warranty_start_date: "2025-02-18",
      warranty_end_date: "2025-03-20", // 30 días naturales
      status: "VIGENTE", // VIGENTE, VENCIDA, EN_REVISION, RESUELTA, PENDIENTE_INFO
      coverage_details: "30 días de cobertura total por defectos en chip NFC y legibilidad de código QR.",
      incidents: [
        {
          id: "inc-01",
          date: "2025-02-25",
          description: "Cliente reporta que el display de la caja 2 no es detectado por un teléfono Xiaomi.",
          diagnosis: "Se verificó con el cliente que el equipo Xiaomi tenía el NFC apagado en la cortina de accesos rápidos de Android.",
          solution: "Se envió guía de activación NFC. Ambos displays funcionando perfectamente.",
          status: "RESUELTA"
        }
      ]
    }
  ],

  // 9. Cotizaciones de muestra iniciales
  quotes: [],

  // 10. Historial de Auditoría / Cambios (Requisito estricto)
  audit_logs: [
    {
      id: "log-init-01",
      timestamp: new Date().toISOString(),
      action: "SISTEMA_INICIALIZADO",
      entity: "Base de Conocimiento",
      details: "Carga inicial de 21 secciones A-U con categorización formal Oficial vs Provisional.",
      user: "SISTEMA"
    }
  ],

  // 11. Ajustes y Proveedores de IA
  settings: {
    ai_provider: "local", // local, openai, anthropic, groq
    openai_api_key: "",
    anthropic_api_key: "",
    groq_api_key: "",
    model_name: "gpt-4o-mini",
    owner_pin: "1234", // PIN de seguridad por defecto para acciones sensibles
    company_currency: "MXN",
    tax_rate: 0.16 // IVA 16% configurable
  }
};

module.exports = SEED_DATA;
