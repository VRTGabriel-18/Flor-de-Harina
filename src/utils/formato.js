// Acepta números (3500) o textos ("3500", "$3.500") y los muestra como pesos colombianos.
export const formatearPrecio = (valor) => {
  if (valor === undefined || valor === null || valor === '') return '—';

  const numero =
    typeof valor === 'number' ? valor : Number(String(valor).replace(/[^\d]/g, ''));

  if (!Number.isFinite(numero) || (typeof valor === 'string' && !/\d/.test(valor))) {
    return String(valor);
  }

  return numero.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
};
