# TIK MASTER — Sistema Operativo y Encargado Virtual Empresarial

**TIK MASTER** es la aplicación privada e integral para administrar, cotizar, asesorar y generar documentos oficiales de todo el negocio **TIK Smart Displays**.

---

## 1. Filosofía del Producto y Arquitectura

TIK MASTER no es un chatbot genérico ni un cotizador aislado. Funciona como un encargado virtual y director comercial que:
- Conoce el negocio de punta a punta.
- Distingue con rigor estricto la **información oficial confirmada** de las **referencias provisionales** (Regla de Oro).
- Opera de forma autónoma sin necesidad indispensable de IA externa para todos sus cálculos, consultas y generación de documentos, contando además con integración para modelos de lenguaje (OpenAI, Anthropic, Groq).

### Arquitectura Técnica
- **Backend**: Node.js + Express (Modular, escalable y listo para Hostinger Node.js).
- **Persistencia**: Motor transaccional atómico JSON en `server/data/tik_master_store.json` con registro de auditoría (`audit_logs`) y respaldos automáticos en `server/data/backups/`.
- **Generador Documental**: Motor nativo con `pdfkit` (PDF vectorial) y `canvas` (JPG en resolución 1200x1600 para compartir directamente por WhatsApp).
- **Frontend**: Interfaz SPA ejecutiva dark-mode (`public/tik/`) inspirada en la identidad de marca TIK (Negro `#090a0f`, Acero `#141721`, Acentos Cyan `#00d2ff` y Verde `#10b981`).
- **Compatibilidad**: Conserva el proyecto interactivo previo en `/bruk`.

---

## 2. Los Módulos del Sistema

### A. Centro de Mando Conversacional
- Interfaz conversacional con memoria de contexto y preguntas inteligentes.
- Reconoce solicitudes naturales (ej. *"Necesito cotizar 20 displays para una cadena de restaurantes"*), calcula descuentos de mayoreo y formula únicamente las preguntas necesarias (sucursales, nivel Básico vs Plus, personalización).
- Si se le consulta sobre algo no registrado (ej. materiales inexistentes, plazos no aprobados), **rechaza inventar información** y solicita confirmación oficial al propietario.

### B. El Cerebro: Knowledge Base TIK (Secciones A - U)
Estructura editable desde el panel web que alberga:
- **A.** Identidad y filosofía de TIK.
- **B.** Historia y propuesta de valor.
- **C.** Productos y formatos (Acrílico vertical 10x15 cm, base, NFC NTAG integrado, QR obligatorio).
- **D.** Catálogo de los 8 servicios oficiales:
  1. *RESEÑAS* (con experiencia Plus de filtrado: 1-4 estrellas a WhatsApp privado, 5 estrellas a Google Maps).
  2. *REDES EN UN TOQUE* (WhatsApp, Instagram, Facebook, TikTok).
  3. *MENÚ / CATÁLOGO*.
  4. *WIFI*.
  5. *TARJETA DIGITAL* (VCF / Enlaces interactivos).
  6. *DELIVERY*.
  7. *PAGOS*.
  8. *FACTURA*.
- **E.** Características técnicas.
- **F.** Niveles Básico y Plus.
- **G.** Precios y políticas comerciales (marcando referencias provisionales).
- **H.** Costos de fabricación.
- **I.** Costos operativos.
- **J.** Márgenes y rentabilidad (fórmulas estrictas).
- **K.** Mayoreo y descuentos por volumen.
- **L.** Garantías (30 días de cobertura estándar, exclusiones confirmadas).
- **M.** Soporte técnico.
- **N.** Instalación y ubicación.
- **O.** Entrega y recepción (Checklist y tarjeta física foliada).
- **P.** Preguntas frecuentes (FAQ).
- **Q.** Argumentos de venta por ROI y reputación.
- **R.** Superación de objeciones comerciales (*"Está muy caro"*, *"Ya tengo QR"*, *"¿Para qué NFC?"*, etc.).
- **S.** Recomendaciones por tipo de negocio (10 giros comerciales).
- **T.** Políticas de renovación.
- **U.** Condiciones y limitaciones de los servicios.

### C. Cotizador Inteligente (Manual y Conversacional)
- Escalas oficiales de volumen:
  - 1 a 4 unidades: Precio de lista ($299.00 MXN provisional).
  - 5 a 9 unidades: 10% de descuento ($269.10 MXN).
  - 10 a 19 unidades: 18% de descuento ($245.18 MXN).
  - 20 a 49 unidades: 25% de descuento ($224.25 MXN).
  - 50+ unidades: 32% de descuento ($203.32 MXN).
- Alerta al usuario en caso de que algún concepto mantenga precio provisional.
- Control de margen mínimo: impide o advierte si una venta rinde menos del 35% de margen.

