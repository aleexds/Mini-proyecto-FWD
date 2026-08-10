(() => {
  const STORAGE_KEYS = {
    users: 'fwd-registered-users',
    activeUser: 'fwd-active-user',
    theme: 'fwd-theme',
    dragItems: 'fwd-drag-items',
    clients: 'fwd-clients',
    products: 'fwd-products',
    suppliers: 'fwd-suppliers'
  };

  const defaultUser = {
    username: 'FWD',
    password: '1234',
    nombre: 'FWD',
    apellido: 'Admin'
  };

  const pageName = window.location.pathname.split('/').pop() || 'index.html';

  const safeParse = (value, fallback) => {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  function readStorage(key, fallback = null) {
    return safeParse(localStorage.getItem(key), fallback);
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getUsers() {
    const users = readStorage(STORAGE_KEYS.users, []);
    if (!Array.isArray(users)) return [defaultUser];
    if (!users.some((user) => user.username && user.username.toLowerCase() === defaultUser.username.toLowerCase())) {
      users.unshift(defaultUser);
      writeStorage(STORAGE_KEYS.users, users);
    }
    return users;
  }

  function saveUsers(users) {
    writeStorage(STORAGE_KEYS.users, users);
  }

  function getActiveUser() {
    return readStorage(STORAGE_KEYS.activeUser, null);
  }

  function saveActiveUser(user) {
    writeStorage(STORAGE_KEYS.activeUser, user);
  }

  function clearActiveUser() {
    localStorage.removeItem(STORAGE_KEYS.activeUser);
  }

  function getDisplayName(user) {
    if (!user) return 'Usuario';
    const fullName = [user.nombre, user.apellido].filter(Boolean).join(' ').trim();
    return fullName || user.username || 'Usuario';
  }

  function getInitials(name) {
    return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'U';
  }

  function showToast(message, type = 'info') {
    if (typeof Toastify === 'undefined') return;
    const palette = { success: '#24b47e', error: '#e5484d', info: '#3b82f6', warning: '#f59e0b' };
    Toastify({
      text: message,
      duration: 3500,
      close: true,
      gravity: 'top',
      position: 'right',
      style: { background: palette[type] || palette.info }
    }).showToast();
  }

  function setupAuth() {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registroForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('errorMsg');

    function setLoginError() {
      if (errorMsg) {
        errorMsg.classList.remove('hidden');
        errorMsg.textContent = 'Usuario o contraseña incorrectos';
      }
    }

    function clearLoginError() {
      if (errorMsg) {
        errorMsg.classList.add('hidden');
        errorMsg.textContent = '';
      }
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const enteredUsername = usernameInput?.value.trim() || '';
        const enteredPassword = passwordInput?.value.trim() || '';
        const users = getUsers();
        const matchedUser = users.find((user) => user.username.toLowerCase() === enteredUsername.toLowerCase() && user.password === enteredPassword);

        if (matchedUser) {
          clearLoginError();
          saveActiveUser(matchedUser);
          showToast('¡Ingreso exitoso! Has entrado a la página de inicio.', 'success');
          setTimeout(() => {
            window.location.href = 'Dashboard.html';
          }, 3500);
        } else {
          setLoginError();
          showToast('No pudiste ingresar. Usuario o contraseña incorrectos.', 'error');
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
          Swal.fire({ title: 'Datos incompletos', text: 'Completá todos los campos.', icon: 'warning' });
          return;
        }

        const users = getUsers();
        const exists = users.some((user) => user.username.toLowerCase() === usuario.toLowerCase());
        if (exists) {
          Swal.fire({ title: 'Usuario ya registrado', text: 'Elegí otro nombre de usuario.', icon: 'warning' });
          return;
        }

        const newUser = { username: usuario, nombre, apellido, password };
        users.push(newUser);
        saveUsers(users);
        saveActiveUser(newUser);
        Swal.fire({ title: 'Registro exitoso', text: 'Tu cuenta quedó creada.', icon: 'success' }).then(() => {
          window.location.href = 'index.html';
        });
      });
    }
  }

  function setupNavigation() {
    document.querySelectorAll('a[href="#productos"], a[href="Productos.html"], a[href="#Proveedores"], a[href="#proveedores"], a[href="Proveedores.html"], a[href="#clientes"], a[href="Clientes.html"], a[href="clientes.html"], a[href="index.html"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (href === 'index.html') {
          event.preventDefault();
          clearActiveUser();
          window.location.href = 'index.html';
        } else if (href === '#productos') {
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
  }

  function setupDashboard() {
    if (pageName !== 'Dashboard.html') return;
    const activeUser = getActiveUser();
    if (!activeUser) {
      Swal.fire({ title: 'Sesión requerida', text: 'Debes iniciar sesión primero.', icon: 'warning' }).then(() => {
        window.location.href = 'index.html';
      });
      return;
    }

    const welcomeTitle = document.getElementById('titulo-bienvenida');
    const userNameElement = document.querySelector('.dashboard__user-name');
    const initialsElement = document.getElementById('profile-initials');
    const avatarElement = document.getElementById('profile-avatar');
    const changeAvatarButton = document.getElementById('change-avatar-button');
    const fileInput = document.getElementById('avatar-file-input');
    const displayName = getDisplayName(activeUser);

    if (welcomeTitle) welcomeTitle.textContent = `Bienvenido/a de nuevo, ${displayName}`;
    if (userNameElement) userNameElement.textContent = displayName;
    if (initialsElement) initialsElement.textContent = getInitials(displayName);

    if (avatarElement) {
      const avatarValue = activeUser.avatar || '';
      if (avatarValue) {
        avatarElement.src = avatarValue;
        avatarElement.hidden = false;
        if (initialsElement) initialsElement.style.display = 'none';
      } else {
        avatarElement.removeAttribute('src');
        avatarElement.hidden = true;
        if (initialsElement) initialsElement.style.display = 'flex';
      }
    }

    if (changeAvatarButton && fileInput) {
      changeAvatarButton.addEventListener('click', () => fileInput.click());
      fileInput.onchange = () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result;
          const updatedUser = { ...activeUser, avatar: imageData };
          saveActiveUser(updatedUser);
          const users = getUsers().map((user) => user.username.toLowerCase() === updatedUser.username.toLowerCase() ? updatedUser : user);
          saveUsers(users);
          setupDashboard();
          showToast('Foto de perfil actualizada', 'success');
        };
        reader.readAsDataURL(file);
      };
    }

    const sidebarFooter = document.querySelector('.dashboard__sidebar-footer');
    if (sidebarFooter && !document.getElementById('profile-editor-button')) {
      const button = document.createElement('button');
      button.id = 'profile-editor-button';
      button.type = 'button';
      button.textContent = 'Editar perfil';
      button.style.marginTop = '12px';
      button.style.padding = '8px 12px';
      button.style.border = 'none';
      button.style.borderRadius = '999px';
      button.style.cursor = 'pointer';
      button.addEventListener('click', async () => {
        const result = await Swal.fire({
          title: 'Editar perfil',
          html: `
            <label>Nombre</label>
            <input id="name" class="swal2-input" value="${activeUser.nombre || ''}">
            <label>Apellido</label>
            <input id="lastname" class="swal2-input" value="${activeUser.apellido || ''}">
            <label>Nueva contraseña</label>
            <input id="newPassword" type="password" class="swal2-input" value="${activeUser.password || ''}">
          `,
          showCancelButton: true,
          confirmButtonText: 'Guardar'
        });
        if (!result.isConfirmed) return;
        const updatedUser = { ...activeUser };
        updatedUser.nombre = document.getElementById('name')?.value.trim() || updatedUser.nombre || 'Usuario';
        updatedUser.apellido = document.getElementById('lastname')?.value.trim() || updatedUser.apellido || '';
        updatedUser.password = document.getElementById('newPassword')?.value.trim() || updatedUser.password || '';
        saveActiveUser(updatedUser);
        const users = getUsers().map((user) => user.username.toLowerCase() === updatedUser.username.toLowerCase() ? updatedUser : user);
        saveUsers(users);
        setupDashboard();
        showToast('Perfil actualizado', 'success');
      });
      sidebarFooter.appendChild(button);
    }
  }

  function setupModuleForms() {
    if (pageName === 'Clientes.html') {
      const form = document.getElementById('clienteForm');
      const tbody = document.querySelector('.clientes__tbody');
      if (!form || !tbody) return;
      const render = () => {
        const clients = readStorage(STORAGE_KEYS.clients, []);
        tbody.innerHTML = '';
        if (clients.length === 0) {
          tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No hay clientes registrados.</td></tr>';
          return;
        }
        clients.forEach((client) => {
          const row = document.createElement('tr');
          row.className = 'clientes__fila';
          row.innerHTML = `
            <td class="clientes__celda">${client.clienteId || ''}</td>
            <td class="clientes__celda">${client.nombre || ''}</td>
            <td class="clientes__celda">${client.empresa || ''}</td>
            <td class="clientes__celda">${client.correo || ''}</td>
            <td class="clientes__celda">${client.telefono || ''}</td>
            <td class="clientes__celda">${client.pais || ''}</td>
            <td class="clientes__celda">${client.tipoCliente || ''}</td>
            <td class="clientes__celda">${client.estado || ''}</td>
            <td class="clientes__celda">${client.fechaRegistro || ''}</td>
            <td class="clientes__celda">Editar / Eliminar</td>
          `;
          tbody.appendChild(row);
        });
      };
      render();
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const client = Object.fromEntries(formData.entries());
        const clients = readStorage(STORAGE_KEYS.clients, []);
        clients.push(client);
        writeStorage(STORAGE_KEYS.clients, clients);
        render();
        form.reset();
        Swal.fire({ title: 'Cliente registrado', text: 'El cliente se guardó correctamente.', icon: 'success' });
      });
    }

    if (pageName === 'Productos.html') {
      const form = document.getElementById('productoForm');
      const tbody = document.querySelector('.productos__tbody');
      if (!form || !tbody) return;
      const render = () => {
        const products = readStorage(STORAGE_KEYS.products, []);
        tbody.innerHTML = '';
        if (products.length === 0) {
          tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No hay productos registrados.</td></tr>';
          return;
        }
        products.forEach((product) => {
          const row = document.createElement('tr');
          row.className = 'productos__fila';
          row.innerHTML = `
            <td class="productos__celda">${product.productoId || ''}</td>
            <td class="productos__celda">${product.nombre || ''}</td>
            <td class="productos__celda">${product.categoria || ''}</td>
            <td class="productos__celda">${product.codigo || ''}</td>
            <td class="productos__celda">${product.fabricante || ''}</td>
            <td class="productos__celda">${product.cantidad || ''}</td>
            <td class="productos__celda">$ ${Number(product.precio || 0).toLocaleString('es-AR')}</td>
            <td class="productos__celda">${product.estado || ''}</td>
            <td class="productos__celda">${product.fechaIngreso || ''}</td>
            <td class="productos__celda">Registrar / Editar</td>
          `;
          tbody.appendChild(row);
        });
      };
      render();
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const product = Object.fromEntries(formData.entries());
        const products = readStorage(STORAGE_KEYS.products, []);
        products.push(product);
        writeStorage(STORAGE_KEYS.products, products);
        render();
        form.reset();
        Swal.fire({ title: 'Producto registrado', text: 'El producto se guardó correctamente.', icon: 'success' });
      });
    }

    if (pageName === 'Proveedores.html') {
      const form = document.getElementById('proveedorForm');
      const tbody = document.querySelector('.proveedores__tbody');
      if (!form || !tbody) return;
      const render = () => {
        const suppliers = readStorage(STORAGE_KEYS.suppliers, []);
        tbody.innerHTML = '';
        if (suppliers.length === 0) {
          tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No hay proveedores registrados.</td></tr>';
          return;
        }
        suppliers.forEach((supplier) => {
          const row = document.createElement('tr');
          row.className = 'proveedores__fila';
          row.innerHTML = `
            <td class="proveedores__celda">${supplier.proveedorId || ''}</td>
            <td class="proveedores__celda">${supplier.empresa || ''}</td>
            <td class="proveedores__celda">${supplier.contacto || ''}</td>
            <td class="proveedores__celda">${supplier.correo || ''}</td>
            <td class="proveedores__celda">${supplier.telefono || ''}</td>
            <td class="proveedores__celda">${supplier.pais || ''}</td>
            <td class="proveedores__celda">${supplier.tipoSuministro || ''}</td>
            <td class="proveedores__celda">${supplier.estado || ''}</td>
            <td class="proveedores__celda">${supplier.fechaRegistro || ''}</td>
            <td class="proveedores__celda">Registrar / Editar</td>
          `;
          tbody.appendChild(row);
        });
      };
      render();
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const supplier = Object.fromEntries(formData.entries());
        const suppliers = readStorage(STORAGE_KEYS.suppliers, []);
        suppliers.push(supplier);
        writeStorage(STORAGE_KEYS.suppliers, suppliers);
        render();
        form.reset();
        Swal.fire({ title: 'Proveedor registrado', text: 'El proveedor se guardó correctamente.', icon: 'success' });
      });
    }
  }

  function setupThemeAndEffects() {
    const toolbar = document.createElement('div');
    toolbar.id = 'global-toolbar';
    toolbar.style.position = 'fixed';
    toolbar.style.right = '16px';
    toolbar.style.top = '16px';
    toolbar.style.display = 'flex';
    toolbar.style.gap = '8px';
    toolbar.style.zIndex = '2000';
    toolbar.style.padding = '8px';
    toolbar.style.borderRadius = '999px';
    toolbar.style.background = 'rgba(8, 15, 34, 0.9)';
    toolbar.style.backdropFilter = 'blur(8px)';
    document.body.appendChild(toolbar);

    const savedTheme = readStorage(STORAGE_KEYS.theme, null);
    const initialTheme = savedTheme === 'light' ? 'light' : 'dark';
    document.body.dataset.theme = initialTheme;
    document.body.style.background = initialTheme === 'dark' ? '#07111f' : '#f4f7ff';
    document.body.style.color = initialTheme === 'dark' ? '#f3f6ff' : '#132035';

    const themeButton = document.createElement('button');
    themeButton.type = 'button';
    themeButton.textContent = initialTheme === 'dark' ? '☀️' : '🌙';
    themeButton.style.border = 'none';
    themeButton.style.borderRadius = '999px';
    themeButton.style.padding = '8px 10px';
    themeButton.style.cursor = 'pointer';
    themeButton.addEventListener('click', () => {
      const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      document.body.dataset.theme = next;
      document.body.style.background = next === 'dark' ? '#07111f' : '#f4f7ff';
      document.body.style.color = next === 'dark' ? '#f3f6ff' : '#132035';
      themeButton.textContent = next === 'dark' ? '☀️' : '🌙';
      writeStorage(STORAGE_KEYS.theme, next);
      (next === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado', 'info');
    });
    toolbar.appendChild(themeButton);

    if (pageName === 'Dashboard.html') {
      const searchInput = document.createElement('input');
      searchInput.placeholder = 'Buscar...';
      searchInput.style.border = 'none';
      searchInput.style.borderRadius = '999px';
      searchInput.style.padding = '8px 12px';
      searchInput.style.minWidth = '220px';
      searchInput.addEventListener('input', (event) => {
        const term = event.target.value.toLowerCase();
        document.querySelectorAll('article, section, tr, li, form').forEach((element) => {
          const text = element.textContent.toLowerCase();
          element.style.display = !term || text.includes(term) ? '' : 'none';
        });
      });
      toolbar.appendChild(searchInput);
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const stars = Array.from({ length: 90 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, radius: Math.random() * 1.4 + 0.4, speed: Math.random() * 0.3 + 0.1 }));
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > window.innerHeight) {
          star.y = -10;
          star.x = Math.random() * window.innerWidth;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize);
  }

  function setupInactivityWarning() {
    let timer = null;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        showToast('¿Seguís ahí? No se detecta actividad.', 'warning');
      }, 300000);
    };
    ['mousemove', 'keydown', 'click', 'touchstart'].forEach((eventName) => {
      document.addEventListener(eventName, reset, { passive: true });
    });
    reset();
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        showToast('Cambios guardados', 'success');
      }
    });
  }

  function ensureAuthForProtectedPages() {
    const protectedPages = ['Dashboard.html', 'Clientes.html', 'Productos.html', 'Proveedores.html', 'Misiones.html', 'Empleados.html', 'Reportes.html', 'Configuracion.html'];
    if (protectedPages.includes(pageName) && !getActiveUser()) {
      Swal.fire({ title: 'Sesión requerida', text: 'Debes iniciar sesión antes de entrar.', icon: 'warning' }).then(() => {
        window.location.href = 'index.html';
      });
      return false;
    }
    return true;
  }

  function init() {
    getUsers();
    setupAuth();
    setupNavigation();
    setupThemeAndEffects();
    setupInactivityWarning();
    setupKeyboardShortcuts();
    if (ensureAuthForProtectedPages()) {
      setupDashboard();
      setupModuleForms();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
