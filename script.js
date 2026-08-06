const STORAGE_KEY = 'fwd-login-credentials';
const USERS_KEY = 'fwd-registered-users';
const ACTIVE_USER_KEY = 'fwd-active-user';
const PRODUCTS_KEY = 'fwd-products';
const SUPPLIERS_KEY = 'fwd-suppliers';

const defaultCredentials = {
  username: 'FWD',
  password: '1234'
};

function getStorageItem(key, fallback = null) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
}

function saveStorageItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStoredCredentials() {
  return getStorageItem(STORAGE_KEY, defaultCredentials);
}

function saveStoredCredentials(credentials) {
  saveStorageItem(STORAGE_KEY, credentials);
}

function getUsers() {
  return getStorageItem(USERS_KEY, []);
}

function saveUsers(users) {
  saveStorageItem(USERS_KEY, users);
}

function getActiveUser() {
  return getStorageItem(ACTIVE_USER_KEY, null);
}

function saveActiveUser(user) {
  saveStorageItem(ACTIVE_USER_KEY, user);
}

function clearActiveUser() {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

function getDisplayName(user) {
  if (!user) return 'Usuario';

  const fullName = [user.nombre, user.apellido].filter(Boolean).join(' ').trim();
  return fullName || user.name || user.username || 'Usuario';
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'U';
}

if (!localStorage.getItem(STORAGE_KEY)) {
  saveStoredCredentials(defaultCredentials);
}

const loginForm = document.getElementById('loginForm');
const registrationForm = document.getElementById('registroForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('errorMsg');
const togglePasswordButton = document.getElementById('togglePassword');

function showErrorMessage() {
  if (errorMsg) {
    errorMsg.classList.remove('hidden');
    errorMsg.textContent = 'Usuario o contraseña incorrectos';
  }
}

function hideErrorMessage() {
  if (errorMsg) {
    errorMsg.classList.add('hidden');
    errorMsg.textContent = '';
  }
}

function showLoginErrorAlert() {
  Swal.fire({
    title: 'Error',
    text: 'Credenciales incorrectas',
    icon: 'error'
  });
}

function showLoginSuccessAlert() {
  Swal.fire({
    title: 'Credenciales correctas',
    text: 'Acceso concedido',
    icon: 'success'
  }).then(() => {
    window.location.href = 'Dashboard.html';
  });
}

function showRegistrationSuccessAlert() {
  Swal.fire({
    title: 'Registro exitoso',
    text: 'Tu cuenta fue creada correctamente.',
    icon: 'success'
  }).then(() => {
    window.location.href = 'index.html';
  });
}

if (togglePasswordButton && passwordInput) {
  togglePasswordButton.addEventListener('click', () => {
    const isPasswordHidden = passwordInput.getAttribute('type') === 'password';
    const nextType = isPasswordHidden ? 'text' : 'password';
    const nextLabel = isPasswordHidden ? 'Ocultar contraseña' : 'Mostrar contraseña';

    passwordInput.setAttribute('type', nextType);
    togglePasswordButton.setAttribute('aria-label', nextLabel);
    togglePasswordButton.setAttribute('title', nextLabel);
    togglePasswordButton.classList.toggle('visible', isPasswordHidden);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const enteredUsername = usernameInput?.value.trim() || '';
    const enteredPassword = passwordInput?.value.trim() || '';

    const storedCredentials = getStoredCredentials();
    const registeredUsers = getUsers();

    const matchesDefault =
      enteredUsername === storedCredentials.username &&
      enteredPassword === storedCredentials.password;

    const matchedUser = registeredUsers.find(
      (user) =>
        user.username.toLowerCase() === enteredUsername.toLowerCase() &&
        user.password === enteredPassword
    );

    if (matchesDefault || matchedUser) {
      hideErrorMessage();
      const authUser = matchedUser || {
        username: enteredUsername,
        nombre: enteredUsername,
        apellido: ''
      };

      saveActiveUser(authUser);
      showLoginSuccessAlert();
    } else {
      showErrorMessage();
      showLoginErrorAlert();
    }
  });
}

if (registrationForm) {
  registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre = document.getElementById('nombre')?.value.trim() || '';
    const apellido = document.getElementById('apellido')?.value.trim() || '';
    const usuario = document.getElementById('usuario')?.value.trim() || '';
    const password = document.getElementById('password')?.value.trim() || '';

    if (!nombre || !apellido || !usuario || !password) {
      Swal.fire({
        title: 'Datos incompletos',
        text: 'Completá todos los campos para registrar tu cuenta.',
        icon: 'warning'
      });
      return;
    }

    const users = getUsers();
    const alreadyExists = users.some(
      (user) => user.username.toLowerCase() === usuario.toLowerCase()
    );

    if (alreadyExists) {
      Swal.fire({
        title: 'Ese usuario ya existe',
        text: 'Elegí otro nombre de usuario o iniciá sesión.',
        icon: 'warning'
      });
      return;
    }

    const newUser = {
      username: usuario,
      nombre,
      apellido,
      password
    };

    users.push(newUser);
    saveUsers(users);
    saveActiveUser(newUser);
    showRegistrationSuccessAlert();
  });
}

