(() => {
  const PAGE = window.location.pathname.split('/').pop() || 'index.html';
  const POR_PAGINA = 15;
  const D = () => window.FWDData;
  const L = () => window.FWDLogic;
  const modulos = {};

  const badgeEstado = (estado) => {
    const clase = L().normalizarClase(estado);
    return `<span class="estado-badge estado-badge--${clase}">${estado || '—'}</span>`;
  };

  const celdaAcciones = (prefijo, id, permisos, etiquetaEditar = 'Editar') => {
    const acciones = [`<button class="${prefijo}__accion" type="button" data-accion="editar" data-id="${id}">${etiquetaEditar}</button>`];
    if (permisos.eliminar) {
      acciones.push(`<button class="${prefijo}__accion ${prefijo}__accion--eliminar" type="button" data-accion="eliminar" data-id="${id}">Eliminar</button>`);
    }
    return acciones.join('');
  };

  const filaCliente = (cliente, permisos) => `
    <tr class="clientes__fila">
      <td class="clientes__celda">${cliente.clienteId || ''}</td>
      <td class="clientes__celda">${cliente.nombre || ''}</td>
      <td class="clientes__celda">${cliente.empresa || ''}</td>
      <td class="clientes__celda">${cliente.correo || ''}</td>
      <td class="clientes__celda">${cliente.telefono || ''}</td>
      <td class="clientes__celda">${cliente.pais || ''}</td>
      <td class="clientes__celda">${cliente.tipoCliente || ''}</td>
      <td class="clientes__celda">${badgeEstado(cliente.estado)}</td>
      <td class="clientes__celda">${cliente.fechaRegistro || ''}</td>
      <td class="clientes__celda">${celdaAcciones('clientes', cliente.clienteId, permisos)}</td>
    </tr>`;

  const filaProducto = (producto, permisos) => `
    <tr class="productos__fila">
      <td class="productos__celda">${producto.productoId || ''}</td>
      <td class="productos__celda">${producto.nombre || ''}</td>
      <td class="productos__celda">${producto.categoria || ''}</td>
      <td class="productos__celda">${producto.codigo || ''}</td>
      <td class="productos__celda">${producto.fabricante || ''}</td>
      <td class="productos__celda">${producto.cantidad || 0}</td>
      <td class="productos__celda">${L().formatearMoneda(producto.precio)}</td>
      <td class="productos__celda">${badgeEstado(producto.estado)}</td>
      <td class="productos__celda">${producto.fechaIngreso || ''}</td>
      <td class="productos__celda">${celdaAcciones('productos', producto.productoId, permisos)}</td>
    </tr>`;

  const filaProveedor = (proveedor, permisos) => `
    <tr class="proveedores__fila">
      <td class="proveedores__celda">${proveedor.proveedorId || ''}</td>
      <td class="proveedores__celda">${proveedor.empresa || ''}</td>
      <td class="proveedores__celda">${proveedor.contacto || ''}</td>
      <td class="proveedores__celda">${proveedor.correo || ''}</td>
      <td class="proveedores__celda">${proveedor.telefono || ''}</td>
      <td class="proveedores__celda">${proveedor.pais || ''}</td>
      <td class="proveedores__celda">${proveedor.tipoSuministro || ''}</td>
      <td class="proveedores__celda">${badgeEstado(proveedor.estado)}</td>
      <td class="proveedores__celda">${proveedor.fechaRegistro || ''}</td>
      <td class="proveedores__celda">${celdaAcciones('proveedores', proveedor.proveedorId, permisos)}</td>
    </tr>`;

  const configuracion = {
    clientes: {
      entidad: 'clients',
      prefijo: 'clientes',
      form: '#clienteForm',
      tbody: '.clientes__tbody',
      vacio: 'No hay clientes registrados.',
      colspan: 10,
      obtener: () => D().getClientes(),
      obtenerPorId: (id) => D().getClienteById(id),
      guardar: (datos) => D().saveCliente(datos),
      actualizar: (id, datos) => D().updateCliente(id, datos),
      eliminar: (id) => D().deleteCliente(id),
      validar: (datos) => L().validarCliente(datos),
      renderFila: filaCliente,
      textoBuscar: (c) => `${c.clienteId || ''} ${c.nombre || ''} ${c.empresa || ''} ${c.correo || ''} ${c.telefono || ''} ${c.pais || ''} ${c.tipoCliente || ''} ${c.estado || ''}`.toLowerCase(),
      colsSortables: {
        1: 'nombre', 2: 'empresa', 3: 'correo', 4: 'telefono', 5: 'pais', 6: 'tipoCliente', 7: 'estado', 8: 'fechaRegistro'
      },
      numericos: [],
      nombreCampo: 'nombre',
      tituloEdicion: 'Editar Cliente',
      tituloRegistro: 'Registrar Cliente'
    },
    productos: {
      entidad: 'products',
      prefijo: 'productos',
      form: '#productoForm',
      tbody: '.productos__tbody',
      vacio: 'No hay productos registrados.',
      colspan: 10,
      obtener: () => D().getProductos(),
      obtenerPorId: (id) => D().getProductoById(id),
      guardar: (datos) => D().saveProducto(datos),
      actualizar: (id, datos) => D().updateProducto(id, datos),
      eliminar: (id) => D().deleteProducto(id),
      validar: (datos) => L().validarProducto(datos),
      renderFila: filaProducto,
      textoBuscar: (p) => `${p.productoId || ''} ${p.nombre || ''} ${p.categoria || ''} ${p.codigo || ''} ${p.fabricante || ''} ${p.estado || ''} ${p.unidadMedida || ''}`.toLowerCase(),
      colsSortables: {
        1: 'nombre', 2: 'categoria', 3: 'codigo', 4: 'fabricante', 5: 'cantidad', 6: 'precio', 7: 'estado', 8: 'fechaIngreso'
      },
      numericos: ['cantidad', 'precio'],
      nombreCampo: 'nombre',
      tituloEdicion: 'Modificar Producto',
      tituloRegistro: 'Registrar / Modificar Producto'
    },
    proveedores: {
      entidad: 'suppliers',
      prefijo: 'proveedores',
      form: '#proveedorForm',
      tbody: '.proveedores__tbody',
      vacio: 'No hay proveedores registrados.',
      colspan: 10,
      obtener: () => D().getProveedores(),
      obtenerPorId: (id) => D().getProveedorById(id),
      guardar: (datos) => D().saveProveedor(datos),
      actualizar: (id, datos) => D().updateProveedor(id, datos),
      eliminar: (id) => D().deleteProveedor(id),
      validar: (datos) => L().validarProveedor(datos),
      renderFila: filaProveedor,
      textoBuscar: (p) => `${p.proveedorId || ''} ${p.empresa || ''} ${p.contacto || ''} ${p.correo || ''} ${p.telefono || ''} ${p.pais || ''} ${p.tipoSuministro || ''} ${p.estado || ''}`.toLowerCase(),
      colsSortables: {
        1: 'empresa', 2: 'contacto', 3: 'correo', 4: 'telefono', 5: 'pais', 6: 'tipoSuministro', 7: 'estado', 8: 'fechaRegistro'
      },
      numericos: [],
      nombreCampo: 'empresa',
      tituloEdicion: 'Editar Proveedor',
      tituloRegistro: 'Registrar / Editar Proveedor'
    }
  };

  const limpiarErrores = (form) => {
    if (!form) return;
    form.querySelectorAll('.campo-error').forEach((el) => el.remove());
    form.querySelectorAll('.campo-invalido').forEach((el) => el.classList.remove('campo-invalido'));
  };

  const mostrarErrores = (form, errores) => {
    Object.entries(errores).forEach(([campo, mensaje]) => {
      const control = form.elements[campo];
      if (!control) return;
      control.classList.add('campo-invalido');
      const aviso = document.createElement('p');
      aviso.className = 'campo-error';
      aviso.textContent = mensaje;
      control.parentElement.appendChild(aviso);
    });
  };

  const crearToastDeshacer = (mensaje, onDeshacer) => {
    const contenedor = document.createElement('div');
    contenedor.className = 'fwd-toast-undo';
    const texto = document.createElement('span');
    texto.textContent = mensaje;
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'fwd-toast-undo__boton';
    boton.textContent = 'Deshacer';
    boton.addEventListener('click', () => {
      onDeshacer();
      limpiar();
    });
    contenedor.appendChild(texto);
    contenedor.appendChild(boton);
    document.body.appendChild(contenedor);

    let temporizador = null;
    const limpiar = () => {
      clearTimeout(temporizador);
      if (contenedor.parentNode) contenedor.parentNode.removeChild(contenedor);
    };
    temporizador = setTimeout(limpiar, 6000);
  };

  const resetFormulario = (cfg, form, tituloEl, submitBtn, cancelarBtn) => {
    if (form) form.reset();
    delete form.dataset.editando;
    if (tituloEl) tituloEl.textContent = cfg.tituloRegistro;
    if (submitBtn) submitBtn.textContent = 'Registrar';
    if (cancelarBtn) cancelarBtn.hidden = true;
    limpiarErrores(form);
  };

  const iniciarEdicion = (cfg, form, id, tituloEl, submitBtn, cancelarBtn) => {
    const registro = cfg.obtenerPorId(id);
    if (!registro) {
      L().manejarError(new Error('El registro ya no existe en la base de datos.'), cfg.prefijo);
      return;
    }
    Object.keys(registro).forEach((campo) => {
      const control = form.elements[campo];
      if (control) control.value = registro[campo] ?? '';
    });
    form.dataset.editando = id;
    if (tituloEl) tituloEl.textContent = cfg.tituloEdicion;
    if (submitBtn) submitBtn.textContent = 'Guardar cambios';
    if (cancelarBtn) cancelarBtn.hidden = false;
    limpiarErrores(form);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarRegistro = (cfg, render) => {
    return (event) => {
      const boton = event.target.closest('[data-accion="eliminar"]');
      if (!boton) return;
      const id = boton.getAttribute('data-id');
      const registro = cfg.obtenerPorId(id);
      if (!registro) return;
      const nombre = registro[cfg.nombreCampo] || id;
      const asociados = L().pedidosAsociados(cfg.entidad, id);

      const continuar = () => {
        try {
          const copia = cfg.eliminar(id);
          render();
          crearToastDeshacer(`Se eliminó ${nombre}.`, () => {
            try {
              D().create(cfg.entidad, copia);
            } catch (error) {
              L().manejarError(error, 'Deshacer eliminación');
            }
            render();
          });
        } catch (error) {
          L().manejarError(error, 'Eliminar');
        }
      };

      if (asociados > 0) {
        Swal.fire({
          title: 'Registros asociados',
          html: `<strong>${nombre}</strong> tiene ${asociados} pedido(s) asociado(s).<br>Se eliminará solo este registro, sin tocar los pedidos existentes.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Eliminar de todos modos',
          cancelButtonText: 'Cancelar'
        }).then((resultado) => {
          if (resultado.isConfirmed) continuar();
        });
      } else {
        continuar();
      }
    };
  };

  const inicializarModulo = (tipo) => {
    const cfg = configuracion[tipo];
    if (!cfg) return;
    const form = document.querySelector(cfg.form);
    const tbody = document.querySelector(cfg.tbody);
    const tabla = tbody && tbody.closest('table');
    if (!tbody) return;

    const mod = { termino: '', pagina: 1, orden: null, direccion: 'asc' };
    modulos[tipo] = mod;
    const permisos = { eliminar: L().esAdmin(D().getActiveUser()), editar: true };

    const seccion = tbody.closest('section');
    const tituloRegistroEl = document.getElementById('titulo-registro');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    const inyectarToolbar = () => {
      if (!seccion || seccion.querySelector(`.${cfg.prefijo}__toolbar`)) return;
      const toolbar = document.createElement('div');
      toolbar.className = `${cfg.prefijo}__toolbar`;
      toolbar.innerHTML = `
        <input type="search" id="${cfg.prefijo}-busqueda" class="${cfg.prefijo}__busqueda" placeholder="Buscar ${cfg.prefijo}...">
        <span class="${cfg.prefijo}__contador" id="${cfg.prefijo}-contador"></span>
      `;
      seccion.insertBefore(toolbar, tbody.closest(`.${cfg.prefijo}__tabla-wrap`));
    };

    const inyectarPaginacion = () => {
      if (!seccion || seccion.querySelector(`.${cfg.prefijo}__paginacion`)) return;
      const contenedor = document.createElement('div');
      contenedor.className = `${cfg.prefijo}__paginacion`;
      seccion.appendChild(contenedor);
    };

    const inyectarBotonCancelar = () => {
      if (!form) return;
      const acciones = form.querySelector(`.${cfg.prefijo}__acciones`);
      if (!acciones || acciones.querySelector('[data-cancelar-edicion]')) return;
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = `${cfg.prefijo}__boton`;
      boton.textContent = 'Cancelar edición';
      boton.hidden = true;
      boton.setAttribute('data-cancelar-edicion', '');
      boton.addEventListener('click', () => resetFormulario(cfg, form, tituloRegistroEl, submitBtn, boton));
      acciones.appendChild(boton);
    };

    const renderContador = (total, inicio, cantidadPagina) => {
      const contador = document.getElementById(`${cfg.prefijo}-contador`);
      if (!contador) return;
      if (total === 0) {
        contador.textContent = '0 registros';
        return;
      }
      const fin = inicio + cantidadPagina;
      contador.textContent = `Mostrando ${inicio + 1}-${fin} de ${total}`;
    };

    const renderPaginacion = (totalPaginas) => {
      const contenedor = seccion.querySelector(`.${cfg.prefijo}__paginacion`);
      if (!contenedor) return;
      contenedor.innerHTML = '';
      if (totalPaginas <= 1) return;

      const boton = (etiqueta, destino, activo, deshabilitado) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = `paginacion__boton${activo ? ' paginacion__boton--activo' : ''}`;
        el.textContent = etiqueta;
        el.disabled = Boolean(deshabilitado);
        if (!deshabilitado) {
          el.addEventListener('click', () => {
            mod.pagina = destino;
            render();
          });
        }
        contenedor.appendChild(el);
      };

      boton('‹ Anterior', mod.pagina - 1, false, mod.pagina === 1);
      const desde = Math.max(1, mod.pagina - 2);
      const hasta = Math.min(totalPaginas, desde + 4);
      for (let pagina = desde; pagina <= hasta; pagina += 1) {
        boton(String(pagina), pagina, pagina === mod.pagina, false);
      }
      boton('Siguiente ›', mod.pagina + 1, false, mod.pagina === totalPaginas);
    };

    const render = () => {
      const lista = cfg.obtener();
      const filtrados = lista.filter((registro) => {
        if (!mod.termino) return true;
        return cfg.textoBuscar(registro).includes(mod.termino);
      });

      if (mod.orden) {
        const numerico = cfg.numericos.includes(mod.orden);
        filtrados.sort((a, b) => {
          const va = a[mod.orden] ?? '';
          const vb = b[mod.orden] ?? '';
          let resultado = numerico
            ? Number(va) - Number(vb)
            : String(va).localeCompare(String(vb), 'es');
          return mod.direccion === 'desc' ? -resultado : resultado;
        });
      }

      const total = filtrados.length;
      const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
      if (mod.pagina > totalPaginas) mod.pagina = totalPaginas;
      const inicio = (mod.pagina - 1) * POR_PAGINA;
      const pagina = filtrados.slice(inicio, inicio + POR_PAGINA);

      tbody.innerHTML = pagina.length
        ? pagina.map((registro) => cfg.renderFila(registro, permisos)).join('')
        : `<tr><td colspan="${cfg.colspan}" class="${cfg.prefijo}__celda" style="text-align:center;">${cfg.vacio}</td></tr>`;

      renderContador(total, inicio, pagina.length);
      renderPaginacion(totalPaginas);

      const ths = tabla ? Array.from(tabla.querySelectorAll('thead th')) : [];
      ths.forEach((th, indice) => {
        if (cfg.colsSortables[indice]) {
          if (mod.orden === cfg.colsSortables[indice]) {
            th.setAttribute('aria-sort', mod.direccion === 'asc' ? 'ascending' : 'descending');
          } else {
            th.removeAttribute('aria-sort');
          }
        }
      });
    };

    inyectarToolbar();
    inyectarPaginacion();
    inyectarBotonCancelar();

    const busqueda = document.getElementById(`${cfg.prefijo}-busqueda`);
    if (busqueda) {
      const buscar = L().debounce((evento) => {
        mod.termino = evento.target.value.trim().toLowerCase();
        mod.pagina = 1;
        render();
      }, 300);
      busqueda.addEventListener('input', buscar);
    }

    if (tabla) {
      tabla.querySelectorAll('thead th').forEach((th, indice) => {
        const campo = cfg.colsSortables[indice];
        if (!campo) return;
        th.classList.add('sortable');
        th.setAttribute('title', 'Clic para ordenar');
        th.addEventListener('click', () => {
          if (mod.orden === campo) {
            mod.direccion = mod.direccion === 'asc' ? 'desc' : 'asc';
          } else {
            mod.orden = campo;
            mod.direccion = 'asc';
          }
          render();
        });
      });
    }

    tbody.addEventListener('click', (event) => {
      const botonEditar = event.target.closest('[data-accion="editar"]');
      if (botonEditar) {
        iniciarEdicion(cfg, form, botonEditar.getAttribute('data-id'), tituloRegistroEl, submitBtn, form.querySelector('[data-cancelar-edicion]'));
        return;
      }
      eliminarRegistro(cfg, render)(event);
    });

    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        limpiarErrores(form);
        const datos = Object.fromEntries(new FormData(form).entries());
        const resultado = cfg.validar(datos);
        if (!resultado.valido) {
          mostrarErrores(form, resultado.errores);
          return;
        }
        try {
          const editando = form.dataset.editando || '';
          if (editando) {
            cfg.actualizar(editando, datos);
          } else {
            cfg.guardar(datos);
          }
          resetFormulario(cfg, form, tituloRegistroEl, submitBtn, form.querySelector('[data-cancelar-edicion]'));
          render();
          if (typeof Toastify !== 'undefined') {
            Toastify({ text: editando ? 'Registro actualizado correctamente.' : 'Registro guardado correctamente.', duration: 2500, gravity: 'top', position: 'right', style: { background: '#24b47e' } }).showToast();
          }
        } catch (error) {
          L().manejarError(error, cfg.prefijo);
        }
      });
    }

    window.addEventListener('storage', render);
    render();
  };

  const nombresClientes = (() => {
    const mapa = {};
    D().getClientes().forEach((cliente) => {
      mapa[cliente.clienteId] = cliente.nombre;
    });
    return mapa;
  })();

  const nombresProductos = (() => {
    const mapa = {};
    D().getProductos().forEach((producto) => {
      mapa[producto.productoId] = producto.nombre;
    });
    return mapa;
  })();

  const filaPedido = (pedido, permisos) => `
    <tr class="pedidos__fila">
      <td class="pedidos__celda">${pedido.pedidoId || ''}</td>
      <td class="pedidos__celda">${nombresClientes[pedido.clienteId] || pedido.clienteId || ''}</td>
      <td class="pedidos__celda">${pedido.fechaPedido || ''}</td>
      <td class="pedidos__celda">${pedido.cantidadArticulos || 0}</td>
      <td class="pedidos__celda">${L().formatearMoneda(pedido.subtotal)}</td>
      <td class="pedidos__celda">${L().formatearMoneda(pedido.total)}</td>
      <td class="pedidos__celda">${badgeEstado(pedido.estado)}</td>
      <td class="pedidos__celda">${celdaAcciones('pedidos', pedido.pedidoId, permisos, 'Editar')}</td>
    </tr>`;

  const configuracionPedidos = {
    entidad: 'orders',
    prefijo: 'pedidos',
    form: '#pedidoForm',
    tbody: '.pedidos__tbody',
    vacio: 'No hay pedidos registrados.',
    colspan: 8,
    obtener: () => D().getPedidos(),
    obtenerPorId: (id) => D().getPedidoById(id),
    eliminar: (id) => D().deletePedido(id),
    textoBuscar: (p) => `${p.pedidoId || ''} ${p.clienteId || ''} ${p.estado || ''} ${(nombresClientes[p.clienteId] || '')} ${p.items ? p.items.map((i) => i.nombre).join(' ') : ''}`.toLowerCase(),
    colsSortables: {
      2: 'fechaPedido', 3: 'cantidadArticulos', 4: 'subtotal', 5: 'total', 6: 'estado'
    },
    numericos: ['cantidadArticulos', 'subtotal', 'total'],
    nombreCampo: 'pedidoId',
    tituloEdicion: 'Editar Pedido',
    tituloRegistro: 'Registrar Pedido'
  };

  const inicializarPedidos = () => {
    const cfg = configuracionPedidos;
    const form = document.querySelector(cfg.form);
    const tbody = document.querySelector(cfg.tbody);
    const tabla = tbody && tbody.closest('table');
    if (!form || !tbody) return;

    const mod = { termino: '', pagina: 1, orden: null, direccion: 'asc' };
    modulos.pedidos = mod;
    const permisos = { eliminar: L().esAdmin(D().getActiveUser()), editar: true };
    let itemsActuales = [];
    let editandoId = '';

    const seccion = tbody.closest('section');
    const tituloRegistroEl = document.getElementById('titulo-registro');
    const submitBtn = form.querySelector('button[type="submit"]');
    const cancelarBtn = form.querySelector('[data-cancelar-edicion]');
    const itemsContainer = document.getElementById('pedido-items');
    const clienteSelect = form.elements.clienteId;
    const productoSelect = document.getElementById('producto-select');
    const cantidadInput = document.getElementById('cantidad-input');

    const poblarSelectores = () => {
      clienteSelect.innerHTML = '<option value="">Seleccioná un cliente</option>';
      D().getClientes()
        .filter((cliente) => cliente.estado === 'Activo')
        .forEach((cliente) => {
          const opcion = document.createElement('option');
          opcion.value = cliente.clienteId;
          opcion.textContent = `${cliente.clienteId} — ${cliente.nombre} (${cliente.empresa || ''})`;
          clienteSelect.appendChild(opcion);
        });

      productoSelect.innerHTML = '<option value="">Seleccioná un producto</option>';
      D().getProductos()
        .filter((producto) => Number(producto.cantidad || 0) > 0)
        .forEach((producto) => {
          const opcion = document.createElement('option');
          opcion.value = producto.productoId;
          opcion.textContent = `${producto.productoId} — ${producto.nombre} (${L().formatearMoneda(producto.precio)})`;
          productoSelect.appendChild(opcion);
        });
    };

    const actualizarTotales = () => {
      const totales = L().calcularPedido(itemsActuales);
      const set = (id, texto) => {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
      };
      set('total-articulos', String(totales.cantidadArticulos));
      set('total-subtotal', L().formatearMoneda(totales.subtotal));
      set('total-iva', L().formatearMoneda(totales.iva));
      set('total-general', L().formatearMoneda(totales.total));
    };

    const renderItems = () => {
      itemsContainer.innerHTML = '';
      if (itemsActuales.length === 0) {
        itemsContainer.innerHTML = '<p class="pedidos__items-vacio">Todavía no se agregaron productos.</p>';
      }
      itemsActuales.forEach((item, indice) => {
        const fila = document.createElement('div');
        fila.className = 'pedidos__item-fila';
        fila.innerHTML = `
          <span class="pedidos__item-nombre">${item.nombre} <small>${item.productoId}</small></span>
          <span class="pedidos__item-datos">${item.cantidad} × ${L().formatearMoneda(item.precioUnitario)} = <strong>${L().formatearMoneda(item.cantidad * item.precioUnitario)}</strong></span>
          <button class="pedidos__accion pedidos__accion--eliminar" type="button" data-quitar-item="${indice}">Quitar</button>
        `;
        itemsContainer.appendChild(fila);
      });
      actualizarTotales();
    };

    const agregarItem = () => {
      const producto = D().getProductoById(productoSelect.value);
      const cantidad = Number(cantidadInput.value);
      if (!producto) {
        Swal.fire({ title: 'Producto requerido', text: 'Seleccioná un producto.', icon: 'warning' });
        return;
      }
      if (!Number.isInteger(cantidad) || cantidad <= 0) {
        Swal.fire({ title: 'Cantidad inválida', text: 'Ingresá una cantidad entera positiva.', icon: 'warning' });
        return;
      }
      const existente = itemsActuales.findIndex((item) => item.productoId === producto.productoId);
      if (existente >= 0) {
        itemsActuales[existente].cantidad += cantidad;
      } else {
        itemsActuales.push({
          productoId: producto.productoId,
          nombre: producto.nombre,
          proveedorId: producto.proveedorId,
          cantidad,
          precioUnitario: Number(producto.precio)
        });
      }
      renderItems();
    };

    const render = () => {
      const lista = cfg.obtener();
      const filtrados = lista.filter((pedido) => {
        if (!mod.termino) return true;
        return cfg.textoBuscar(pedido).includes(mod.termino);
      });

      if (mod.orden) {
        const numerico = cfg.numericos.includes(mod.orden);
        filtrados.sort((a, b) => {
          const va = a[mod.orden] ?? '';
          const vb = b[mod.orden] ?? '';
          let resultado = numerico ? Number(va) - Number(vb) : String(va).localeCompare(String(vb), 'es');
          return mod.direccion === 'desc' ? -resultado : resultado;
        });
      }

      const total = filtrados.length;
      const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
      if (mod.pagina > totalPaginas) mod.pagina = totalPaginas;
      const inicio = (mod.pagina - 1) * POR_PAGINA;
      const pagina = filtrados.slice(inicio, inicio + POR_PAGINA);

      tbody.innerHTML = pagina.length
        ? pagina.map((pedido) => filaPedido(pedido, permisos)).join('')
        : `<tr><td colspan="${cfg.colspan}" class="pedidos__celda" style="text-align:center;">${cfg.vacio}</td></tr>`;

      const contador = document.getElementById('pedidos-contador');
      if (contador) {
        contador.textContent = total === 0 ? '0 registros' : `Mostrando ${inicio + 1}-${inicio + pagina.length} de ${total}`;
      }

      const contenedor = seccion.querySelector('.pedidos__paginacion');
      if (contenedor) {
        contenedor.innerHTML = '';
        if (totalPaginas > 1) {
          const boton = (etiqueta, destino, activo, deshabilitado) => {
            const el = document.createElement('button');
            el.type = 'button';
            el.className = `paginacion__boton${activo ? ' paginacion__boton--activo' : ''}`;
            el.textContent = etiqueta;
            el.disabled = Boolean(deshabilitado);
            if (!deshabilitado) {
              el.addEventListener('click', () => {
                mod.pagina = destino;
                render();
              });
            }
            contenedor.appendChild(el);
          };
          boton('‹ Anterior', mod.pagina - 1, false, mod.pagina === 1);
          const desde = Math.max(1, mod.pagina - 2);
          const hasta = Math.min(totalPaginas, desde + 4);
          for (let pagina = desde; pagina <= hasta; pagina += 1) boton(String(pagina), pagina, pagina === mod.pagina, false);
          boton('Siguiente ›', mod.pagina + 1, false, mod.pagina === totalPaginas);
        }
      }

      tabla.querySelectorAll('thead th').forEach((th, indice) => {
        const campo = cfg.colsSortables[indice];
        if (!campo) return;
        if (mod.orden === campo) th.setAttribute('aria-sort', mod.direccion === 'asc' ? 'ascending' : 'descending');
        else th.removeAttribute('aria-sort');
      });
    };

    const resetFormularioPedido = () => {
      form.reset();
      editandoId = '';
      itemsActuales = [];
      renderItems();
      if (tituloRegistroEl) tituloRegistroEl.textContent = cfg.tituloRegistro;
      if (submitBtn) submitBtn.textContent = 'Registrar pedido';
      if (cancelarBtn) cancelarBtn.hidden = true;
      limpiarErrores(form);
    };

    poblarSelectores();
    renderItems();

    const inyectarToolbar = () => {
      if (seccion.querySelector('.pedidos__toolbar')) return;
      const toolbar = document.createElement('div');
      toolbar.className = 'pedidos__toolbar';
      toolbar.innerHTML = `
        <input type="search" id="pedidos-busqueda" class="pedidos__busqueda" placeholder="Buscar pedidos...">
        <span class="pedidos__contador" id="pedidos-contador"></span>
      `;
      seccion.insertBefore(toolbar, tbody.closest('.pedidos__tabla-wrap'));
    };
    inyectarToolbar();

    const busqueda = document.getElementById('pedidos-busqueda');
    if (busqueda) {
      busqueda.addEventListener('input', L().debounce((evento) => {
        mod.termino = evento.target.value.trim().toLowerCase();
        mod.pagina = 1;
        render();
      }, 300));
    }

    tabla.querySelectorAll('thead th').forEach((th, indice) => {
      const campo = cfg.colsSortables[indice];
      if (!campo) return;
      th.classList.add('sortable');
      th.setAttribute('title', 'Clic para ordenar');
      th.addEventListener('click', () => {
        if (mod.orden === campo) mod.direccion = mod.direccion === 'asc' ? 'desc' : 'asc';
        else { mod.orden = campo; mod.direccion = 'asc'; }
        render();
      });
    });

    document.getElementById('agregar-item').addEventListener('click', agregarItem);
    cantidadInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        agregarItem();
      }
    });

    itemsContainer.addEventListener('click', (event) => {
      const boton = event.target.closest('[data-quitar-item]');
      if (!boton) return;
      const indice = Number(boton.getAttribute('data-quitar-item'));
      itemsActuales.splice(indice, 1);
      renderItems();
    });

    tbody.addEventListener('click', (event) => {
      const botonEditar = event.target.closest('[data-accion="editar"]');
      if (botonEditar) {
        const pedido = cfg.obtenerPorId(botonEditar.getAttribute('data-id'));
        if (!pedido) return;
        editandoId = pedido.pedidoId;
        clienteSelect.value = pedido.clienteId || '';
        form.elements.fechaPedido.value = pedido.fechaPedido || '';
        form.elements.observaciones.value = pedido.observaciones || '';
        itemsActuales = (pedido.items || []).map((item) => ({ ...item }));
        renderItems();
        if (tituloRegistroEl) tituloRegistroEl.textContent = cfg.tituloEdicion;
        if (submitBtn) submitBtn.textContent = 'Guardar cambios';
        if (cancelarBtn) cancelarBtn.hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const botonEliminar = event.target.closest('[data-accion="eliminar"]');
      if (!botonEliminar) return;
      const id = botonEliminar.getAttribute('data-id');
      const pedido = cfg.obtenerPorId(id);
      if (!pedido) return;
      try {
        const copia = cfg.eliminar(id);
        render();
        crearToastDeshacer(`Se eliminó el pedido ${id}.`, () => {
          try {
            D().create('orders', copia);
          } catch (error) {
            L().manejarError(error, 'Deshacer eliminación');
          }
          render();
        });
      } catch (error) {
        L().manejarError(error, 'Eliminar pedido');
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      limpiarErrores(form);
      const errorItems = document.getElementById('pedido-items-error');
      if (errorItems) errorItems.hidden = true;

      const datos = {
        clienteId: clienteSelect.value,
        fechaPedido: form.elements.fechaPedido.value || new Date().toISOString().slice(0, 10),
        items: itemsActuales,
        observaciones: form.elements.observaciones.value || ''
      };
      const resultado = L().validarPedido(datos);
      if (!resultado.valido) {
        mostrarErrores(form, resultado.errores);
        if (resultado.errores.items && errorItems) errorItems.hidden = false;
        return;
      }

      try {
        const totales = L().calcularPedido(itemsActuales);
        const nuevoPedido = {
          ...datos,
          cantidadArticulos: totales.cantidadArticulos,
          subtotal: totales.subtotal,
          iva: totales.iva,
          total: totales.total,
          estado: 'Pendiente',
          fechaEntrega: ''
        };
        if (editandoId) {
          D().updatePedido(editandoId, nuevoPedido);
        } else {
          D().savePedido(nuevoPedido);
        }
        resetFormularioPedido();
        render();
        if (typeof Toastify !== 'undefined') {
          Toastify({ text: editandoId ? 'Pedido actualizado correctamente.' : 'Pedido registrado correctamente.', duration: 2500, gravity: 'top', position: 'right', style: { background: '#24b47e' } }).showToast();
        }
      } catch (error) {
        L().manejarError(error, 'Pedidos');
      }
    });

    cancelarBtn.addEventListener('click', resetFormularioPedido);
    window.addEventListener('storage', render);
    render();
  };

  const inicializarDashboard = () => {
    const actualizar = () => {
      const analitica = L().getAnalytics();
      const set = (id, texto) => {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
      };
      set('metric-clientes-valor', analitica.totalClientes);
      set('metric-inventario-valor', analitica.inventarioBajo);
      set('metric-proveedor-valor', analitica.proveedorConMasProductos);
      set('metric-proveedor-sub', `${analitica.productosProveedorTop} producto(s) asociado(s)`);
      set('metric-pedidos-valor', analitica.pedidosPendientes);
      set('metric-ventas-valor', L().formatearMoneda(analitica.ventasTotales));
      renderPedidosDashboard();
    };

    const rolEl = document.querySelector('.dashboard__user-role');
    const badge = document.getElementById('rol-badge');
    const usuario = D().getActiveUser();
    const rol = L().obtenerRol(usuario);
    if (rolEl) rolEl.textContent = rol === 'Administrador' ? 'Administrador' : 'Operador';
    if (badge) {
      badge.textContent = rol;
      badge.classList.add(rol === 'Administrador' ? 'rol-badge--admin' : 'rol-badge--operador');
    }

    const renderPedidosDashboard = () => {
      const tbody = document.getElementById('dashboard-pedidos-tbody');
      if (!tbody) return;
      const pedidos = D().getPedidos().slice(0, 8);
      tbody.innerHTML = pedidos.length ? pedidos.map((pedido) => {
        const opciones = L().ESTADOS_PEDIDO.map((estado) => (
          `<option value="${estado}" ${pedido.estado === estado ? 'selected' : ''}>${estado}</option>`
        )).join('');
        return `
          <tr>
            <td>${pedido.pedidoId}</td>
            <td>${nombresClientes[pedido.clienteId] || pedido.clienteId}</td>
            <td>${pedido.fechaPedido}</td>
            <td>${L().formatearMoneda(pedido.total)}</td>
            <td>${badgeEstado(pedido.estado)}</td>
            <td>
              <select class="dashboard__estado-select" data-pedido-estado="${pedido.pedidoId}">${opciones}</select>
            </td>
          </tr>`;
      }).join('') : '<tr><td colspan="6" style="text-align:center;">No hay pedidos.</td></tr>';
    };

    document.addEventListener('change', (event) => {
      const select = event.target.closest('[data-pedido-estado]');
      if (!select) return;
      const pedidoId = select.getAttribute('data-pedido-estado');
      const pedido = D().getPedidoById(pedidoId);
      if (!pedido) return;
      const patch = { estado: select.value };
      if (select.value === 'Entregado' && !pedido.fechaEntrega) {
        patch.fechaEntrega = new Date().toISOString().slice(0, 10);
      }
      try {
        D().updatePedido(pedidoId, patch);
        actualizar();
        if (typeof Toastify !== 'undefined') {
          Toastify({ text: `El pedido ${pedidoId} pasó a estado "${select.value}".`, duration: 2500, gravity: 'top', position: 'right', style: { background: '#3b82f6' } }).showToast();
        }
      } catch (error) {
        L().manejarError(error, 'Cambio de estado');
      }
    });

    window.addEventListener('storage', actualizar);
    actualizar();
  };

  const iniciar = () => {
    if (typeof window.FWDData === 'undefined' || typeof window.FWDLogic === 'undefined') return;
    if (PAGE.toLowerCase() === 'clientes.html') inicializarModulo('clientes');
    if (PAGE.toLowerCase() === 'productos.html') inicializarModulo('productos');
    if (PAGE.toLowerCase() === 'proveedores.html') inicializarModulo('proveedores');
    if (PAGE.toLowerCase() === 'pedidos.html') inicializarPedidos();
    if (PAGE.toLowerCase() === 'dashboard.html') inicializarDashboard();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
