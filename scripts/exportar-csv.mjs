import fs from 'fs';

const contenido = fs.readFileSync('data/productos.json', 'utf-8');
const productos = JSON.parse(contenido);

const headers = [
  'codigo',
  'nombre',
  'descripcion',
  'familia',
  'familiaNombre',
  'subcategoria',
  'subcategoriaNombre',
  'marcas',
  'medidas',
  'foto',
  'descontinuado',
];

function escapar(valor) {
  if (valor === null || valor === undefined) return '';
  const str = String(valor);
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const filas = productos.map(p => [
  escapar(p.codigo),
  escapar(p.nombre),
  escapar(p.descripcion),
  escapar(p.familia),
  escapar(p.familiaNombre),
  escapar(p.subcategoria),
  escapar(p.subcategoriaNombre),
  escapar((p.marcas || []).join(' | ')),
  escapar((p.medidas || []).join(' | ')),
  escapar(p.foto),
  escapar(p.descontinuado ? 'si' : 'no'),
].join(';'));

const csv = [headers.join(';'), ...filas].join('\n');

fs.writeFileSync('data/productos.csv', '\uFEFF' + csv, 'utf-8');

console.log(`✅ Exportados ${productos.length} productos a data/productos.csv`);
console.log(`   Abrilo con Excel y editá lo que quieras.`);
console.log(`   Después corré: node scripts/actualizar.mjs`);
