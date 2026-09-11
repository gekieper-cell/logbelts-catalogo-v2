import fs from 'fs';
import path from 'path';

const ORIGEN = path.resolve('./data/productos.json');
const DESTINO = path.resolve('./data/categorias.json');

const productos = JSON.parse(fs.readFileSync(ORIGEN, 'utf-8'));

// Agrupar familia → subcategorías
const mapa = new Map();

for (const p of productos) {
  if (!p.familiaNombre || !p.subcategoriaNombre) continue;

  if (!mapa.has(p.familiaNombre)) {
    mapa.set(p.familiaNombre, {
      slug: p.familia,
      nombre: p.familiaNombre,
      subcategorias: new Map(),
    });
  }

  const fam = mapa.get(p.familiaNombre);
  if (!fam.subcategorias.has(p.subcategoriaNombre)) {
    fam.subcategorias.set(p.subcategoriaNombre, {
      slug: p.subcategoria,
      nombre: p.subcategoriaNombre,
      cantidad: 0,
    });
  }

  const sub = fam.subcategorias.get(p.subcategoriaNombre);
  sub.cantidad++;
}

// Convertir a array
const categorias = [...mapa.values()]
  .map(f => ({
    slug: f.slug,
    nombre: f.nombre,
    subcategorias: [...f.subcategorias.values()].sort((a, b) => a.nombre.localeCompare(b.nombre)),
  }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre));

fs.mkdirSync(path.dirname(DESTINO), { recursive: true });
fs.writeFileSync(DESTINO, JSON.stringify(categorias, null, 2), 'utf-8');

console.log('📊 Categorías generadas:');
categorias.forEach(c => {
  console.log(`\n   ${c.nombre} (${c.subcategorias.length} subcat)`);
  c.subcategorias.forEach(s => console.log(`      - ${s.nombre} (${s.cantidad})`));
});

console.log(`\n✅ Guardado en: ${DESTINO}`);