### D. Motor Financiero
Distingue matemáticamente:
- **Utilidad Bruta**: `Precio de Venta - Costo Total`.
- **Margen Porcentual Bruto**: `(Utilidad / Precio de Venta) * 100` (Ej. 59.20%).
- **Markup (Incremento sobre costo)**: `(Utilidad / Costo) * 100` (Ej. 145.08%).
- **Punto de Equilibrio** y Descuento Máximo permitido.

### E. Centro de Garantías
- Pólizas foliadas con vigencia calculada automáticamente a 30 días a partir de la entrega.
- Registro de incidencias técnicas con diagnóstico, solución y estado (Vigente, En Revisión, Resuelta, Vencida).

### F. Generador Universal de los 16 Documentos Oficiales
Permite emitir con un solo clic en **PDF descargable** y en **JPG de alta resolución (1200x1600)**:
1. Cotización comercial
2. Cotización de mayoreo
3. Propuesta comercial
4. Comparativa Básico vs Plus
5. Recomendación personalizada
6. Ficha técnica del producto
7. Garantía
8. Comprobante de entrega
9. Manual de uso
10. Instrucciones de instalación
11. Renovación de servicio
12. Resumen de pedido
13. Reporte de costos
14. Reporte de rentabilidad
15. Resumen de incidencias
16. Documento de condiciones del servicio

---

## 3. Instrucciones de Instalación y Ejecución Local

### Prerrequisitos
- Node.js versión 18 o superior.
- NPM versión 9 o superior.

### Pasos
1. Clonar o ingresar a la raíz del repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor:
   ```bash
   npm start
   ```
   *(O ejecutar directamente `node server/server.js`)*.
4. Abrir en el navegador:
   - **TIK MASTER**: `http://localhost:3000/tik`
   - **Proyecto BRUK**: `http://localhost:3000/bruk`

---

## 4. Instrucciones de Despliegue en Hostinger

Hostinger soporta aplicaciones Node.js mediante su panel cPanel o Cloud VPS:

### Despliegue en Cloud/VPS o Node.js Selector de Hostinger:
1. Sube el código fuente al directorio de tu aplicación (`/home/usuario/public_html` o la carpeta asignada).
2. Asegúrate de configurar la versión de Node.js a `20.x` o `22.x`.
3. Especifica como archivo de entrada (`Application startup file`): `server/server.js`.
4. En el panel de variables de entorno (o archivo `.env` privado):
   ```env
   PORT=3000
   NODE_ENV=production
   ```
5. Ejecuta `npm install --omit=dev`.
6. Reinicia la aplicación desde el panel de Hostinger. La app quedará accesible con certificado SSL HTTPS automático.

---

## 5. Pruebas Realizadas (10 Casos Obligatorios)

El sistema cuenta con un suite automatizado en `tests/run_tests.js`. Para ejecutarlo:
```bash
node tests/run_tests.js
```

### Resultados de los 10 Casos:
- **CASO 1**: Cotización individual Básico ($299.00 MXN, 0% desc) -> **PASS**
- **CASO 2**: Cotización display con Plus ($299 + $189 = $488.00 MXN) -> **PASS**
- **CASO 3**: Cotización 20 displays para restaurantes (Escala Mayoreo Cadenas - 25% descuento: $5,980 -> $4,485 MXN) -> **PASS**
- **CASO 4**: Cálculo de utilidad ($177 MXN), margen (59.20%) y markup (145.08%) -> **PASS**
- **CASO 5**: Consulta sobre política de garantía (30 días, chips NFC, QR, exclusiones) -> **PASS**
- **CASO 6**: Generación de certificado de garantía foliado (`TIK-GAR-...`) -> **PASS**
- **CASO 7**: Recomendación comercial para cafeterías (WiFi, Redes y Reseñas) -> **PASS**
- **CASO 8**: Solicitud de dato no registrado (el agente reconoce falta de registro y rechaza inventar) -> **PASS**
- **CASO 9**: Detección y banderas de precios provisionales -> **PASS**
- **CASO 10**: Generación y entrega binaria de cotización en PDF y JPG de alta calidad -> **PASS**

---

## 6. Guía para Actualizar el Conocimiento Empresarial

1. Ingrese a **TIK MASTER** en la pestaña **Base de Conocimiento**.
2. Cada sección cuenta con su etiqueta de estatus (`OFICIAL`, `PROVISIONAL`, `REGLA_PROPIETARIO`).
3. Para ratificar un precio o política provisional como definitivo, haga clic en el botón **Confirmar**.
4. La confirmación queda asentada automáticamente en el módulo de **Auditoría** con marca de tiempo y usuario.
