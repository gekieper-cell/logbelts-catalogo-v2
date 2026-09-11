import fs from 'fs';
import path from 'path';

// Mapa de normalización: clave original → valor unificado
const MAPA = {
  // Carburadores
  'CARBURADORES': 'Carburadores',
  'Carburadores': 'Carburadores',
  'CARBURADORES 2T OTROS REEMPLAZOS': 'Carburadores 2T reemplazos',
  'CARBURADORES 4T OTROS REEMPLAZOS': 'Carburadores 4T reemplazos',
  'Partes de carburador': 'Partes de carburador',
  // Mangueras
  'Mangueras': 'Mangueras de combustible',
  'Mangueras de combustible': 'Mangueras de combustible',
  // Accesorios
  'ACCESORIOS': 'Accesorios',
  'ACCESORIOS / HERRAMIENTAS': 'Accesorios / Herramientas',
  'Accesorios': 'Accesorios',
  // Filtros
  'FILTROS DE AIRE REEMPLAZOS 2T': 'Filtros de aire reemplazos 2T',
  'FILTROS DE AIRE REEMPLAZOS 4T': 'Filtros de aire reemplazos 4T',
  'FILTROS DE AIRE SOPLADORAS 2T': 'Filtros de aire sopladoras 2T',
  'FILTROS DE COMBUSTIBLE': 'Filtros de combustible',
  'Filtro de aire': 'Filtro de aire',
  'Filtro de aceite': 'Filtro de aceite',
  // Cables
  'CABLES ACELERADOR': 'Cables acelerador',
  'CABLES DE ACCIONAMIENTO': 'Cables de accionamiento',
  'Cables': 'Cables',
  // Cuchillas
  'CUCHILLAS CARONI': 'Cuchillas Caroni',
  'CUCHILLAS CONVENCIONALES Y TRITURADORAS': 'Cuchillas convencionales y trituradoras',
  'CUCHILLAS REEMPLAZOS': 'Cuchillas reemplazos',
  'Cuchillas': 'Cuchillas',
  // Embragues
  'CAMPANA DE EMBRAGUE': 'Campana de embrague',
  'EMBRAGUES': 'Embragues',
  'Embragues / campanas / resortes': 'Embragues / Campanas / Resortes',
  'ELECTROEMBRAGUES': 'Electroembragues',
  // Motores
  'PARTES DE MOTOR 4T 13 HP 15HP HP 16HP REEMPLAZO GX270 GX390 GX420 GX440': 'Partes de motor 4T 13-16HP GX270/GX390/GX420/GX440',
  'PARTES DE MOTOR 5.5 HP 6.5 HP REEMPLAZO GX160 GX200': 'Partes de motor 4T 5.5-6.5HP GX160/GX200',
  'REEMPLAZOS BRIGGS & STRATTON': 'Reemplazos Briggs & Stratton',
  'REEMPLAZO B&S': 'Reemplazos Briggs & Stratton',
  // Tapas
  'Tapas de arranque': 'Tapas de arranque',
  'TAPAS DE CILINDRO': 'Tapas de cilindro',
  'TAPAS DE DEPOSITOS': 'Tapas de depósitos',
  'TAPAS FILTRO DE AIRE REEMPLAZO 2T': 'Tapas filtro de aire reemplazo 2T',
  // Kits
  'KITS DE JUNTAS Y DIAFRAGMAS': 'Kits de juntas y diafragmas',
  'KIT DE O´RING': 'Kit de o-rings',
  'Kit de cilindros': 'Kit de cilindros',
  'Kit de pistón': 'Kit de pistón',
  // Cilindros y pistones
  'CILINDROS COMPLETOS': 'Cilindros completos',
  'CILINDROS Y PISTONES (SEGÚN MARCA)': 'Cilindros y pistones',
  'PISTONES Y AROS': 'Pistones y aros',
  'Aros': 'Aros',
  // Otros
  'BOMBINES 2T': 'Bombines 2T',
  'LLAVES PASES DE COMBUSTIBLE': 'Llaves pases de combustible',
  'PUNZUARES DE CARBURADOR': 'Punzuares de carburador',
  'VÁLVULAS': 'Válvulas',
  'BOMBA DE ACEITE Y SIN FIN': 'Bomba de aceite y sin fin',
  'Bomba de aceite': 'Bomba de aceite',
  'SIN FINES HUSQVARNA / OTROS': 'Sin fines Husqvarna / Otros',
  'Bobina de ignición': 'Bobina de ignición',
  'Cigüeñal': 'Cigüeñal',
  'Escapes': 'Escapes',
  'Retén': 'Retén',
  'RETENES': 'Retén',
  'Caja de engranaje': 'Caja de engranaje',
  'Cabezales de tanza': 'Cabezales de tanza',
  'Tanque de combustible / tapa': 'Tanque de combustible / Tapa',
  'CADENAS PREMIUM': 'Cadenas premium',
  'ESPADAS PREMIUM': 'Espadas premium',
  'ESPADAS STANDARD': 'Espadas standard',
  'CORREAS DE KEVLAR': 'Correas de kevlar',
  'Partes': 'Partes',
  'CÁMARAS Y NEUMÁTICOS': 'Cámaras y neumáticos',
  'NEUMATICOS': 'Neumáticos',
  'POLEAS': 'Poleas',
  'RESORTES DE PLATAFORMAS': 'Resortes de plataformas',
  'RUEDAS DE PLATAFORMA Y BULONES': 'Ruedas de plataforma y bulones',
  'RUEDAS PARA MÁQUINAS DE EMPUJE': 'Ruedas para máquinas de empuje',
  'TORRETAS CARCASAS EJES': 'Torretas / Carcasas / Ejes',
  'KOHLER': 'Kohler',
  'REEMPLAZOS': 'Reemplazos',
  'REPUESTOS': 'Repuestos',
  'MAQUINAS 4 TIEMPOS': 'Máquinas 4 tiempos',
  'MOTORES 4T': 'Motores 4T',
  '3500': '3500',
  '6500': '6500',
  '4T / 2T': '4T / 2T',
  'TANZA PREMIUM': 'Tanza premium',
  'OLEOMAC': 'Oleomac',
  'desmalezadora': 'Desmalezadora',
  'REPARACIONES DE CARBURADOR / KITS DE JUNTAS': 'Reparaciones de carburador / Kits de juntas',
  'Juntas de motor': 'Juntas de motor',
};

