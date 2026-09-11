import Link from 'next/link';
import Header from '@/components/Header';
import ListaProductos from '@/components/ListaProductos';
import productos from '@/data/productos.json';
import { Producto } from '@/types';

export const metadata = {
  title: 'Buscar productos',
};

function normalizar(s: string): string {
  return s
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const qNorm = normalizar(q.trim());

  let resultados: Producto[] = [];
  if (qNorm.length >= 2) {
    resultados = (productos as Producto[]).filter(p => {
      return (
        normalizar(p.codigo).includes(qNorm) ||
        normalizar(p.nombre).includes(qNorm) ||
        p.marcas.some(m => normalizar(m).includes(qNorm))
      );
    });
  }

  return (
    <>
      <Header q={q} />
      <main>
        <div className="breadcrumb">
          <Link href="/">Inicio</Link> / Buscar
        </div>
        <h1>
          {q ? `Resultados para "${q}"` : 'Buscar productos'}
        </h1>

        {!q && (
          <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>
            Escribí en el buscador del header para encontrar productos por código,
            nombre o marca.
          </p>
        )}

        {q && qNorm.length < 2 && (
          <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>
            Escribí al menos 2 caracteres.
          </p>
        )}

        {q && qNorm.length >= 2 && (
          <>
            <p style={{ color: 'var(--text-dim)', marginTop: 8, marginBottom: 16 }}>
              {resultados.length} resultados
            </p>
            <ListaProductos productos={resultados} />
          </>
        )}
      </main>
    </>
  );
}
