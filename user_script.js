(() => {
  const STORAGE_KEYS = {
    users: 'fwd-registered-users',
    activeUser: 'fwd-active-user',
    theme: 'fwd-user-theme',
    orders: 'fwd-user-orders',
    cart: 'fwd-user-cart',
    payments: 'fwd-user-payments'
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

  function getCart() {
    return readStorage(STORAGE_KEYS.cart, []);
  }

  function saveCart(cart) {
    writeStorage(STORAGE_KEYS.cart, cart);
    updateCartUI();
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

  function setupCatalogFiltering() {
    const searchInput = document.getElementById('catalog-filter');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const catalogCards = document.querySelectorAll('.product-card');

    let activeCategory = 'all';
    let searchTerm = '';

    function filterCatalog() {
      catalogCards.forEach((card) => {
        const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
        const text = (card.dataset.name || card.textContent).toLowerCase();
        const matchesSearch = !searchTerm || text.includes(searchTerm);

        card.style.display = matchesCategory && matchesSearch ? '' : 'none';
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase().trim();
        filterCatalog();
      });
    }

    categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach((t) => t.classList.remove('category-tab--active'));
        tab.classList.add('category-tab--active');
        activeCategory = tab.dataset.category || 'all';
        filterCatalog();
      });
    });
  }

  function updateCartUI() {
    const cart = getCart();
    const cartCountEl = document.getElementById('cart-count');
    const cartContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    if (cartCountEl) cartCountEl.textContent = totalQty;

    if (!cartContainer) return;

    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🛒</div>
          <p>Su carrito aeroespacial está vacío.</p>
          <small>Añada componentes del catálogo o misiones para cotizar en conjunto.</small>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$ 0.00 USD';
      if (totalEl) totalEl.textContent = '$ 0.00 USD';
      return;
    }

    cartContainer.innerHTML = '';
    let grandTotal = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.qty;
      grandTotal += itemTotal;

      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <img class="cart-item-img" src="${item.img || 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=200&q=80'}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$ ${item.price.toLocaleString('es-AR')} USD c/u</div>
          <div class="cart-item-qty-wrap">
            <button class="cart-qty-btn qty-minus" data-id="${item.id}" type="button">-</button>
            <span class="cart-qty-num">${item.qty}</span>
            <button class="cart-qty-btn qty-plus" data-id="${item.id}" type="button">+</button>
          </div>
        </div>
        <button class="cart-item-remove remove-item" data-id="${item.id}" title="Eliminar del carrito" type="button">🗑️</button>
      `;

      cartContainer.appendChild(row);
    });

    const formattedTotal = `$ ${grandTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })} USD`;
    if (subtotalEl) subtotalEl.textContent = formattedTotal;
    if (totalEl) totalEl.textContent = formattedTotal;

    cartContainer.querySelectorAll('.qty-minus').forEach((btn) => {
      btn.addEventListener('click', () => changeCartQty(btn.dataset.id, -1));
    });

    cartContainer.querySelectorAll('.qty-plus').forEach((btn) => {
      btn.addEventListener('click', () => changeCartQty(btn.dataset.id, 1));
    });

    cartContainer.querySelectorAll('.remove-item').forEach((btn) => {
      btn.addEventListener('click', () => removeCartItem(btn.dataset.id));
    });
  }

  function addProductToCart(id, name, price, img) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === id);

    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ id, name, price, img, qty: 1 });
    }

    saveCart(cart);
    showToast(`🛒 "${name}" añadido al carrito`, 'success');
  }

  function changeCartQty(id, delta) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    item.qty = (item.qty || 1) + delta;
    if (item.qty <= 0) {
      removeCartItem(id);
      return;
    }

    saveCart(cart);
  }

  function removeCartItem(id) {
    let cart = getCart();
    cart = cart.filter((i) => i.id !== id);
    saveCart(cart);
    showToast('Artículo removido del carrito', 'info');
  }

  function clearCart() {
    saveCart([]);
    showToast('Carrito vaciado', 'info');
  }

  function setupCartDrawer() {
    const drawerOverlay = document.getElementById('cart-drawer-overlay');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const checkoutCartBtn = document.getElementById('checkout-cart-btn');

    function openDrawer() {
      if (!drawerOverlay) return;
      updateCartUI();
      drawerOverlay.hidden = false;
    }

    function closeDrawer() {
      if (!drawerOverlay) return;
      drawerOverlay.hidden = true;
    }

    if (openCartBtn) openCartBtn.addEventListener('click', openDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeDrawer);
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

    if (checkoutCartBtn) {
      checkoutCartBtn.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) {
          Swal.fire({ title: 'Carrito Vacío', text: 'Agregue productos o misiones antes de proceder al contrato.', icon: 'warning' });
          return;
        }

        const summaryNames = cart.map((i) => `${i.name} (x${i.qty})`).join(', ');
        const grandTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

        closeDrawer();

        const modal = document.getElementById('purchase-modal');
        const itemNameInput = document.getElementById('modal-item-name');
        const quantityInput = document.getElementById('modal-quantity');
        const unitPriceInput = document.getElementById('modal-unit-price');
        const totalDisplay = document.getElementById('modal-total-display');

        if (itemNameInput) itemNameInput.value = `Orden Consolidada: ${summaryNames}`;
        if (quantityInput) quantityInput.value = 1;
        if (unitPriceInput) unitPriceInput.value = grandTotal;
        if (totalDisplay) totalDisplay.textContent = `$ ${grandTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })} USD`;

        if (modal) modal.hidden = false;
      });
    }

    document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id || `item-${Math.random()}`;
        const item = btn.dataset.item || 'Componente';
        const price = parseFloat(btn.dataset.price) || 0;
        const img = btn.dataset.img || '';

        addProductToCart(id, item, price, img);
      });
    });
  }

  function setupPaymentMethods() {
    const mainModal = document.getElementById('payment-methods-modal');
    const closeMainModalBtn = document.getElementById('close-payment-methods-modal');
    const navLink = document.getElementById('nav-metodos-pago');

    const addModal = document.getElementById('add-payment-modal');
    const openAddBtn = document.getElementById('open-add-payment-modal');
    const closeAddBtn = document.getElementById('close-payment-modal');
    const cancelAddBtn = document.getElementById('cancel-payment-btn');
    const paymentForm = document.getElementById('addPaymentForm');
    const container = document.getElementById('payment-methods-container');

    function openMainModal(e) {
      if (e) e.preventDefault();
      if (mainModal) mainModal.hidden = false;
    }

    function closeMainModal() {
      if (mainModal) mainModal.hidden = true;
    }

    if (navLink) navLink.addEventListener('click', openMainModal);
    if (closeMainModalBtn) closeMainModalBtn.addEventListener('click', closeMainModal);

    function openAddModal() {
      if (addModal) addModal.hidden = false;
    }

    function closeAddModal() {
      if (addModal) {
        addModal.hidden = true;
        paymentForm?.reset();
      }
    }

    if (openAddBtn) openAddBtn.addEventListener('click', openAddModal);
    if (closeAddBtn) closeAddBtn.addEventListener('click', closeAddModal);
    if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAddModal);

    // Event delegation para "Hacer Predeterminado"
    container?.addEventListener('click', (e) => {
      const defaultBtn = e.target.closest('.set-default-btn');
      if (!defaultBtn) return;

      const targetCard = defaultBtn.closest('.payment-card');
      if (!targetCard) return;

      // Quitar predeterminado de todas las tarjetas
      container.querySelectorAll('.payment-card').forEach((card) => {
        card.classList.remove('payment-card--default');
        const badge = card.querySelector('.payment-card__badge');
        if (badge) badge.remove();

        const btn = card.querySelector('.set-default-btn');
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Hacer Predeterminado';
        }
      });

      // Establecer como predeterminado la tarjeta seleccionada
      targetCard.classList.add('payment-card--default');
      const header = targetCard.querySelector('.payment-card__header');
      if (header && !header.querySelector('.payment-card__badge')) {
        const badge = document.createElement('span');
        badge.className = 'payment-card__badge';
        badge.textContent = 'Predeterminado';
        header.insertBefore(badge, header.firstChild);
      }

      defaultBtn.disabled = true;
      defaultBtn.textContent = 'En Uso';

      showToast('Método de pago establecido como predeterminado', 'success');
    });

    if (paymentForm) {
      paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('payment-type').value;
        const name = document.getElementById('payment-name').value.trim();
        const account = document.getElementById('payment-account').value.trim();
        const limit = parseFloat(document.getElementById('payment-limit').value) || 0;

        if (!name || !account) {
          Swal.fire({ title: 'Datos Incompletos', text: 'Completá todos los campos requeridos.', icon: 'warning' });
          return;
        }

        const newId = `pay-custom-${Date.now()}`;
        const newCard = document.createElement('div');
        newCard.className = 'payment-card';
        newCard.dataset.id = newId;
        newCard.innerHTML = `
          <div class="payment-card__header">
            <span class="payment-card__type">${type}</span>
          </div>
          <div class="payment-card__body">
            <h3 class="payment-card__title">${name}</h3>
            <p class="payment-card__number">${account}</p>
            <div class="payment-card__details">
              <div>
                <span class="detail-label">Límite / Balance:</span>
                <strong class="detail-val text-success">$ ${limit.toLocaleString('es-AR')} USD</strong>
              </div>
            </div>
          </div>
          <div class="payment-card__footer">
            <span class="payment-card__status">✓ Verificado</span>
            <button class="btn-xs-action set-default-btn" data-id="${newId}" type="button">Hacer Predeterminado</button>
          </div>
        `;

        container.appendChild(newCard);

        // Añadir opción al selector del modal de compras
        const purchasePaymentSelect = document.getElementById('modal-payment-method');
        if (purchasePaymentSelect) {
          const opt = document.createElement('option');
          opt.value = `${name} (${account})`;
          opt.textContent = `${name} (${account})`;
          purchasePaymentSelect.appendChild(opt);
        }

        closeAddModal();

        Swal.fire({
          title: '¡Método de Pago Homologado!',
          text: `Se ha registrado exitosamente "${name}" como instrumento de pago de su cuenta corporativa.`,
          icon: 'success'
        });

        showToast('Nuevo método de pago agregado', 'success');
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

    document.querySelectorAll('.contract-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id || `srv-${Math.random()}`;
        const service = btn.dataset.service || 'Servicio Misión Orbital';
        const price = parseFloat(btn.dataset.price) || 0;
        addProductToCart(id, service, price, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&q=80');
      });
    });

    document.getElementById('open-telemetry-modal')?.addEventListener('click', () => {
      addProductToCart('srv-telemetry', 'Ampliación Red Telemetría y Estación Terrena', 150000, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&q=80');
    });

    if (purchaseForm) {
      purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const item = itemNameInput.value.trim();
        const qty = parseInt(quantityInput.value, 10) || 1;
        const total = calculateTotal();

        if (!item || total <= 0) {
          Swal.fire({ title: 'Datos Incompletos', text: 'Por favor complete el nombre e importe del pedido.', icon: 'warning' });
          return;
        }

        const newOrder = {
          id: `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
          servicio: `${item}`,
          tipo: 'Compra / Contrato Carrito',
          estado: 'Solicitud Procesada',
          fecha: new Date().toISOString().split('T')[0],
          total: `$ ${total.toLocaleString('es-AR')} USD`
        };

        addOrderToTable(newOrder);
        saveCart([]); // Vaciar carrito tras la orden consolidada
        closeModal();

        Swal.fire({
          title: '¡Orden de Compra Emitida!',
          text: `Su orden consolidada para "${item}" ha sido procesada con éxito por Stellarix Space Systems.`,
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
    const stars = Array.from({ length: 90 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, radius: Math.radius || Math.random() * 1.4 + 0.4, speed: Math.random() * 0.3 + 0.1 }));
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
    setupCatalogFiltering();
    setupCartDrawer();
    setupPaymentMethods();
    setupPurchaseModal();
    setupOrderActions();
    setupThemeAndCanvas();
    updateCartUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