// Mapa de familias
const MAPA_FAMILIAS = {
  'arnes': 'Arnes',
  'Carburación': 'Carburación',
};

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

// Leer productos
console.log('📖 Leyendo productos...');
const productos = JSON.parse(fs.readFileSync('./data/productos.json', 'utf-8'));

// Normalizar
console.log('🧹 Normalizando...');
let cambiados = 0;
for (const p of productos) {
  const subNorm = MAPA[p.subcategoriaNombre] || p.subcategoriaNombre;
  const famNorm = MAPA_FAMILIAS[p.familiaNombre] || p.familiaNombre;

  if (subNorm !== p.subcategoriaNombre || famNorm !== p.familiaNombre) {
    p.subcategoriaNombre = subNorm;
    p.subcategoria = slug(subNorm);
    p.familiaNombre = famNorm;
    p.familia = slug(famNorm);
    cambiados++;
  }
}

console.log(`   ${cambiados} productos normalizados`);

// Guardar
fs.writeFileSync('./data/productos.json', JSON.stringify(productos, null, 2), 'utf-8');

// Regenerar categorías
console.log('📁 Regenerando categorías...');
const mapa = new Map();
for (const p of productos) {
  if (!p.familiaNombre || !p.subcategoriaNombre) continue;
  if (!mapa.has(p.familiaNombre)) {
    mapa.set(p.familiaNombre, { slug: p.familia, nombre: p.familiaNombre, subcategorias: new Map() });
  }
  const fam = mapa.get(p.familiaNombre);
  if (!fam.subcategorias.has(p.subcategoriaNombre)) {
    fam.subcategorias.set(p.subcategoriaNombre, { slug: p.subcategoria, nombre: p.subcategoriaNombre, cantidad: 0 });
  }
  fam.subcategorias.get(p.subcategoriaNombre).cantidad++;
}

const categorias = [...mapa.values()]
  .map(f => ({
    slug: f.slug,
    nombre: f.nombre,
    totalProductos: [...f.subcategorias.values()].reduce((s, x) => s + x.cantidad, 0),
    subcategorias: [...f.subcategorias.values()].sort((a, b) => a.nombre.localeCompare(b.nombre)),
  }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre));

fs.writeFileSync('./data/categorias.json', JSON.stringify(categorias, null, 2), 'utf-8');

console.log('');
console.log('📊 Resultado:');
categorias.forEach(c => {
  console.log(`   ${c.nombre} (${c.totalProductos} productos, ${c.subcategorias.length} subcat)`);
});
console.log('');
console.log('✅ Listo');
