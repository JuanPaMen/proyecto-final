// Los precios de la tienda ya incluyen el IVA. En Colombia la tarifa general es 19%:
// el precio base sale de dividir entre 1,19 y el IVA es la diferencia.
const TASA_IVA = 0.19;

const desglosarIva = (precioFinal) => {
  const base = Math.round(precioFinal / (1 + TASA_IVA));

  return { base, iva: precioFinal - base };
};

module.exports = { TASA_IVA, desglosarIva };
