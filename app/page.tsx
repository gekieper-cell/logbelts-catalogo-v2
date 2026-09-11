import Link from 'next/link';
import Header from '@/components/Header';
import categorias from '@/data/categorias.json';
import { Familia } from '@/types';

export default function Home() {
  const familias = categorias as Familia[];

  return (
    <>
      <Header />
      <main>
        <h1>Catálogo Logbelts</h1>
        <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>
          Repuestos para bosque y jardín — {familias.length} familias,{' '}
          {familias.reduce((s, f) => s + f.totalProductos, 0)} productos
        </p>

        <div className="familias-grid">
          {familias.map(f => (
            <Link key={f.slug} href={`/c/${f.slug}`} className="familia-card">
              <h3>{f.nombre}</h3>
              <div className="cantidad">
                {f.totalProductos} productos · {f.subcategorias.length} subcategorías
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