function setupDashboardUser() {
  const activeUser = getActiveUser();
  const welcomeTitle = document.getElementById('titulo-bienvenida');
  const userNameElement = document.querySelector('.dashboard__user-name');
  const userInitialsElement = document.querySelector('.dashboard__user-initials');

  if (!activeUser) {
    Swal.fire({
      title: 'Sesión no iniciada',
      text: 'Debés iniciar sesión para ver el dashboard.',
      icon: 'warning'
    }).then(() => {
      window.location.href = 'index.html';
    });
    return;
  }

  const displayName = getDisplayName(activeUser);

  if (welcomeTitle) {
    welcomeTitle.textContent = `Bienvenido/a de nuevo, ${displayName}`;
  }

  if (userNameElement) {
    userNameElement.textContent = displayName;
  }

  if (userInitialsElement) {
    userInitialsElement.textContent = getInitials(displayName);
  }
}

function setupNavigation() {
  document.querySelectorAll('a[href="#productos"], a[href="Productos.html"], a[href="#Proveedores"], a[href="#proveedores"], a[href="Proveedores.html"], a[href="#clientes"], a[href="Clientes.html"], a[href="clientes.html"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');

      if (href === '#productos') {
        event.preventDefault();
        window.location.href = 'Productos.html';
      } else if (href === '#Proveedores' || href === '#proveedores') {
        event.preventDefault();
        window.location.href = 'Proveedores.html';
      } else if (href === '#clientes') {
        event.preventDefault();
        window.location.href = 'Clientes.html';
      }
    });
  });

  const logoutLink = document.querySelector('a[href="index.html"]');
  if (logoutLink && logoutLink.textContent.includes('Cerrar sesión')) {
    logoutLink.addEventListener('click', (event) => {
      event.preventDefault();
      clearActiveUser();
      window.location.href = 'index.html';
    });
  }
}

function getProducts() {
  return getStorageItem(PRODUCTS_KEY, []);
}

function saveProducts(products) {
  saveStorageItem(PRODUCTS_KEY, products);
}

function seedProducts() {
  if (getProducts().length > 0) return;

  const initialProducts = [
    {
      id: 'PRD-0001',
      nombre: 'Motor de Propulsión XR-90',
      categoria: 'Propulsión',
      codigo: 'SN-2026-0012',
      fabricante: 'Stellarix Propulsion',
      cantidad: '24',
      precio: '850000',
      unidadMedida: 'u',
      estado: 'Disponible',
      fechaIngreso: '2026-02-10',
      ubicacion: 'Almacén A',
      observaciones: 'Alta demanda'
    },
    {
      id: 'PRD-0002',
      nombre: 'Panel Solar Satelital PS-1200',
      categoria: 'Energía',
      codigo: 'SN-2026-0145',
      fabricante: 'Stellarix Energy',
      cantidad: '140',
      precio: '320000',
      unidadMedida: 'u',
      estado: 'Disponible',
      fechaIngreso: '2026-02-18',
      ubicacion: 'Almacén B',
      observaciones: 'Stock estable'
    }
  ];

  saveProducts(initialProducts);
}

function renderProducts() {
  const tableBody = document.querySelector('.productos__tbody');
  if (!tableBody) return;

  const products = getProducts();
  tableBody.innerHTML = '';

  if (products.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No hay productos registrados.</td></tr>';
    return;
  }

  products.forEach((product) => {
    const row = document.createElement('tr');
    row.className = 'productos__fila';
    row.innerHTML = `
      <td class="productos__celda">${product.id}</td>
      <td class="productos__celda">${product.nombre}</td>
      <td class="productos__celda">${product.categoria}</td>
      <td class="productos__celda">${product.codigo}</td>
      <td class="productos__celda">${product.fabricante}</td>
      <td class="productos__celda">${product.cantidad}</td>
      <td class="productos__celda">$ ${Number(product.precio).toLocaleString('es-AR')}</td>
      <td class="productos__celda">${product.estado}</td>
      <td class="productos__celda">${product.fechaIngreso}</td>
      <td class="productos__celda">Registrar / Editar</td>
    `;
    tableBody.appendChild(row);
  });
}

function getSuppliers() {
  return getStorageItem(SUPPLIERS_KEY, []);
}

function saveSuppliers(suppliers) {
  saveStorageItem(SUPPLIERS_KEY, suppliers);
}

function seedSuppliers() {
  if (getSuppliers().length > 0) return;

  const initialSuppliers = [
    {
      id: 'PRV-0001',
      empresa: 'Helios Propulsión SA',
      contacto: 'Ricardo Alonso',
      correo: 'ralonso@heliosprop.com',
      telefono: '+34 91 444-7788',
      pais: 'España',
      ciudad: 'Madrid',
      direccion: 'Av. Espacial 123',
      tipoSuministro: 'Propulsión',
      estado: 'Activo',
      fechaRegistro: '2026-01-15',
      observaciones: 'Proveedor clave'
    }
  ];

  saveSuppliers(initialSuppliers);
}

