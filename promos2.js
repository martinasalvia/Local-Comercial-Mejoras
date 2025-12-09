let carrito = [];
let promoSeleccionada = null;

function sumarCantidad(nombre, precio) {
  const producto = carrito.find(p => p.nombre === nombre);
  if (producto) {
    producto.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  actualizarCantidadUI(nombre);
  renderCarrito();
}

function restarCantidad(nombre, precio) {
  const producto = carrito.find(p => p.nombre === nombre);
  if (producto) {
    producto.cantidad--;
    if (producto.cantidad <= 0) {
      carrito = carrito.filter(p => p.nombre !== nombre);
      producto.cantidad = 0;
    }
  }
  actualizarCantidadUI(nombre);
  renderCarrito();
}

function actualizarCantidadUI(nombre) {
  const span = document.getElementById("cantidad-" + nombre);
  const producto = carrito.find(p => p.nombre === nombre);
  span.textContent = producto ? producto.cantidad : 0;
}

function renderCarrito() {
  const lista = document.getElementById("lista-carrito");
  const subtotalTag = document.getElementById("subtotal");
  const descuentosTag = document.getElementById("descuentos");
  const totalTag = document.getElementById("total");
  const promoInfo = document.getElementById("promo-activa");

  lista.innerHTML = "";
  let subtotal = 0;

  carrito.forEach(item => {
    subtotal += item.precio * item.cantidad;
    lista.innerHTML += `
      <p>
        <strong>${item.nombre}</strong> — Cantidad: ${item.cantidad} — $${(item.precio * item.cantidad).toLocaleString("es-AR")}
      </p>
    `;
  });

  let descuentos = calcularDescuentos();

  subtotalTag.textContent = subtotal.toLocaleString("es-AR");
  descuentosTag.textContent = descuentos.toLocaleString("es-AR");
  totalTag.textContent = (subtotal - descuentos).toLocaleString("es-AR");

  if (promoSeleccionada) {
    promoInfo.textContent = "Promoción activa: " + promoSeleccionada;
  } else {
    promoInfo.textContent = "";
  }
}

function seleccionarPromo(tipo) {
  promoSeleccionada = tipo;

  document.querySelectorAll(".promo-card button").forEach(btn => {
    btn.textContent = "Usar esta promo";
    btn.classList.remove("promo-aplicada");
  });

  const card = document.querySelector(`.promo-card button[onclick="seleccionarPromo('${tipo}')"]`);
  if (card) {
    card.textContent = "Promo aplicada";
    card.classList.add("promo-aplicada");
  }

  renderCarrito();
}

function calcularDescuentos() {
  if (!promoSeleccionada) return 0;

  // Lista plana de precios según cantidades
  let precios = [];
  carrito.forEach(item => {
    for (let i = 0; i < item.cantidad; i++) {
      precios.push(item.precio);
    }
  });

  const n = precios.length;
  const subtotal = precios.reduce((acc, val) => acc + val, 0);

  // Ordeno de menor a mayor para poder sumar los más baratos del total
  precios.sort((a, b) => a - b);

  // 2x1: se descuentan los floor(n/2) más baratos del total
  if (promoSeleccionada === "2x1" && n >= 2) {
    const gratis = Math.floor(n / 2);
    let descuento = 0;
    for (let i = 0; i < gratis; i++) {
      descuento += precios[i];
    }
    return descuento;
  }

  // 3x2: se descuentan los floor(n/3) más baratos del total
  if (promoSeleccionada === "3x2" && n >= 3) {
    const gratis = Math.floor(n / 3);
    let descuento = 0;
    for (let i = 0; i < gratis; i++) {
      descuento += precios[i];
    }
    return descuento;
  }

  // 10% OFF: sobre subtotal si supera el umbral
  if (promoSeleccionada === "10% OFF" && subtotal > 30000) {
    return subtotal * 0.1;
  }

  return 0;
}

function confirmarCompra() {
  if (carrito.length === 0) {
    document.getElementById("modal-error").classList.remove("hidden");
    return;
  }
  document.getElementById("modal-compra").classList.remove("hidden");
}

function cerrarError() {
  document.getElementById("modal-error").classList.add("hidden");
}

function nuevaCompra() {
  carrito = [];
  renderCarrito();

  promoSeleccionada = null;
  document.getElementById("promo-activa").textContent = "";

  document.querySelectorAll(".promo-card button").forEach(btn => {
    btn.textContent = "Usar esta promo";
    btn.classList.remove("promo-aplicada");
  });

  // Resetear cantidades en las cards
  document.querySelectorAll(".cantidad-control span").forEach(span => {
    span.textContent = 0;
  });

  document.getElementById("modal-compra").classList.add("hidden");
}