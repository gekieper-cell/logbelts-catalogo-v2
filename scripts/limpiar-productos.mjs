import fs from 'fs';
import path from 'path';

// Rutas
const ORIGEN = path.resolve(process.env.HOME, 'logbelts-original/data/productos.json');
const DESTINO = path.resolve('./data/productos.json');

// Asegurar que exista la carpeta data/
fs.mkdirSync(path.dirname(DESTINO), { recursive: true });

// Leer original
console.log('📖 Leyendo productos originales...');
const productos = JSON.parse(fs.readFileSync(ORIGEN, 'utf-8'));
console.log(`   Encontrados: ${productos.length} productos`);

// Función para generar slug
function slug(texto) {
  if (!texto) return '';
  return texto
    .toString()
    .normalize('NFD')                    // descompone acentos
    .replace(/[\u0300-\u036f]/g, '')     // elimina acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')        // quita caracteres raros
    .replace(/\s+/g, '-')                // espacios → guiones
    .replace(/-+/g, '-');                // guiones múltiples → uno
}

// Limpiar
console.log('🧹 Limpiando productos...');
const limpios = productos
  .filter(p => p.codigo && p.nombre && !p.oculto)  // sin código/nombre o ocultos
  .map(p => ({
    codigo: String(p.codigo).trim(),
    nombre: (p.nombre || '').trim(),
    descripcion: (p.descripcion || '').trim(),
    familia: slug(p.familia || ''),
    familiaNombre: (p.familia || '').trim(),
    subcategoria: slug(p.subcategoria || ''),
    subcategoriaNombre: (p.subcategoria || '').trim(),
    marcas: Array.isArray(p.marcas) ? p.marcas.filter(Boolean) : [],
    medidas: Array.isArray(p.medidas) ? p.medidas.filter(Boolean) : [],
    foto: p.foto || null,
    descontinuado: !!p.descontinuado,
  }));

console.log(`   Productos limpios: ${limpios.length}`);

// Estadísticas
const conFoto = limpios.filter(p => p.foto).length;
const familias = [...new Set(limpios.map(p => p.familiaNombre))];
const subcategorias = [...new Set(limpios.map(p => p.subcategoriaNombre))];

console.log('');
console.log('📊 Estadísticas:');
console.log(`   Total productos:    ${limpios.length}`);
console.log(`   Con foto:           ${conFoto}`);
console.log(`   Sin foto:           ${limpios.length - conFoto}`);
console.log(`   Familias:           ${familias.length}`);
console.log(`   Subcategorías:      ${subcategorias.length}`);

// Guardar
fs.writeFileSync(DESTINO, JSON.stringify(limpios, null, 2), 'utf-8');
console.log('');
console.log(`✅ Guardado en: ${DESTINO}`);
console.log('');
console.log('Familias encontradas:');
familias.forEach(f => console.log(`   - ${f}`));
