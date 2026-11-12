// Los precios ya incluyen el IVA (19%, tarifa general en Colombia).
// Debe coincidir con backend/src/utils/iva.js, que es el que cuenta al pagar.
export const TASA_IVA = 0.19;

export const porcentajeIva = Math.round(TASA_IVA * 100);

export function desglosarIva(precioFinal) {
  const base = Math.round(precioFinal / (1 + TASA_IVA));

  return { base, iva: precioFinal - base };
}

// Se redondea por unidad y se multiplica por la cantidad, así base + IVA = total exacto
export function resumenCarrito(items) {
  return items.reduce(
    (resumen, item) => {
      const precio = Number(item.precio) || 0;
      const cantidad = item.cantidad || 1;
      const { base, iva } = desglosarIva(precio);

      return {
        subtotal: resumen.subtotal + base * cantidad,
        iva: resumen.iva + iva * cantidad,
        total: resumen.total + precio * cantidad,
      };
    },
    { subtotal: 0, iva: 0, total: 0 },
  );
}

export const pesos = (valor) => `$${Number(valor).toLocaleString("es-CO")}`;
