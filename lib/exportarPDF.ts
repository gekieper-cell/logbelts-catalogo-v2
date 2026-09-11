import { ItemPedido } from '@/types';

export async function exportarPDF(items: ItemPedido[], nombreArchivo = 'pedido-logbelts.pdf') {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text('LOGBELTS', 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Catalogo de repuestos para bosque y jardin', 14, 28);

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('PEDIDO', 14, 42);

  doc.setFontSize(9);
  doc.setTextColor(120);
  const fecha = new Date().toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  doc.text(`Fecha: ${fecha}`, 14, 48);

  autoTable(doc, {
    startY: 55,
    head: [['Codigo', 'Nombre', 'Cantidad']],
    body: items.map(i => [i.codigo, i.nombre, i.cantidad.toString()]),
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 30, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 20, halign: 'center' },
    },
  });

  const totalUnidades = items.reduce((s, i) => s + i.cantidad, 0);
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(`Total de items: ${items.length}`, 14, finalY);
  doc.text(`Total de unidades: ${totalUnidades}`, 14, finalY + 6);

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    'Generado desde logbelts-catalogo-v2.vercel.app',
    14,
    doc.internal.pageSize.getHeight() - 10
  );

  doc.save(nombreArchivo);
}