function renderSuppliers() {
  const tableBody = document.querySelector('.proveedores__tbody');
  if (!tableBody) return;

  const suppliers = getSuppliers();
  tableBody.innerHTML = '';

  if (suppliers.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No hay proveedores registrados.</td></tr>';
    return;
  }

  suppliers.forEach((supplier) => {
    const row = document.createElement('tr');
    row.className = 'proveedores__fila';
    row.innerHTML = `
      <td class="proveedores__celda">${supplier.id}</td>
      <td class="proveedores__celda">${supplier.empresa}</td>
      <td class="proveedores__celda">${supplier.contacto}</td>
      <td class="proveedores__celda">${supplier.correo}</td>
      <td class="proveedores__celda">${supplier.telefono}</td>
      <td class="proveedores__celda">${supplier.pais}</td>
      <td class="proveedores__celda">${supplier.tipoSuministro}</td>
      <td class="proveedores__celda">${supplier.estado}</td>
      <td class="proveedores__celda">${supplier.fechaRegistro}</td>
      <td class="proveedores__celda">Registrar / Editar</td>
    `;
    tableBody.appendChild(row);
  });
}

function setupProductsAndSuppliers() {
  const productForm = document.getElementById('productoForm');
  const supplierForm = document.getElementById('proveedorForm');

  if (productForm) {
    seedProducts();
    renderProducts();

    productForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(productForm);
      const product = Object.fromEntries(formData.entries());
      const products = getProducts();

      products.push(product);
      saveProducts(products);
      renderProducts();
      productForm.reset();

      Swal.fire({
        title: 'Producto registrado',
        text: 'El producto se guardó correctamente.',
        icon: 'success'
      });
    });
  }

  if (supplierForm) {
    seedSuppliers();
    renderSuppliers();

    supplierForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(supplierForm);
      const supplier = Object.fromEntries(formData.entries());
      const suppliers = getSuppliers();

      suppliers.push(supplier);
      saveSuppliers(suppliers);
      renderSuppliers();
      supplierForm.reset();

      Swal.fire({
        title: 'Proveedor registrado',
        text: 'El proveedor se guardó correctamente.',
        icon: 'success'
      });
    });
  }
}

function createSpaceBackground() {
  if (document.getElementById('spaceCanvas')) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.id = 'spaceCanvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const stars = [];
  const planets = [];
  const blackHoles = [];

  function createScene() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars.length = 0;
    planets.length = 0;
    blackHoles.length = 0;

    const starCount = width > 900 ? 140 : 90;
    for (let i = 0; i < starCount; i += 1) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.25 + 0.05
      });
    }

    const planetCount = width > 900 ? 3 : 2;
    for (let i = 0; i < planetCount; i += 1) {
      planets.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        radius: Math.random() * 24 + 14,
        color: i === 0 ? '#6fd6ff' : '#b99cff',
        speed: (Math.random() * 0.002 + 0.001) * (i % 2 === 0 ? 1 : -1),
        offset: Math.random() * Math.PI * 2
      });
    }

    const blackHoleCount = width > 900 ? 2 : 1;
    for (let i = 0; i < blackHoleCount; i += 1) {
      blackHoles.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.8,
        radius: Math.random() * 18 + 14,
        glow: Math.random() * 0.3 + 0.3
      });
    }
  }

  function animate() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    const background = ctx.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, '#020611');
    background.addColorStop(1, '#071224');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    stars.forEach((star) => {
      star.y += star.speed;
      if (star.y > height + 5) {
        star.y = -5;
        star.x = Math.random() * width;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.fill();
    });

    planets.forEach((planet, index) => {
      planet.offset += planet.speed;
      const driftX = Math.sin(planet.offset) * (30 + index * 12);
      const driftY = Math.cos(planet.offset * 0.7) * (20 + index * 8);

      ctx.beginPath();
      ctx.arc(planet.x + driftX, planet.y + driftY, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.globalAlpha = 0.82;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    blackHoles.forEach((hole) => {
      const gradient = ctx.createRadialGradient(hole.x, hole.y, 2, hole.x, hole.y, hole.radius * 2.3);
      gradient.addColorStop(0, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(0.3, 'rgba(0,0,0,0.4)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.95)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.radius * 2.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  createScene();
  animate();
  window.addEventListener('resize', createScene);
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

if (currentPage === 'Dashboard.html') {
  setupDashboardUser();
  setupNavigation();
} else if (currentPage === 'Clientes.html') {
  const activeUser = getActiveUser();
  if (!activeUser) {
    Swal.fire({
      title: 'Sesión no iniciada',
      text: 'Debés iniciar sesión para ver la vista de clientes.',
      icon: 'warning'
    }).then(() => {
      window.location.href = 'index.html';
    });
  } else {
    setupNavigation();
  }
} else if (currentPage === 'Productos.html' || currentPage === 'Proveedores.html') {
  const activeUser = getActiveUser();
  if (!activeUser) {
    Swal.fire({
      title: 'Sesión no iniciada',
      text: 'Debés iniciar sesión para ver esta vista.',
      icon: 'warning'
    }).then(() => {
      window.location.href = 'index.html';
    });
  } else {
    setupNavigation();
    setupProductsAndSuppliers();
  }
}

createSpaceBackground();