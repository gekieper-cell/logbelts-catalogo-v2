import { ItemPedido } from '@/types';

export function exportarCSV(items: ItemPedido[], nombreArchivo = 'pedido-logbelts.csv') {
  const headers = ['Codigo', 'Nombre', 'Cantidad'];
  const filas = items.map(i => [
    i.codigo,
    `"${i.nombre.replace(/"/g, '""')}"`,
    i.cantidad.toString(),
  ]);
  const csv = [headers.join(','), ...filas.map(f => f.join(','))].join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  URL.revokeObjectURL(url);
}
