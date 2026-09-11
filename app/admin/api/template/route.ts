import { NextResponse } from 'next/server';

const TEMPLATE = `codigo;nombre;descripcion;familia;familiaNombre;subcategoria;subcategoriaNombre;marcas;medidas;foto;descontinuado
EJEMPLO001;Producto de ejemplo 1;Descripción larga del producto;carburacion;Carburación;mangueras-de-combustible;Mangueras de combustible;Walbro;4mm;EJEMPLO001.jpg;no
EJEMPLO002;Producto de ejemplo 2;;desmalezadoras;Desmalezadoras;carburadores;Carburadores;Zama | Walbro;6mm | 8mm;EJEMPLO002.jpg;no
EJEMPLO003;Producto sin foto;;motosierras;Motosierras;cadenas-premium;Cadenas Premium;;; ;no
EJEMPLO004;Producto descontinuado;;carburacion;Carburación;valvulas;VÁLVULAS;Walbro;;EJEMPLO004.jpg;si
`;

export async function GET() {
  // BOM UTF-8 para que Excel lo abra bien con acentos
  const csv = '\uFEFF' + TEMPLATE;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="template-productos-logbelts.csv"',
    },
  });
}
