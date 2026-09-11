import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import ListaProductos from '@/components/ListaProductos';
import categorias from '@/data/categorias.json';
import productos from '@/data/productos.json';
import { Familia, Producto } from '@/types';

export function generateStaticParams() {
  const params: { familia: string; sub: string }[] = [];
  for (const fam of categorias as Familia[]) {
    for (const sub of fam.subcategorias) {
      params.push({ familia: fam.slug, sub: sub.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ familia: string; sub: string }>;
}) {
  const { familia, sub } = await params;
  const fam = (categorias as Familia[]).find(f => f.slug === familia);
  const subcat = fam?.subcategorias.find(s => s.slug === sub);
  return {
    title: subcat ? `${subcat.nombre} — ${fam?.nombre}` : 'Productos',
  };
}

export default async function SubPage({
  params,
}: {
  params: Promise<{ familia: string; sub: string }>;
}) {
  const { familia, sub } = await params;
  const fam = (categorias as Familia[]).find(f => f.slug === familia);
  if (!fam) notFound();
  const subcat = fam.subcategorias.find(s => s.slug === sub);
  if (!subcat) notFound();

  const productosFiltrados = (productos as Producto[]).filter(
    p => p.familia === familia && p.subcategoria === sub
  );

  return (
    <>
      <Header />
      <main>
        <div className="breadcrumb">
          <Link href="/">Inicio</Link> /{' '}
          <Link href={`/c/${fam.slug}`}>{fam.nombre}</Link> / {subcat.nombre}
        </div>
        <h1>{subcat.nombre}</h1>
        <ListaProductos productos={productosFiltrados} />
      </main>
    </>
  );
}
