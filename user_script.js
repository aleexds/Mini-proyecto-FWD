(() => {
  const STORAGE_KEYS = {
    users: 'fwd-registered-users',
    activeUser: 'fwd-active-user',
    theme: 'fwd-user-theme',
    orders: 'fwd-user-orders'
  };

  const defaultUser = {
    username: 'CarlosM',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    empresa: 'SatTech Corp'
  };

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

  function getActiveUser() {
    return readStorage(STORAGE_KEYS.activeUser, defaultUser);
  }

  function getDisplayName(user) {
    if (!user) return 'Dr. Carlos Mendoza';
    const fullName = [user.nombre, user.apellido].filter(Boolean).join(' ').trim();
    return fullName ? `Dr./Dra. ${fullName}` : 'Dr. Carlos Mendoza';
  }

  function getInitials(name) {
    const cleanName = name.replace(/^Dr\.\/?Dra\.\s*/, '');
    return cleanName.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'CM';
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

  function setupUserProfile() {
    const activeUser = getActiveUser();
    const welcomeTitle = document.getElementById('titulo-bienvenida');
    const clientNameDisplay = document.getElementById('client-name-display');
    const initialsElement = document.getElementById('client-initials');
    const avatarElement = document.getElementById('client-avatar');
    const changeAvatarBtn = document.getElementById('change-client-avatar');
    const fileInput = document.getElementById('client-avatar-input');

    const displayName = getDisplayName(activeUser);
    if (welcomeTitle) welcomeTitle.textContent = `Bienvenido/a, ${displayName}`;
    if (clientNameDisplay) clientNameDisplay.textContent = displayName;
    if (initialsElement) initialsElement.textContent = getInitials(displayName);

    if (avatarElement) {
      const avatarValue = activeUser.avatar || '';
      if (avatarValue) {
        avatarElement.src = avatarValue;
        avatarElement.hidden = false;
        avatarElement.style.display = 'block';
        if (initialsElement) initialsElement.style.display = 'none';
      } else {
        avatarElement.removeAttribute('src');
        avatarElement.hidden = true;
        avatarElement.style.display = 'none';
        if (initialsElement) initialsElement.style.display = 'flex';
      }
    }

    if (changeAvatarBtn && fileInput) {
      changeAvatarBtn.addEventListener('click', () => fileInput.click());
      fileInput.onchange = () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result;
          const updatedUser = { ...activeUser, avatar: imageData };
          writeStorage(STORAGE_KEYS.activeUser, updatedUser);
          setupUserProfile();
          showToast('Foto de perfil de cliente actualizada', 'success');
        };
        reader.readAsDataURL(file);
      };
    }
  }

  function setupCatalogSearch() {
    const searchInput = document.getElementById('catalog-filter');
    const catalogCards = document.querySelectorAll('.product-card');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        catalogCards.forEach((card) => {
          const text = (card.dataset.name || card.textContent).toLowerCase();
          card.style.display = !term || text.includes(term) ? '' : 'none';
        });
      });
    }
  }

  function setupPurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    const openBtn = document.getElementById('open-purchase-modal');
    const closeBtn = document.getElementById('close-purchase-modal');
    const cancelBtn = document.getElementById('cancel-purchase-btn');
    const purchaseForm = document.getElementById('purchaseForm');

    const itemNameInput = document.getElementById('modal-item-name');
    const quantityInput = document.getElementById('modal-quantity');
    const unitPriceInput = document.getElementById('modal-unit-price');
    const totalDisplay = document.getElementById('modal-total-display');

    function calculateTotal() {
      const qty = parseFloat(quantityInput.value) || 1;
      const price = parseFloat(unitPriceInput.value) || 0;
      const total = qty * price;
      totalDisplay.textContent = `$ ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })} USD`;
      return total;
    }

    function openModal(itemName = '', unitPrice = 0) {
      if (!modal) return;
      itemNameInput.value = itemName;
      quantityInput.value = 1;
      unitPriceInput.value = unitPrice ? unitPrice : '';
      calculateTotal();
      modal.hidden = false;
    }

    function closeModal() {
      if (!modal) return;
      modal.hidden = true;
      purchaseForm.reset();
    }

    if (openBtn) openBtn.addEventListener('click', () => openModal());
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    quantityInput?.addEventListener('input', calculateTotal);
    unitPriceInput?.addEventListener('input', calculateTotal);

    document.querySelectorAll('.buy-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.dataset.item || 'Componente Aeroespacial';
        const price = parseFloat(btn.dataset.price) || 0;
        openModal(item, price);
      });
    });

    document.querySelectorAll('.contract-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const service = btn.dataset.service || 'Servicio Misión Orbital';
        const price = parseFloat(btn.dataset.price) || 0;
        openModal(service, price);
      });
    });

    document.getElementById('open-telemetry-modal')?.addEventListener('click', () => {
      openModal('Ampliación Red Telemetría y Estación Terrena', 150000);
    });

    if (purchaseForm) {
      purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const item = itemNameInput.value.trim();
        const qty = parseInt(quantityInput.value, 10) || 1;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        const total = calculateTotal();

        if (!item || total <= 0) {
          Swal.fire({ title: 'Datos Incompletos', text: 'Por favor complete el nombre e importe del pedido.', icon: 'warning' });
          return;
        }

        const newOrder = {
          id: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
          servicio: `${item} (x${qty})`,
          tipo: 'Compra Corporativa',
          estado: 'Solicitud Procesada',
          fecha: new Date().toISOString().split('T')[0],
          total: `$ ${total.toLocaleString('es-AR')} USD`
        };

        addOrderToTable(newOrder);
        closeModal();

        Swal.fire({
          title: '¡Orden de Compra Emitida!',
          text: `Su solicitud para "${item}" ha sido procesada con éxito por Stellarix Space Systems.`,
          icon: 'success',
          confirmButtonText: 'Entendido'
        });

        showToast('Su contrato ha sido registrado correctamente', 'success');
      });
    }
  }

  function addOrderToTable(order) {
    const tbody = document.getElementById('user-orders-tbody');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.servicio}</td>
      <td>${order.tipo}</td>
      <td><span class="status warning">${order.estado}</span></td>
      <td>${order.fecha}</td>
      <td>${order.total}</td>
      <td><button class="btn-xs-action view-detail-btn" data-id="${order.id}" type="button">Ver Detalle</button></td>
    `;

    tbody.insertBefore(row, tbody.firstChild);

    row.querySelector('.view-detail-btn')?.addEventListener('click', () => {
      Swal.fire({
        title: `Detalle ${order.id}`,
        html: `<strong>Servicio:</strong> ${order.servicio}<br><strong>Estado:</strong> ${order.estado}<br><strong>Monto:</strong> ${order.total}`,
        icon: 'info'
      });
    });
  }

  function setupOrderActions() {
    document.querySelectorAll('.view-detail-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id || 'Orden';
        Swal.fire({
          title: `Detalle del Contrato ${id}`,
          text: 'Su orden se encuentra en fase de certificación y pruebas de laboratorio aprobadas.',
          icon: 'info'
        });
      });
    });

    document.getElementById('refresh-orders')?.addEventListener('click', () => {
      showToast('Actualizando estado de contratos en órbita...', 'info');
    });
  }

  function setupThemeAndCanvas() {
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
      themeButton.textContent = next === 'dark' ? '☀️' : '🌙';
      writeStorage(STORAGE_KEYS.theme, next);
      showToast(next === 'dark' ? 'Modo oscuro activado' : 'Modo claro activado', 'info');
    });
    toolbar.appendChild(themeButton);

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

  function init() {
    setupUserProfile();
    setupCatalogSearch();
    setupPurchaseModal();
    setupOrderActions();
    setupThemeAndCanvas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
