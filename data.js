(() => {
  const DB_KEY = 'fwd-system-db';
  const VERSION = 1;

  const LEGACY_KEYS = {
    clients: 'fwd-clients',
    products: 'fwd-products',
    suppliers: 'fwd-suppliers'
  };

  const ID_FIELDS = {
    clients: 'clienteId',
    products: 'productoId',
    suppliers: 'proveedorId',
    orders: 'pedidoId'
  };

  const ID_PREFIXES = {
    clients: 'CLI',
    products: 'PRD',
    suppliers: 'PRV',
    orders: 'PED'
  };

  const EMPTY_DB = {
    clients: [],
    products: [],
    suppliers: [],
    orders: []
  };

  const API_NAMES = {
    clients: { plural: 'clientes', singular: 'cliente' },
    products: { plural: 'productos', singular: 'producto' },
    suppliers: { plural: 'proveedores', singular: 'proveedor' },
    orders: { plural: 'pedidos', singular: 'pedido' }
  };

  const safeParse = (value, fallback) => {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const readStorage = (key, fallback = null) => safeParse(localStorage.getItem(key), fallback);

  const normalizeDb = (value) => {
    const db = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const next = {};
    Object.keys(EMPTY_DB).forEach((entity) => {
      next[entity] = Array.isArray(db[entity]) ? db[entity] : [];
    });
    return next;
  };

  const readDb = () => normalizeDb(readStorage(DB_KEY, {}));

  const writeDb = (db) => {
    localStorage.setItem(DB_KEY, JSON.stringify(normalizeDb(db)));
  };

  const migrateLegacy = () => {
    const db = readDb();
    const alreadyPopulated = Object.values(db).some((collection) => collection.length > 0);
    if (alreadyPopulated) return db;
    let changed = false;
    Object.entries(LEGACY_KEYS).forEach(([entity, key]) => {
      const legacy = readStorage(key, null);
      if (Array.isArray(legacy) && legacy.length > 0 && db[entity].length === 0) {
        db[entity] = legacy;
        changed = true;
      }
    });
    if (changed) writeDb(db);
    return db;
  };

  const getDb = () => migrateLegacy();

  const assertEntity = (entity) => {
    if (!Object.prototype.hasOwnProperty.call(EMPTY_DB, entity)) {
      throw new Error(`Entidad desconocida: "${entity}". Las entidades válidas son: ${Object.keys(EMPTY_DB).join(', ')}.`);
    }
  };

  const nextId = (entity, collection) => {
    const prefix = ID_PREFIXES[entity];
    const idField = ID_FIELDS[entity];
    const numbers = collection
      .map((record) => parseInt(String(record[idField] || '').replace(/\D/g, ''), 10))
      .filter((value) => Number.isFinite(value));
    const next = (numbers.length ? Math.max(...numbers) : 0) + 1;
    return `${prefix}-${String(next).padStart(4, '0')}`;
  };

  const getAll = (entity) => {
    assertEntity(entity);
    return getDb()[entity];
  };

  const getById = (entity, id) => {
    assertEntity(entity);
    const idField = ID_FIELDS[entity];
    return getAll(entity).find((record) => String(record[idField]) === String(id)) || null;
  };

  const create = (entity, record) => {
    assertEntity(entity);
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      throw new Error('El registro a guardar no es válido.');
    }
    const db = getDb();
    const idField = ID_FIELDS[entity];
    const newRecord = { ...record };
    if (!newRecord[idField]) {
      newRecord[idField] = nextId(entity, db[entity]);
    }
    if (getById(entity, newRecord[idField])) {
      throw new Error(`Ya existe un registro con el identificador ${newRecord[idField]}.`);
    }
    db[entity].push(newRecord);
    writeDb(db);
    return newRecord;
  };

  const update = (entity, id, patch) => {
    assertEntity(entity);
    const db = getDb();
    const idField = ID_FIELDS[entity];
    const index = db[entity].findIndex((record) => String(record[idField]) === String(id));
    if (index === -1) {
      throw new Error(`No se encontró el registro ${id} en "${entity}".`);
    }
    if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
      throw new Error('Los datos de actualización no son válidos.');
    }
    const updated = { ...db[entity][index], ...patch };
    updated[idField] = db[entity][index][idField];
    db[entity][index] = updated;
    writeDb(db);
    return updated;
  };

  const remove = (entity, id) => {
    assertEntity(entity);
    const db = getDb();
    const idField = ID_FIELDS[entity];
    const index = db[entity].findIndex((record) => String(record[idField]) === String(id));
    if (index === -1) {
      throw new Error(`No se encontró el registro ${id} en "${entity}".`);
    }
    const [removed] = db[entity].splice(index, 1);
    writeDb(db);
    return removed;
  };

  const save = (entity, record) => {
    assertEntity(entity);
    const idField = ID_FIELDS[entity];
    if (record && record[idField]) {
      return update(entity, record[idField], record);
    }
    return create(entity, record);
  };

  const count = (entity) => {
    assertEntity(entity);
    return getAll(entity).length;
  };

  const hasData = () => Object.values(readDb()).some((collection) => collection.length > 0);

  const replaceAll = (db) => {
    writeDb(normalizeDb(db));
    return getDb();
  };

  const reset = () => {
    writeDb({});
    return getDb();
  };

  const exportData = () => {
    const payload = {
      app: 'Stellarix',
      version: VERSION,
      exportedAt: new Date().toISOString(),
      data: getDb()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stellarix-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return payload;
  };

  const importData = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No se seleccionó ningún archivo.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          const source = parsed && typeof parsed === 'object' && parsed.data ? parsed.data : parsed;
          const db = normalizeDb(source);
          writeDb(db);
          resolve(db);
        } catch {
          reject(new Error('El archivo no es un JSON válido o no tiene el formato esperado.'));
        }
      };
      reader.onerror = () => reject(new Error('No se pudo leer el archivo seleccionado.'));
      reader.readAsText(file);
    });
  };

  const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

  const api = {
    getDb,
    getAll,
    getById,
    create,
    update,
    remove,
    save,
    count,
    hasData,
    replaceAll,
    reset,
    exportData,
    importData,
    nextId
  };

  Object.entries(API_NAMES).forEach(([entity, names]) => {
    api[`get${capitalize(names.plural)}`] = () => getAll(entity);
    api[`get${capitalize(names.singular)}ById`] = (id) => getById(entity, id);
    api[`save${capitalize(names.singular)}`] = (record) => save(entity, record);
    api[`update${capitalize(names.singular)}`] = (id, patch) => update(entity, id, patch);
    api[`delete${capitalize(names.singular)}`] = (id) => remove(entity, id);
    api[`count${capitalize(names.plural)}`] = () => count(entity);
  });

  window.FWDData = api;
})();
