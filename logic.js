(() => {
  const IVA = 0.13;
  const ESTADOS_PEDIDO = ['Pendiente', 'En Proceso', 'Entregado'];

  const debounce = (fn, espera = 300) => {
    let temporizador = null;
    return (...args) => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => fn(...args), espera);
    };
  };

  const formatearMoneda = (valor) => {
    const numero = Number(valor || 0);
    return `$ ${numero.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatearFecha = (fecha) => fecha || '—';

  const manejarError = (error, contexto = 'Operación') => {
    const mensaje = error && error.message ? error.message : 'Ocurrió un error inesperado.';
    console.error(`[Stellarix] ${contexto}:`, error);
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } else if (typeof Toastify !== 'undefined') {
      Toastify({
        text: mensaje,
        duration: 4500,
        close: true,
        gravity: 'top',
        position: 'right',
        style: { background: '#e5484d' }
      }).showToast();
    }
    return mensaje;
  };

  const validarEmail = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor || '').trim());

  const validarTelefono = (valor) => /^\+?\d{6,20}$/.test(String(valor || '').replace(/[\s-]/g, ''));

  const validarCliente = (datos) => {
    const errores = {};
    if (!datos.nombre || !String(datos.nombre).trim()) {
      errores.nombre = 'El nombre completo es obligatorio.';
    }
    if (datos.correo && !validarEmail(datos.correo)) {
      errores.correo = 'Ingresá un correo electrónico válido (ej.: nombre@correo.com).';
    }
    if (datos.telefono && !validarTelefono(datos.telefono)) {
      errores.telefono = 'Ingresá un teléfono válido (ej.: +506 8888-1234).';
    }
    return { valido: Object.keys(errores).length === 0, errores };
  };

  const validarProducto = (datos) => {
    const errores = {};
    if (!datos.nombre || !String(datos.nombre).trim()) {
      errores.nombre = 'El nombre del producto es obligatorio.';
    }
    const precio = Number(datos.precio);
    if (datos.precio === '' || datos.precio === undefined || Number.isNaN(precio)) {
      errores.precio = 'El precio debe ser un monto numérico.';
    } else if (precio <= 0) {
      errores.precio = 'El precio debe ser un monto positivo.';
    }
    if (datos.cantidad !== '' && datos.cantidad !== undefined) {
      const cantidad = Number(datos.cantidad);
      if (Number.isNaN(cantidad) || cantidad < 0) {
        errores.cantidad = 'La cantidad no puede ser negativa.';
      }
    }
    return { valido: Object.keys(errores).length === 0, errores };
  };

  const validarProveedor = (datos) => {
    const errores = {};
    if (!datos.empresa || !String(datos.empresa).trim()) {
      errores.empresa = 'El nombre de la empresa es obligatorio.';
    }
    if (datos.correo && !validarEmail(datos.correo)) {
      errores.correo = 'Ingresá un correo electrónico válido.';
    }
    if (datos.telefono && !validarTelefono(datos.telefono)) {
      errores.telefono = 'Ingresá un teléfono válido.';
    }
    return { valido: Object.keys(errores).length === 0, errores };
  };

  const validarPedido = (datos) => {
    const errores = {};
    if (!datos.clienteId || !String(datos.clienteId).trim()) {
      errores.clienteId = 'Seleccioná un cliente para el pedido.';
    }
    if (!Array.isArray(datos.items) || datos.items.length === 0) {
      errores.items = 'Agregá al menos un producto al pedido.';
    } else {
      datos.items.forEach((item, indice) => {
        const cantidad = Number(item.cantidad);
        if (!Number.isInteger(cantidad) || cantidad <= 0) {
          errores[`items.${indice}`] = `La cantidad de "${item.nombre || 'producto'}" debe ser un entero positivo.`;
        }
      });
    }
    return { valido: Object.keys(errores).length === 0, errores };
  };

  const redondear = (valor) => Math.round(valor * 100) / 100;

  const calcularPedido = (items) => {
    const lista = Array.isArray(items) ? items : [];
    const cantidadArticulos = lista.reduce((suma, item) => suma + Number(item.cantidad || 0), 0);
    const subtotal = redondear(lista.reduce((suma, item) => suma + Number(item.cantidad || 0) * Number(item.precioUnitario || 0), 0));
    const iva = redondear(subtotal * IVA);
    const total = redondear(subtotal + iva);
    return { cantidadArticulos, subtotal, iva, total };
  };

  const esAdmin = (usuario) => {
    if (!usuario) return false;
    const rol = String(usuario.rol || '').toLowerCase();
    const nombre = String(usuario.username || '').toLowerCase();
    return rol === 'administrador' || rol === 'admin' || nombre === 'fwd';
  };

  const obtenerRol = (usuario) => (esAdmin(usuario) ? 'Administrador' : 'Operador');

  const pedidosAsociados = (entidad, id) => {
    const pedidos = window.FWDData.getPedidos();
    if (entidad === 'clients') {
      return pedidos.filter((pedido) => String(pedido.clienteId) === String(id)).length;
    }
    if (entidad === 'products') {
      return pedidos.filter((pedido) => pedido.items && pedido.items.some((item) => String(item.productoId) === String(id))).length;
    }
    if (entidad === 'suppliers') {
      return pedidos.filter((pedido) => pedido.items && pedido.items.some((item) => String(item.proveedorId) === String(id))).length;
    }
    return 0;
  };

  const getAnalytics = () => {
    const clientes = window.FWDData.getClientes();
    const productos = window.FWDData.getProductos();
    const proveedores = window.FWDData.getProveedores();
    const pedidos = window.FWDData.getPedidos();

    const inventarioBajo = productos.filter((producto) => Number(producto.cantidad || 0) <= 5);

    const conteoProveedores = {};
    productos.forEach((producto) => {
      const clave = producto.proveedorId || 'Sin proveedor';
      conteoProveedores[clave] = (conteoProveedores[clave] || 0) + 1;
    });
    let proveedorTopId = null;
    let productosTop = 0;
    Object.entries(conteoProveedores).forEach(([id, cantidad]) => {
      if (cantidad > productosTop) {
        proveedorTopId = id;
        productosTop = cantidad;
      }
    });
    const proveedorTop = proveedorTopId && proveedorTopId !== 'Sin proveedor'
      ? proveedores.find((proveedor) => String(proveedor.proveedorId) === String(proveedorTopId)) || { empresa: proveedorTopId }
      : { empresa: 'Sin proveedor' };

    const pedidosPendientes = pedidos.filter((pedido) => pedido.estado === 'Pendiente');
    const ventasTotales = pedidos
      .filter((pedido) => pedido.estado === 'Entregado')
      .reduce((suma, pedido) => suma + Number(pedido.total || 0), 0);

    return {
      totalClientes: clientes.length,
      totalProductos: productos.length,
      totalProveedores: proveedores.length,
      totalPedidos: pedidos.length,
      inventarioBajo: inventarioBajo.length,
      proveedorConMasProductos: proveedorTop.empresa || proveedorTopId || 'Sin proveedor',
      productosProveedorTop: productosTop,
      pedidosPendientes: pedidosPendientes.length,
      ventasTotales
    };
  };

  const siguienteEstado = (estado) => {
    const indice = ESTADOS_PEDIDO.indexOf(estado);
    return indice >= 0 && indice < ESTADOS_PEDIDO.length - 1 ? ESTADOS_PEDIDO[indice + 1] : estado;
  };

  const normalizarClase = (texto) => String(texto || 'default')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

  window.FWDLogic = {
    IVA,
    ESTADOS_PEDIDO,
    debounce,
    formatearMoneda,
    formatearFecha,
    manejarError,
    validarEmail,
    validarTelefono,
    validarCliente,
    validarProducto,
    validarProveedor,
    validarPedido,
    calcularPedido,
    esAdmin,
    obtenerRol,
    pedidosAsociados,
    getAnalytics,
    siguienteEstado,
    normalizarClase
  };
})();
