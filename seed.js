(() => {
  const TOTAL_CLIENTS = 60;
  const TOTAL_PRODUCTS = 70;
  const TOTAL_SUPPLIERS = 20;
  const TOTAL_ORDERS = 70;

  const FIRST_NAMES = [
    'Ana', 'Luis', 'Marta', 'Carlos', 'Elena', 'Javier', 'Sofía', 'Diego', 'Valeria', 'Andrés',
    'Camila', 'Ricardo', 'Lucía', 'Miguel', 'Fernanda', 'Pablo', 'Gabriela', 'Sergio', 'Carolina', 'Felipe',
    'Natalia', 'Marco', 'Isabel', 'Rodrigo', 'Paula', 'Óscar', 'Mónica', 'Hugo', 'Teresa', 'Renata'
  ];

  const LAST_NAMES = [
    'Torres', 'Fernández', 'Gutiérrez', 'Ramírez', 'Morales', 'Castro', 'Herrera', 'Rojas', 'Vargas', 'Chaves',
    'Solís', 'Aguilar', 'Romero', 'Vega', 'Núñez', 'Blanco', 'León', 'Ríos', 'Cordero', 'Jiménez',
    'Salazar', 'Ureña', 'Picado', 'Madrigal', 'Esquivel', 'Calvo', 'Navarro', 'Pereira', 'Duarte', 'Montero'
  ];

  const COMPANIES = [
    'OrbitaTech', 'Agencia Aeroespacial del Sur', 'Universidad del Pacífico', 'Grupo Andino Aeroespacial',
    'Centro de Innovación Orbital', 'Ministerio de Ciencia y Tecnología', 'Corporación AstroSur',
    'Instituto de Investigación Espacial', 'Satélites Andinos S.A.', 'Fundación Horizonte Espacial',
    'Universidad Nacional de Aeronáutica', 'Gobierno Estelar', 'Delta Energía Espacial', 'Consorcio Lanzador',
    'Observatorio del Trópico', 'Agencia Solar Central', 'TechOrbita Ltda.', 'Unión Aeroespacial Americana',
    'Centro Espacial del Caribe', 'Universidad Tecnológica Orbital', 'Industrias AstroAndes',
    'Fundación Cosmos Libre', 'Agencia Espacial del Plata', 'Instituto AstroFísica', 'NovaSat Telecomunicaciones',
    'AeroAndes Ingeniería', 'Universidad Latina de Ciencia', 'Ministerio de Defensa Orbital', 'StellarLink Corp.',
    'Comisión Espacial Internacional', 'Vía Láctea Sistemas', 'Centro de Vuelo Experimental', 'AeroConsultora Global',
    'Fondo de Innovación Espacial', 'Grupo Helios Latino', 'Laboratorio de Propulsión', 'Instituto Politécnico Orbital',
    'Agencia de Desarrollo Tecnológico', 'Universidad del Altiplano', 'Proyecto Aurora'
  ];

  const COUNTRIES = [
    { pais: 'Costa Rica', ciudad: 'San José', codigo: '506' },
    { pais: 'México', ciudad: 'Ciudad de México', codigo: '52' },
    { pais: 'Argentina', ciudad: 'Buenos Aires', codigo: '54' },
    { pais: 'España', ciudad: 'Madrid', codigo: '34' },
    { pais: 'Colombia', ciudad: 'Bogotá', codigo: '57' },
    { pais: 'Chile', ciudad: 'Santiago', codigo: '56' },
    { pais: 'Brasil', ciudad: 'São Paulo', codigo: '55' },
    { pais: 'Perú', ciudad: 'Lima', codigo: '51' },
    { pais: 'Estados Unidos', ciudad: 'Houston', codigo: '1' },
    { pais: 'Alemania', ciudad: 'Berlín', codigo: '49' },
    { pais: 'Italia', ciudad: 'Milán', codigo: '39' },
    { pais: 'Canadá', ciudad: 'Toronto', codigo: '1' },
    { pais: 'Panamá', ciudad: 'Panamá', codigo: '507' },
    { pais: 'Guatemala', ciudad: 'Guatemala', codigo: '502' },
    { pais: 'Ecuador', ciudad: 'Quito', codigo: '593' },
    { pais: 'Uruguay', ciudad: 'Montevideo', codigo: '598' },
    { pais: 'Japón', ciudad: 'Tokio', codigo: '81' },
    { pais: 'Corea del Sur', ciudad: 'Seúl', codigo: '82' },
    { pais: 'Francia', ciudad: 'París', codigo: '33' },
    { pais: 'Reino Unido', ciudad: 'Londres', codigo: '44' }
  ];

  const CLIENT_TYPES = ['Gobierno', 'Empresa Privada', 'Agencia Espacial', 'Universidad'];

  const PRODUCT_TEMPLATES = [
    ['Motor de Propulsión XR-90', 'Propulsión', 'Unidad'],
    ['Panel Solar Satelital PS-1200', 'Energía', 'Unidad'],
    ['Sensor de Navegación GNSS-5', 'Navegación', 'Unidad'],
    ['Módulo de Comunicación UHF-X', 'Comunicaciones', 'Unidad'],
    ['Batería Espacial de Litio BL-450', 'Almacenamiento', 'Unidad'],
    ['Sistema de Control de Actitud ACS-30', 'Navegación', 'Unidad'],
    ['Antena Parabólica Banda K', 'Comunicaciones', 'Unidad'],
    ['Carcasa de Titanio Aeroespacial', 'Estructura', 'Unidad'],
    ['Software de Telemetría OrbitPro', 'Software', 'Licencia'],
    ['Cámara Multiespectral MS-12', 'Instrumentación', 'Unidad'],
    ['Escudo Térmico HRS-2000', 'Estructura', 'Unidad'],
    ['Rueda de Reacción RW-100', 'Navegación', 'Unidad'],
    ['Tanque Criogénico de Combustible', 'Propulsión', 'Unidad'],
    ['Unidad de Potencia EPS-9', 'Energía', 'Unidad'],
    ['Transmisor de Banda S TS-77', 'Comunicaciones', 'Unidad'],
    ['Giroscopio Láser LG-3', 'Navegación', 'Unidad'],
    ['Acelerómetro de Precisión AC-5', 'Instrumentación', 'Unidad'],
    ['Placa de Circuito Integrado', 'Componentes', 'Unidad'],
    ['Tornillería de Grado Espacial', 'Materiales', 'Kit'],
    ['Fibra de Carbono Compuesta', 'Materiales', 'kg'],
    ['Motor de Iones IR-25', 'Propulsión', 'Unidad'],
    ['Radiador Térmico RT-150', 'Estructura', 'Unidad'],
    ['Receptor GNSS Doble Banda', 'Navegación', 'Unidad'],
    ['Amplificador de Potencia Banda Ka', 'Comunicaciones', 'Unidad'],
    ['Computadora de Vuelo FC-2', 'Instrumentación', 'Unidad'],
    ['Cubierta Antimeteoritos', 'Estructura', 'Unidad'],
    ['Generador Termoeléctrico RTG-40', 'Energía', 'Unidad'],
    ['Motor de Apoapsis AP-75', 'Propulsión', 'Unidad'],
    ['Distribuidor Eléctrico PDU-12', 'Energía', 'Unidad'],
    ['Sensor de Temperatura T-900', 'Instrumentación', 'Unidad'],
    ['Sensor de Presión PS-200', 'Instrumentación', 'Unidad'],
    ['Cámara de Alta Resolución HDR-8', 'Instrumentación', 'Unidad'],
    ['Antena de Banda L', 'Comunicaciones', 'Unidad'],
    ['Reflector de Microondas', 'Comunicaciones', 'Unidad'],
    ['Electroválvula de Propulsión EV-5', 'Propulsión', 'Unidad'],
    ['Regulador de Presión RP-15', 'Propulsión', 'Unidad'],
    ['Sistema de Propulsión Eléctrica EP-300', 'Propulsión', 'Unidad'],
    ['Panel Solar Flexible', 'Energía', 'Unidad'],
    ['Convertidor de Potencia DC/DC', 'Energía', 'Unidad'],
    ['Unidad de Batería LTO', 'Almacenamiento', 'Unidad'],
    ['Supercondensador SC-100', 'Almacenamiento', 'Unidad'],
    ['Chasis de Aluminio Anodizado', 'Estructura', 'Unidad'],
    ['Soporte de Paneles Solares', 'Estructura', 'Unidad'],
    ['Brazo Robótico de Manipulación', 'Mecánica', 'Unidad'],
    ['Sistema de Acoplamiento Docking-9', 'Mecánica', 'Unidad'],
    ['Escotilla de Servicio', 'Estructura', 'Unidad'],
    ['Vidrio Térmico de Observatorio', 'Materiales', 'Unidad'],
    ['Aleación de Inconel', 'Materiales', 'kg'],
    ['Aislamiento Multicapa MLI', 'Materiales', 'm²'],
    ['Cinta Térmica Reflectiva', 'Materiales', 'Rollo'],
    ['Óptica de Precisión', 'Instrumentación', 'Unidad'],
    ['Espectrómetro Infrarrojo IR-3', 'Instrumentación', 'Unidad'],
    ['Magnetómetro MG-7', 'Instrumentación', 'Unidad'],
    ['Sensor de Estrellas SS-4', 'Navegación', 'Unidad'],
    ['Sensor de Horizonte HS-2', 'Navegación', 'Unidad'],
    ['Sistema de Navegación Inercial INS-6', 'Navegación', 'Unidad'],
    ['Receptor de Banda S', 'Comunicaciones', 'Unidad'],
    ['Transpondedor de Telemetría', 'Comunicaciones', 'Unidad'],
    ['Router de Datos OrbitNet', 'Comunicaciones', 'Unidad'],
    ['Módulo de Encriptación', 'Seguridad', 'Unidad'],
    ['Firewall de Red Espacial', 'Seguridad', 'Unidad'],
    ['Software de Planificación de Misiones', 'Software', 'Licencia'],
    ['Simulador de Vuelo OrbitSim', 'Software', 'Licencia'],
    ['Inteligencia Artificial de Trayectorias', 'Software', 'Licencia'],
    ['Centro de Control Terrestre GC-1', 'Infraestructura', 'Unidad'],
    ['Estación Terrestre Móvil', 'Infraestructura', 'Unidad'],
    ['Pararrayos de Plataforma', 'Infraestructura', 'Unidad'],
    ['Bomba de Combustible BC-8', 'Propulsión', 'Unidad'],
    ['Turbo-Bomba de Empuje TB-6', 'Propulsión', 'Unidad'],
    ['Etapa Superior Reutilizable RS-2', 'Propulsión', 'Unidad']
  ];

  const FABRICANTES = {
    'Propulsión': ['Stellarix Propulsion', 'Helios Propulsión', 'Hyperion Propulsion', 'CryoFuel Systems'],
    'Energía': ['Stellarix Energy', 'Polaris Energy', 'SolarWing Panels'],
    'Navegación': ['Stellarix Systems', 'Orbital Dynamics', 'NaviSense Labs'],
    'Comunicaciones': ['Stellarix Comms', 'AstroCom Antennas', 'SatLink Communications'],
    'Almacenamiento': ['Stellarix Energy', 'Zenith Batteries'],
    'Estructura': ['Stellarix Materials', 'Vega Space Systems', 'AeroTherm Materials'],
    'Materiales': ['Stellarix Materials', 'Titanium Alloys Inc.', 'AeroTherm Materials', 'BlueStar Optics'],
    'Instrumentación': ['Quasar Instruments', 'Microchip Orbital', 'BlueStar Optics'],
    'Software': ['Stellarix Systems', 'Celeste Software'],
    'Seguridad': ['SecureOrbit Cybersecurity'],
    'Mecánica': ['Titan Robotics'],
    'Infraestructura': ['GroundLink Infrastructure'],
    'Componentes': ['Microchip Orbital']
  };

  const CATEGORY_TO_SUPPLY = {
    'Propulsión': 'Propulsión',
    'Energía': 'Energía',
    'Navegación': 'Componentes Electrónicos',
    'Comunicaciones': 'Comunicaciones',
    'Almacenamiento': 'Energía',
    'Estructura': 'Materiales',
    'Materiales': 'Materiales',
    'Instrumentación': 'Componentes Electrónicos',
    'Software': 'Software',
    'Seguridad': 'Seguridad',
    'Mecánica': 'Mecánica',
    'Infraestructura': 'Infraestructura',
    'Componentes': 'Componentes Electrónicos'
  };

  const SUPPLIER_SEED = [
    { empresa: 'Helios Propulsión SA', contacto: 'Ricardo Alonso', correo: 'ralonso@heliosprop.com', telefono: '+34 91 444-7788', pais: 'España', ciudad: 'Madrid', tipoSuministro: 'Propulsión', estado: 'Activo', fechaRegistro: '2026-01-15' },
    { empresa: 'SolarWing Panels', contacto: 'Elena Kovács', correo: 'ekovacs@solarwing.eu', telefono: '+36 1 555-2210', pais: 'Hungría', ciudad: 'Budapest', tipoSuministro: 'Energía', estado: 'Activo', fechaRegistro: '2026-01-22' },
    { empresa: 'NaviSense Labs', contacto: 'James O\'Connor', correo: 'j.oconnor@navisense.io', telefono: '+1 617 555-0143', pais: 'Estados Unidos', ciudad: 'Boston', tipoSuministro: 'Componentes Electrónicos', estado: 'Activo', fechaRegistro: '2026-02-05' },
    { empresa: 'SatLink Communications', contacto: 'Aisha Rahman', correo: 'a.rahman@satlink.com', telefono: '+971 4 555-7788', pais: 'Emiratos Árabes', ciudad: 'Dubái', tipoSuministro: 'Comunicaciones', estado: 'Suspendido', fechaRegistro: '2026-02-28' },
    { empresa: 'Titanium Alloys Inc.', contacto: 'Sofía Herrera', correo: 'sherrera@tialloys.com', telefono: '+52 55 333-9090', pais: 'México', ciudad: 'Monterrey', tipoSuministro: 'Materiales', estado: 'Inactivo', fechaRegistro: '2026-03-10' },
    { empresa: 'Orbital Dynamics GmbH', contacto: 'Klaus Weber', correo: 'kweber@orbitaldynamics.de', telefono: '+49 89 555-1122', pais: 'Alemania', ciudad: 'Múnich', tipoSuministro: 'Componentes Electrónicos', estado: 'Activo', fechaRegistro: '2026-01-30' },
    { empresa: 'Quasar Instruments', contacto: 'Liam Stewart', correo: 'lstewart@quasar-instr.uk', telefono: '+44 20 555-8899', pais: 'Reino Unido', ciudad: 'Oxford', tipoSuministro: 'Componentes Electrónicos', estado: 'Activo', fechaRegistro: '2026-02-12' },
    { empresa: 'AeroTherm Materials', contacto: 'Claire Dubois', correo: 'cdubois@aerotherm.ca', telefono: '+1 514 555-3344', pais: 'Canadá', ciudad: 'Montreal', tipoSuministro: 'Materiales', estado: 'Activo', fechaRegistro: '2026-03-01' },
    { empresa: 'Vega Space Systems', contacto: 'Matteo Ricci', correo: 'mricci@vegaspace.it', telefono: '+39 06 555-6677', pais: 'Italia', ciudad: 'Roma', tipoSuministro: 'Materiales', estado: 'Activo', fechaRegistro: '2026-03-18' },
    { empresa: 'Polaris Energy BV', contacto: 'Anne de Vries', correo: 'adevries@polarisenergy.nl', telefono: '+31 20 555-5566', pais: 'Países Bajos', ciudad: 'Ámsterdam', tipoSuministro: 'Energía', estado: 'Activo', fechaRegistro: '2026-02-20' },
    { empresa: 'Celeste Software', contacto: 'Daniel Mora', correo: 'dmora@celestesoft.cr', telefono: '+506 2201-7788', pais: 'Costa Rica', ciudad: 'San José', tipoSuministro: 'Software', estado: 'Activo', fechaRegistro: '2026-01-10' },
    { empresa: 'Zenith Batteries', contacto: 'Yuki Tanaka', correo: 'ytanaka@zenithbatt.jp', telefono: '+81 3 555-9900', pais: 'Japón', ciudad: 'Tokio', tipoSuministro: 'Energía', estado: 'Activo', fechaRegistro: '2026-03-25' },
    { empresa: 'AstroCom Antennas', contacto: 'Pierre Moreau', correo: 'pmoreau@astrocom.fr', telefono: '+33 1 555-4455', pais: 'Francia', ciudad: 'Toulouse', tipoSuministro: 'Comunicaciones', estado: 'Activo', fechaRegistro: '2026-02-08' },
    { empresa: 'Hyperion Propulsion', contacto: 'Sarah Mitchell', correo: 'smitchell@hyperionprop.com', telefono: '+1 818 555-7788', pais: 'Estados Unidos', ciudad: 'Los Ángeles', tipoSuministro: 'Propulsión', estado: 'Activo', fechaRegistro: '2026-04-02' },
    { empresa: 'Titan Robotics', contacto: 'Ji-hoon Park', correo: 'jpark@titanrobotics.kr', telefono: '+82 2 555-2233', pais: 'Corea del Sur', ciudad: 'Seúl', tipoSuministro: 'Mecánica', estado: 'Activo', fechaRegistro: '2026-03-05' },
    { empresa: 'SecureOrbit Cybersecurity', contacto: 'Noa Cohen', correo: 'ncohen@secureorbit.il', telefono: '+972 3 555-6677', pais: 'Israel', ciudad: 'Tel Aviv', tipoSuministro: 'Seguridad', estado: 'Activo', fechaRegistro: '2026-04-15' },
    { empresa: 'GroundLink Infrastructure', contacto: 'Oliver Hughes', correo: 'ohughes@groundlink.au', telefono: '+61 2 555-8899', pais: 'Australia', ciudad: 'Canberra', tipoSuministro: 'Infraestructura', estado: 'Activo', fechaRegistro: '2026-05-01' },
    { empresa: 'Microchip Orbital', contacto: 'Mei-Ling Chen', correo: 'mlchen@microchiporbital.tw', telefono: '+886 2 555-1122', pais: 'Taiwán', ciudad: 'Taipéi', tipoSuministro: 'Componentes Electrónicos', estado: 'Activo', fechaRegistro: '2026-03-12' },
    { empresa: 'CryoFuel Systems', contacto: 'Erik Johansson', correo: 'ejohansson@cryofuel.no', telefono: '+47 2 555-3344', pais: 'Noruega', ciudad: 'Oslo', tipoSuministro: 'Propulsión', estado: 'Activo', fechaRegistro: '2026-04-20' },
    { empresa: 'BlueStar Optics', contacto: 'Lukas Fischer', correo: 'lfischer@bluestaroptics.ch', telefono: '+41 44 555-7788', pais: 'Suiza', ciudad: 'Zúrich', tipoSuministro: 'Componentes Electrónicos', estado: 'Inactivo', fechaRegistro: '2026-02-25' }
  ];

  const CLIENT_OBSERVATIONS = [
    '', '', '', 'Cliente prioritario con contrato marco.', 'Requiere facturación mensual.', '',
    'Interesado en nuevos lanzamientos.', '', 'Cuenta con certificación de calidad.', '', '',
    'Solicita informes trimestrales.', '', 'Cliente internacional con requisitos aduaneros.', ''
  ];

  const PRODUCT_OBSERVATIONS = [
    '', '', 'Artículo de alta demanda.', 'Bajo control de inventario.', '', 'Requiere almacenamiento sellado.',
    '', 'Producto nuevo en catálogo.', '', '', 'Lote con certificación especial.', ''
  ];

  const ORDER_OBSERVATIONS = [
    '', '', 'Entrega urgente solicitada.', 'Confirmar disponibilidad de stock.', '', 'Coordinación con logística aduanera.',
    '', 'Pago contra entrega.', '', 'Cliente verificó precios previamente.', ''
  ];

  const ORDER_STATUSES = [
    { estado: 'Pendiente', peso: 0.4 },
    { estado: 'En Proceso', peso: 0.35 },
    { estado: 'Entregado', peso: 0.25 }
  ];

  const mulberry32 = (seed) => {
    let state = seed;
    return () => {
      state |= 0;
      state = (state + 0x6D2B79F5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const pad = (value, length = 4) => String(value).padStart(length, '0');

  const randInt = (rng, min, max) => Math.floor(rng() * (max - min + 1)) + min;

  const pick = (rng, list) => list[Math.floor(rng() * list.length)];

  const shuffle = (rng, list) => {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const round2 = (value) => Math.round(value * 100) / 100;

  const slug = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');

  const parseDate = (date) => {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1, 2);
    const day = pad(date.getDate(), 2);
    return `${year}-${month}-${day}`;
  };

  const randomDate = (rng, start, end) => {
    const startMs = parseDate(start).getTime();
    const endMs = parseDate(end).getTime();
    return formatDate(new Date(startMs + rng() * (endMs - startMs)));
  };

  const addDays = (date, days) => {
    const parsed = parseDate(date);
    parsed.setDate(parsed.getDate() + days);
    return formatDate(parsed);
  };

  const weightedStatus = (rng) => {
    const roll = rng();
    let accumulator = 0;
    for (let i = 0; i < ORDER_STATUSES.length; i += 1) {
      accumulator += ORDER_STATUSES[i].peso;
      if (roll <= accumulator) return ORDER_STATUSES[i].estado;
    }
    return 'Pendiente';
  };

  const generarSuppliers = (rng) => {
    return SUPPLIER_SEED.map((item, index) => ({
      proveedorId: `PRV-${pad(index + 1)}`,
      empresa: item.empresa,
      contacto: item.contacto,
      correo: item.correo,
      telefono: item.telefono,
      pais: item.pais,
      ciudad: item.ciudad,
      direccion: `${randInt(rng, 100, 9999)} ${pick(rng, ['Av.', 'Calle', 'Blvd.', 'Camino', 'Ruta'])} ${pick(rng, ['Central', 'Norte', 'Sur', 'Este', 'Oeste'])}`,
      tipoSuministro: item.tipoSuministro,
      estado: item.estado,
      fechaRegistro: item.fechaRegistro,
      observaciones: ''
    }));
  };

  const generarProducts = (rng, suppliers) => {
    const suppliersByType = {};
    suppliers.forEach((supplier) => {
      if (!suppliersByType[supplier.tipoSuministro]) suppliersByType[supplier.tipoSuministro] = [];
      suppliersByType[supplier.tipoSuministro].push(supplier);
    });

    return PRODUCT_TEMPLATES.map(([nombre, categoria, unidad], index) => {
      const fabricante = pick(rng, FABRICANTES[categoria]);
      const supplyType = CATEGORY_TO_SUPPLY[categoria];
      const supplierPool = suppliersByType[supplyType] || suppliers;
      const proveedor = pick(rng, supplierPool);
      const lowStock = rng() < 0.25;
      const estadoRoll = rng();
      const estado = estadoRoll < 0.68 ? 'Disponible' : estadoRoll < 0.82 ? 'En Producción' : estadoRoll < 0.94 ? 'Agotado' : 'Descontinuado';
      const cantidad = estado === 'Agotado' ? 0 : estado === 'Descontinuado' ? randInt(rng, 0, 6) : lowStock ? randInt(rng, 0, 5) : randInt(rng, 6, 200);
      const fechaIngreso = randomDate(rng, '2025-01-01', '2026-08-10');
      const year = fechaIngreso.slice(0, 4);

      return {
        productoId: `PRD-${pad(index + 1)}`,
        nombre,
        categoria,
        descripcion: `Componente de ${categoria} de alta confiabilidad certificado para uso aeroespacial.`,
        codigo: `SN-${year}-${pad(randInt(rng, 1, 9999))}`,
        fabricante,
        cantidad,
        precio: round2(randInt(rng, 5, 950) * 1000),
        unidadMedida: unidad,
        estado,
        fechaIngreso,
        ubicacion: `Almacén ${String.fromCharCode(65 + randInt(rng, 0, 5))} - Estante ${randInt(rng, 1, 9)}`,
        proveedorId: proveedor.proveedorId,
        observaciones: pick(rng, PRODUCT_OBSERVATIONS)
      };
    });
  };

  const generarClients = (rng) => {
    return Array.from({ length: TOTAL_CLIENTS }, (_, index) => {
      const first = pick(rng, FIRST_NAMES);
      const last = pick(rng, LAST_NAMES);
      const company = pick(rng, COMPANIES);
      const country = pick(rng, COUNTRIES);
      const telefono = `+${country.codigo} ${randInt(rng, 2000, 8999)}-${pad(randInt(rng, 0, 9999), 4)}`;

      return {
        clienteId: `CLI-${pad(index + 1)}`,
        nombre: `${first} ${last}`,
        empresa: company,
        correo: `${slug(first)}.${slug(last)}@${slug(company)}.com`,
        telefono,
        pais: country.pais,
        ciudad: country.ciudad,
        direccion: `${randInt(rng, 100, 9999)} ${pick(rng, ['Av.', 'Calle', 'Blvd.', 'Camino', 'Ruta'])} ${pick(rng, ['Central', 'Norte', 'Sur', 'Este', 'Oeste'])}`,
        tipoCliente: pick(rng, CLIENT_TYPES),
        estado: rng() < 0.72 ? 'Activo' : 'Inactivo',
        fechaRegistro: randomDate(rng, '2024-01-01', '2026-08-10'),
        observaciones: pick(rng, CLIENT_OBSERVATIONS)
      };
    });
  };

  const generarOrders = (rng, clients, products) => {
    return Array.from({ length: TOTAL_ORDERS }, (_, index) => {
      const client = pick(rng, clients);
      const itemCount = randInt(rng, 1, 5);
      const selectedProducts = shuffle(rng, products).slice(0, itemCount);
      const items = selectedProducts.map((product) => ({
        productoId: product.productoId,
        nombre: product.nombre,
        proveedorId: product.proveedorId,
        cantidad: randInt(rng, 1, 20),
        precioUnitario: product.precio
      }));
      const cantidadArticulos = items.reduce((sum, item) => sum + item.cantidad, 0);
      const subtotal = round2(items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0));
      const iva = round2(subtotal * 0.13);
      const total = round2(subtotal + iva);
      const estado = weightedStatus(rng);
      const fechaPedido = randomDate(rng, '2026-01-01', '2026-08-10');

      return {
        pedidoId: `PED-${pad(index + 1)}`,
        clienteId: client.clienteId,
        fechaPedido,
        estado,
        items,
        cantidadArticulos,
        subtotal,
        iva,
        total,
        fechaEntrega: estado === 'Entregado' ? addDays(fechaPedido, randInt(rng, 5, 30)) : '',
        observaciones: pick(rng, ORDER_OBSERVATIONS)
      };
    });
  };

  const generarDataset = () => {
    const rng = mulberry32(20260810);
    const suppliers = generarSuppliers(rng);
    const products = generarProducts(rng, suppliers);
    const clients = generarClients(rng);
    const orders = generarOrders(rng, clients, products);

    return {
      clients,
      products,
      suppliers,
      orders
    };
  };

  const sembrar = () => {
    const dataset = generarDataset();
    window.FWDData.replaceAll(dataset);
    const total = Object.values(dataset).reduce((sum, collection) => sum + collection.length, 0);
    console.info(`[Stellarix] Base de datos de demostración generada: ${total} registros.`);
    return dataset;
  };

  const reiniciar = () => {
    window.FWDData.reset();
    return sembrar();
  };

  window.FWDSeed = {
    generarDataset,
    sembrar,
    reiniciar
  };

  const init = () => {
    if (typeof window.FWDData === 'undefined') return;
    if (!window.FWDData.hasData()) {
      sembrar();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
