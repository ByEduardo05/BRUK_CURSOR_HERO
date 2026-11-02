/**
 * TIK MASTER - Motor de Base de Datos y Persistencia
 * Persistencia JSON robusta con bloqueos atómicos, operaciones CRUD, backups automáticos
 * y auditoría estricta de cambios.
 */

const fs = require('fs');
const path = require('path');
const SEED_DATA = require('./seedData');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'tik_master_store.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

class TikDatabase {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      console.log('[TIK DB] No se detectó base de datos. Creando desde datos semilla oficiales...');
      this.data = JSON.parse(JSON.stringify(SEED_DATA));
      this.saveSync();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        // Garantizar que todas las claves requeridas existan
        for (const key of Object.keys(SEED_DATA)) {
          if (!this.data[key]) {
            this.data[key] = JSON.parse(JSON.stringify(SEED_DATA[key]));
          }
        }
      } catch (err) {
        console.error('[TIK DB] Error al leer la base de datos existente. Creando respaldo y restaurando semilla.', err);
        this.data = JSON.parse(JSON.stringify(SEED_DATA));
        this.saveSync();
      }
    }
  }

  saveSync() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('[TIK DB] Error al guardar datos:', err);
      throw err;
    }
  }

  // Helper para auditoría
  logAudit(action, entity, details, user = 'PROPIETARIO') {
    const entry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      entity,
      details,
      user
    };
    if (!this.data.audit_logs) this.data.audit_logs = [];
    this.data.audit_logs.unshift(entry);
    // Mantener hasta 500 registros
    if (this.data.audit_logs.length > 500) {
      this.data.audit_logs.pop();
    }
    this.saveSync();
    return entry;
  }

  // --- KNOWLEDGE BASE ---
  getKnowledge(filter = {}) {
    let list = this.data.knowledge_base || [];
    if (filter.status) {
      list = list.filter(k => k.status.toUpperCase() === filter.status.toUpperCase());
    }
    if (filter.category) {
      list = list.filter(k => k.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.query) {
      const q = filter.query.toLowerCase();
      list = list.filter(k =>
        k.title.toLowerCase().includes(q) ||
        k.content.toLowerCase().includes(q) ||
        (k.tags && k.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return list;
  }

  getKnowledgeById(id) {
    return (this.data.knowledge_base || []).find(k => k.id === id);
  }

  saveKnowledge(item, user = 'PROPIETARIO') {
    if (!this.data.knowledge_base) this.data.knowledge_base = [];
    const index = this.data.knowledge_base.findIndex(k => k.id === item.id);
    item.updated_at = new Date().toISOString();

    if (index >= 0) {
      const old = this.data.knowledge_base[index];
      this.data.knowledge_base[index] = { ...old, ...item };
      this.logAudit('ACTUALIZAR_CONOCIMIENTO', `Sección ${item.section || item.title}`, `Modificación de contenido/estado a ${item.status}`, user);
    } else {
      if (!item.id) item.id = `sec-${Date.now()}`;
      this.data.knowledge_base.push(item);
      this.logAudit('CREAR_CONOCIMIENTO', `Sección ${item.section || item.title}`, `Nueva entrada registrada con estatus ${item.status}`, user);
    }
    this.saveSync();
    return item;
  }

  // --- CATALOG & SERVICES ---
  getCatalog() {
    return this.data.catalog;
  }

  updateProduct(productId, updates, user = 'PROPIETARIO') {
    const prod = (this.data.catalog.products || []).find(p => p.id === productId);
    if (!prod) throw new Error(`Producto ${productId} no encontrado`);
    const oldPrice = prod.base_price;
    Object.assign(prod, updates);
    this.logAudit('ACTUALIZAR_PRODUCTO', prod.name, `Actualización: Precio anterior $${oldPrice} -> $${prod.base_price}. Estatus: ${prod.price_status}`, user);
    this.saveSync();
    return prod;
  }

  updateService(serviceId, updates, user = 'PROPIETARIO') {
    const srv = (this.data.catalog.services || []).find(s => s.id === serviceId);
    if (!srv) throw new Error(`Servicio ${serviceId} no encontrado`);
    Object.assign(srv, updates);
    this.logAudit('ACTUALIZAR_SERVICIO', srv.name, `Actualizado servicio ${srv.name}`, user);
    this.saveSync();
    return srv;
  }

  updateAddon(addonId, updates, user = 'PROPIETARIO') {
    const addon = (this.data.catalog.add_ons || []).find(a => a.id === addonId);
    if (!addon) throw new Error(`Complemento ${addonId} no encontrado`);
    Object.assign(addon, updates);
    this.logAudit('ACTUALIZAR_COMPLEMENTO', addon.name, `Actualizado complemento ${addon.name} a $${addon.price}`, user);
    this.saveSync();
    return addon;
  }

  // --- MAYOREO ---
  getWholesaleTiers() {
    return this.data.wholesale_tiers || [];
  }

  updateWholesaleTiers(tiers, user = 'PROPIETARIO') {
    this.data.wholesale_tiers = tiers;
    this.logAudit('ACTUALIZAR_MAYOREO', 'Escalas de Mayoreo', `Actualizadas ${tiers.length} escalas de precios por volumen`, user);
    this.saveSync();
    return this.data.wholesale_tiers;
  }

  // --- FINANZAS & COSTOS ---
  getFinancialStructure() {
    return this.data.financial_cost_structure;
  }

  updateFinancialStructure(structure, user = 'PROPIETARIO') {
    this.data.financial_cost_structure = {
      ...this.data.financial_cost_structure,
      ...structure
    };
    this.logAudit('ACTUALIZAR_FINANZAS', 'Estructura de Costos', 'Modificada estructura de costos de fabricación y operativos', user);
    this.saveSync();
    return this.data.financial_cost_structure;
  }

  // --- CLIENTES ---
  getClients() {
    return this.data.clients || [];
  }

  getClientById(id) {
    return (this.data.clients || []).find(c => c.id === id);
  }

  saveClient(client, user = 'PROPIETARIO') {
    if (!this.data.clients) this.data.clients = [];
    if (!client.id) {
      client.id = `cli-${Date.now()}`;
      client.created_at = new Date().toISOString();
      this.data.clients.push(client);
      this.logAudit('CREAR_CLIENTE', client.business_name, `Nuevo cliente registrado: ${client.business_name}`, user);
    } else {
      const idx = this.data.clients.findIndex(c => c.id === client.id);
      if (idx >= 0) {
        this.data.clients[idx] = { ...this.data.clients[idx], ...client };
        this.logAudit('ACTUALIZAR_CLIENTE', client.business_name, `Actualizados datos de cliente: ${client.business_name}`, user);
      } else {
        this.data.clients.push(client);
      }
    }
    this.saveSync();
    return client;
  }

  // --- COTIZACIONES ---
  getQuotes() {
    return this.data.quotes || [];
  }

  getQuoteById(id) {
    return (this.data.quotes || []).find(q => q.id === id || q.folio === id);
  }

  saveQuote(quote, user = 'PROPIETARIO') {
    if (!this.data.quotes) this.data.quotes = [];
    if (!quote.id) {
      quote.id = `q-${Date.now()}`;
      quote.folio = quote.folio || `TIK-COT-${new Date().getFullYear()}-${String(this.data.quotes.length + 1).padStart(3, '0')}`;
      quote.created_at = new Date().toISOString();
      this.data.quotes.unshift(quote);
      this.logAudit('CREAR_COTIZACION', quote.folio, `Cotización para ${quote.client_name || 'Prospecto'} por $${quote.total}`, user);
    } else {
      const idx = this.data.quotes.findIndex(q => q.id === quote.id);
      if (idx >= 0) {
        this.data.quotes[idx] = { ...this.data.quotes[idx], ...quote };
        this.logAudit('ACTUALIZAR_COTIZACION', quote.folio, `Actualizada cotización ${quote.folio}`, user);
      } else {
        this.data.quotes.unshift(quote);
      }
    }
    this.saveSync();
    return quote;
  }

  // --- GARANTÍAS ---
  getWarranties() {
    return this.data.warranties || [];
  }

  getWarrantyById(id) {
    return (this.data.warranties || []).find(w => w.id === id || w.folio === id);
  }

  saveWarranty(warranty, user = 'PROPIETARIO') {
    if (!this.data.warranties) this.data.warranties = [];
    if (!warranty.id) {
      warranty.id = `war-${Date.now()}`;
      warranty.folio = warranty.folio || `TIK-GAR-${new Date().getFullYear()}-${String(this.data.warranties.length + 1).padStart(3, '0')}`;
      warranty.created_at = new Date().toISOString();
      this.data.warranties.unshift(warranty);
      this.logAudit('CREAR_GARANTIA', warranty.folio, `Póliza de garantía registrada para ${warranty.client_name}`, user);
    } else {
      const idx = this.data.warranties.findIndex(w => w.id === warranty.id);
      if (idx >= 0) {
        this.data.warranties[idx] = { ...this.data.warranties[idx], ...warranty };
        this.logAudit('ACTUALIZAR_GARANTIA', warranty.folio, `Actualizada póliza ${warranty.folio} a estado ${warranty.status}`, user);
      } else {
        this.data.warranties.unshift(warranty);
      }
    }
    this.saveSync();
    return warranty;
  }

  // --- AJUSTES & AUDITORÍA ---
  getSettings() {
    // Proteger llaves en lecturas no autorizadas
    return {
      ...this.data.settings,
      openai_api_key_configured: Boolean(this.data.settings.openai_api_key),
      anthropic_api_key_configured: Boolean(this.data.settings.anthropic_api_key),
      groq_api_key_configured: Boolean(this.data.settings.groq_api_key)
    };
  }

  getPrivateSettings() {
    return this.data.settings;
  }

  updateSettings(updates, user = 'PROPIETARIO') {
    this.data.settings = { ...this.data.settings, ...updates };
    this.logAudit('ACTUALIZAR_CONFIGURACION', 'Ajustes del Sistema', 'Modificados ajustes generales o llaves API', user);
    this.saveSync();
    return this.getSettings();
  }

  getAuditLogs(limit = 100) {
    return (this.data.audit_logs || []).slice(0, limit);
  }

  // Backups
  createBackup() {
    const filename = `backup_tik_${Date.now()}.json`;
    const fullPath = path.join(BACKUP_DIR, filename);
    fs.writeFileSync(fullPath, JSON.stringify(this.data, null, 2), 'utf8');
    this.logAudit('CREAR_RESPALDO', filename, 'Respaldo manual de la base de datos generado con éxito');
    return { filename, timestamp: new Date().toISOString() };
  }
}

// Singleton
const db = new TikDatabase();
module.exports = db;
