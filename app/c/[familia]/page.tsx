import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import categorias from '@/data/categorias.json';
import { Familia } from '@/types';

export function generateStaticParams() {
  return (categorias as Familia[]).map(f => ({ familia: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ familia: string }> }) {
  const { familia } = await params;
  const fam = (categorias as Familia[]).find(f => f.slug === familia);
  return { title: fam ? `${fam.nombre} — Catálogo` : 'Familia' };
}

export default async function FamiliaPage({ params }: { params: Promise<{ familia: string }> }) {
  const { familia } = await params;
  const fam = (categorias as Familia[]).find(f => f.slug === familia);
  if (!fam) notFound();

  return (
    <>
      <Header />
      <main>
        <div className="breadcrumb">
          <Link href="/">Inicio</Link> / {fam.nombre}
        </div>
        <h1>{fam.nombre}</h1>
        <p style={{ color: 'var(--text-dim)' }}>
          {fam.totalProductos} productos en {fam.subcategorias.length} subcategorías
        </p>

        <div className="familias-grid">
          {fam.subcategorias.map(sub => (
            <Link
              key={sub.slug}
              href={`/c/${fam.slug}/${sub.slug}`}
              className="familia-card"
            >
              <h3>{sub.nombre}</h3>
              <div className="cantidad">{sub.cantidad} productos</div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
