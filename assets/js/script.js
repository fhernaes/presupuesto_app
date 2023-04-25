const botonPresupuesto = document.querySelector('#calcular');
const botonGasto = document.querySelector('#calcularGasto');
const filaPresupuesto = document.querySelector('#filaPresupuesto');
const entradaPresupuesto = document.querySelector('#presupuesto');
const nombreGasto = document.querySelector('#gasto')
const valorGasto = document.querySelector('#valor');
const filaSaldo = document.querySelector('#filaSaldo');
const filaGasto = document.querySelector('#filaGasto');
const tabla = document.querySelector('#contenidoTabla');
const alerta = document.querySelector('#alerta');
botonPresupuesto.disabled = true;
botonGasto.disabled = true;
nombreGasto.disabled = true;
valorGasto.disabled = true;
let botonCalcular = false;

function Cuenta(presupuesto, saldo) {
  this.presupuesto = presupuesto;
  this.gastos = [];
  this.saldo = saldo;
}

Cuenta.prototype.ingresarPresupuesto = function (presupuesto) {
  this.presupuesto = presupuesto;
}
Cuenta.prototype.ingresarGasto = function (nombreGasto, valorGasto) {
  this.gastos.push({ nombre: nombreGasto, valor: valorGasto });
}
Cuenta.prototype.sumarGastos = function () {
  return this.gastos.reduce(
    (accumulator, currentValue) => accumulator + currentValue.valor, 0);

}
Cuenta.prototype.calcularSaldo = function (gastosTotales) {
  this.saldo = this.presupuesto - gastosTotales;

}
const validarPresupuesto = function (presupuesto) {
  if (presupuesto <= 0) {
    return 'El presupuesto debe ser mayor a cero, por favor inténtelo nuevamente';
  } else if (isNaN(presupuesto)) {
    return 'Debe ingresar un valor válido, , por favor inténtelo nuevamente';
  }
  return true;
}
const mostrarPresupuesto = function (presupuesto) {
  filaPresupuesto.innerHTML = `<div class="col">$${presupuesto}</div>`;
};
const mostrarGasto = function (gasto) {
  filaGasto.innerHTML = `<div class="col">$ ${gasto}</div>`;
};
const mostrarSaldo = function (saldo) {
  filaSaldo.innerHTML = `<div class ="col">$ ${saldo}</div>`;
};
const validarGasto = function (gasto, presupuesto, saldo, nombre) {
  if (gasto <= 0) {
    return 'El valor del gasto no debe ser menor a cero, por favor inténtelo nuevamente';
  } else if (isNaN(gasto)) {
    return 'Debe ingresar un valor válido, , por favor inténtelo nuevamente';
  }
  if (gasto > presupuesto) {
    return `El valor del gasto excede al presupuesto, por favor inténtelo nuevamente`;
  } else if (gasto > saldo) {
    return `El valor del gasto excede el saldo existente que es ${saldo}`;
  } else if (!botonCalcular) {
    return `Debe ingresar un presupuesto antes de ingresar un gasto`;
  } if (!nombre.trim()) {
    return 'Debe ingresar el nombre del gasto, por favor inténtelo nuevamente';
  }
  return true;
}

const eliminarFilaGasto = function (fila) {
  const valor = parseInt(fila.querySelector('td:nth-child(2)').textContent);
  fila.remove();
  const indice = cuenta.gastos.findIndex(gasto => gasto.valor === valor);
  cuenta.gastos.splice(indice, 1);
  nombreGasto.value = '';
  valorGasto.value = '';
};

const mostrarContenidoTabla = function (gastos) {
  let fila = '';
  gastos.forEach(function (gasto) {
    fila += `
      <tr>
        <td>${gasto.nombre}</td>
        <td>$ ${gasto.valor}</td>
        <td><i class="bi bi-trash3-fill"></i></td>
      </tr>
    `;
  });
  tabla.innerHTML = fila;
};
const mostrarAlerta = function (mensaje) {
  alerta.innerHTML = `<div class="alert alert-danger shadow alert-dismissible" role="alert">
      <div>${mensaje}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> </div>`
}
const cuenta = new Cuenta();

function habilitarBotones(event) {
  if (event.target.value.trim() !== '') {
    botonPresupuesto.disabled = false;
    botonGasto.disabled = false;
    nombreGasto.disabled = false;
    valorGasto.disabled = false;
  }
}
function verificarEntradaPresupuesto(event) {
  event.preventDefault();
  let presupuesto = parseInt(entradaPresupuesto.value);
  let mensajePresupuesto = validarPresupuesto(presupuesto);
  if (mensajePresupuesto === true) {
    cuenta.ingresarPresupuesto(presupuesto);
    mostrarPresupuesto(cuenta.presupuesto);
    botonCalcular = true;
    alerta.innerHTML = '';
  } else {
    mostrarAlerta(mensajePresupuesto);
  }
}
function verificarEntradaGasto(event) {
  event.preventDefault();
  let valor = parseInt(valorGasto.value);
  let mensajeGasto = validarGasto(valor, cuenta.presupuesto, cuenta.saldo, nombreGasto.value);
  if (mensajeGasto === true) {
    cuenta.ingresarGasto(nombreGasto.value, valor)
    let gastosTotales = cuenta.sumarGastos(cuenta.gastos);
    mostrarContenidoTabla(cuenta.gastos);
    mostrarGasto(gastosTotales);
    cuenta.calcularSaldo(gastosTotales);
    mostrarSaldo(cuenta.saldo)
    alerta.innerHTML = '';
  } else {
    mostrarAlerta(mensajeGasto);
  }
}
function agregarContenidoTabla(event) {
  if (event.target.classList.contains('bi-trash3-fill')) {
    const fila = event.target.parentNode.parentNode;
    eliminarFilaGasto(fila);
    const gastosTotales = cuenta.sumarGastos();
    cuenta.calcularSaldo(gastosTotales);
    mostrarContenidoTabla(cuenta.gastos);
    mostrarGasto(gastosTotales);
    mostrarSaldo(cuenta.saldo);
  }
}

entradaPresupuesto.addEventListener('keyup', habilitarBotones);
botonPresupuesto.addEventListener('click', verificarEntradaPresupuesto);
botonGasto.addEventListener('click', verificarEntradaGasto);
tabla.addEventListener('click', agregarContenidoTabla);



