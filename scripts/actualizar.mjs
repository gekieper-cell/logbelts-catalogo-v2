import fs from 'fs';

console.log('');
console.log('🔄 ACTUALIZANDO CATÁLOGO LOG BELTS');
console.log('===================================');
console.log('');

// 1. LEER CSV
console.log('📖 1/6 Leyendo data/productos.csv...');

if (!fs.existsSync('data/productos.csv')) {
  console.error('❌ No existe data/productos.csv');
  console.error('   Ejecutá primero: node scripts/exportar-csv.mjs');
  process.exit(1);
}

const contenido = fs.readFileSync('data/productos.csv', 'utf-8').replace(/^\uFEFF/, '');
const lineas = contenido.split(/\r?\n/).filter(l => l.trim());

if (lineas.length < 2) {
  console.error('❌ El CSV está vacío');
  process.exit(1);
}

// 2. PARSEAR CSV
function parsearLinea(linea) {
  const campos = [];
  let actual = '';
  let dentroComillas = false;

  for (let i = 0; i < linea.length; i++) {
    const c = linea[i];
    if (dentroComillas) {
      if (c === '"' && linea[i + 1] === '"') {
        actual += '"';
        i++;
      } else if (c === '"') {
        dentroComillas = false;
      } else {
        actual += c;
      }
    } else {
      if (c === '"') {
        dentroComillas = true;
      } else if (c === ';') {
        campos.push(actual);
        actual = '';
      } else {
        actual += c;
      }
    }
  }
  campos.push(actual);
  return campos;
}

const headers = parsearLinea(lineas[0]).map(h => h.trim());

// 3. SLUG
function slug(texto) {
  if (!texto) return '';
  return texto
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

console.log('🧹 2/6 Normalizando productos...');

// 4. CONSTRUIR PRODUCTOS
const productos = [];
const codigosVistos = new Set();
let duplicados = 0;
let sinCodigo = 0;

for (let i = 1; i < lineas.length; i++) {
  const campos = parsearLinea(lineas[i]);
  const obj = {};
  headers.forEach((h, idx) => {
    obj[h] = (campos[idx] || '').trim();
  });

  if (!obj.codigo || !obj.nombre) {
    sinCodigo++;
    continue;
  }

  if (codigosVistos.has(obj.codigo)) {
    duplicados++;
    continue;
  }
  codigosVistos.add(obj.codigo);

  productos.push({
    codigo: obj.codigo,
    nombre: obj.nombre,
    descripcion: obj.descripcion || '',
    familia: obj.familia || slug(obj.familiaNombre),
    familiaNombre: obj.familiaNombre || '',
    subcategoria: obj.subcategoria || slug(obj.subcategoriaNombre),
    subcategoriaNombre: obj.subcategoriaNombre || '',
    marcas: obj.marcas ? obj.marcas.split('|').map(m => m.trim()).filter(Boolean) : [],
    medidas: obj.medidas ? obj.medidas.split('|').map(m => m.trim()).filter(Boolean) : [],
    foto: obj.foto || null,
    descontinuado: obj.descontinuado === 'si' || obj.descontinuado === 'true',
  });
}

console.log(`   ${productos.length} productos válidos`);
if (duplicados > 0) console.log(`   ⚠️  ${duplicados} códigos duplicados (ignorados)`);
if (sinCodigo > 0) console.log(`   ⚠️  ${sinCodigo} filas sin código (ignoradas)`);

// 5. ORDENAR
console.log('📊 3/6 Ordenando productos...');

productos.sort((a, b) => {
  const famCmp = a.familiaNombre.localeCompare(b.familiaNombre, 'es');
  if (famCmp !== 0) return famCmp;
  const subCmp = a.subcategoriaNombre.localeCompare(b.subcategoriaNombre, 'es');
  if (subCmp !== 0) return subCmp;
  return a.codigo.localeCompare(b.codigo, 'es');
});

fs.writeFileSync('data/productos.json', JSON.stringify(productos, null, 2), 'utf-8');
console.log('✅ 4/6 data/productos.json actualizado');

// 6. CATEGORÍAS
console.log('📁 5/6 Regenerando categorías...');

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
  fam.subcategorias.get(p.subcategoriaNombre).cantidad++;
}

const categorias = [...mapa.values()]
  .map(f => ({
    slug: f.slug,
    nombre: f.nombre,
    totalProductos: [...f.subcategorias.values()].reduce((s, x) => s + x.cantidad, 0),
    subcategorias: [...f.subcategorias.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')),
  }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

fs.writeFileSync('data/categorias.json', JSON.stringify(categorias, null, 2), 'utf-8');
console.log('✅ data/categorias.json actualizado');

// 7. FOTOS
console.log('📸 6/6 Verificando fotos...');

let fotosOk = 0;
let fotosFaltantes = 0;
const faltantes = [];

for (const p of productos) {
  if (!p.foto) continue;
  const ruta = `public/imagenes/${p.foto}`;
  if (fs.existsSync(ruta)) {
    fotosOk++;
  } else {
    fotosFaltantes++;
    if (faltantes.length < 10) faltantes.push(p.foto);
  }
}

console.log('');
console.log('===================================');
console.log('✅ CATÁLOGO ACTUALIZADO');
console.log('===================================');
console.log('');
console.log(`📦 Productos:        ${productos.length}`);
console.log(`📁 Familias:         ${categorias.length}`);
console.log(`📂 Subcategorías:    ${categorias.reduce((s, c) => s + c.subcategorias.length, 0)}`);
console.log(`📸 Fotos OK:         ${fotosOk}`);
if (fotosFaltantes > 0) {
  console.log(`⚠️  Fotos faltantes:  ${fotosFaltantes}`);
  console.log(`   Ejemplos: ${faltantes.join(', ')}`);
}
console.log('');
console.log('🚀 Próximos pasos:');
console.log('   1. Probar:  npm run dev');
console.log('   2. Subir:   git add . && git commit -m "actualizo catálogo" && git push');
console.log('   3. Vercel despliega solo');
console.log('');
