require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Rutas de API modular
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/api/catalog', require('./routes/catalog'));
app.use('/api/quotes', require('./routes/quotes'));
app.use('/api/financial', require('./routes/financial'));
app.use('/api/warranties', require('./routes/warranties'));
app.use('/api/advisor', require('./routes/advisor'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));

// Estado de salud del sistema
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'TIK MASTER Enterprise v1.0',
    mode: 'EXPERT_HYBRID',
    timestamp: new Date().toISOString()
  });
});

// Servir la aplicación principal TIK MASTER
app.use('/tik', express.static(path.join(__dirname, '../public/tik')));

// Preservar proyecto BRUK preexistente bajo /bruk para no destruir archivos existentes
app.use('/bruk', express.static(path.join(__dirname, '../')));

// Redirección de la raíz hacia TIK MASTER
app.get('/', (req, res) => {
  res.redirect('/tik');
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('[TIK MASTER ERROR]', err);
  res.status(500).json({ success: false, error: err.message || 'Error interno del servidor' });
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`   TIK MASTER — Sistema Operativo Empresarial`);
    console.log(`   Servidor activo en: http://localhost:${PORT}`);
    console.log(`   Panel Web:          http://localhost:${PORT}/tik`);
    console.log(`   BRUK Preservado:    http://localhost:${PORT}/bruk`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
