import Link from 'next/link';
import AdminUpload from './AdminUpload';
import productos from '@/data/productos.json';
import categorias from '@/data/categorias.json';
import { getUltimoCommit } from '@/lib/github';
import fs from 'fs';
import path from 'path';

export default async function AdminPage() {
  const totalProductos = productos.length;
  const totalFamilias = categorias.length;
  const totalSubcats = categorias.reduce((s, c: any) => s + c.subcategorias.length, 0);

  let fotosOk = 0;
  const dirImagenes = path.join(process.cwd(), 'public', 'imagenes');
  try {
    const archivos = fs.readdirSync(dirImagenes);
    const setArchivos = new Set(archivos.map(a => a.toLowerCase()));
    for (const p of productos as any[]) {
      if (p.foto && setArchivos.has(p.foto.toLowerCase())) fotosOk++;
    }
  } catch {}
  const productosConFoto = (productos as any[]).filter(p => p.foto).length;

  const ultimoCommit = await getUltimoCommit();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-alt)' }}>
      <header style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>
          Admin · Logbelts Catálogo
        </h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/" target="_blank" style={{
            fontSize: 14,
            color: 'var(--azul)',
          }}>
            Ver sitio →
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
        <section style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>📊 Estado del catálogo</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
          }}>
            <Metrica titulo="Productos" valor={totalProductos.toString()} />
            <Metrica titulo="Familias" valor={totalFamilias.toString()} />
            <Metrica titulo="Subcategorías" valor={totalSubcats.toString()} />
            <Metrica titulo="Fotos OK" valor={`${fotosOk} / ${productosConFoto}`} />
          </div>
        </section>

        <section style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>📤 Actualizar catálogo</h2>
          <AdminUpload />
        </section>

        <section style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
        }}>
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>🕐 Último cambio</h2>
          {ultimoCommit ? (
            <div style={{ fontSize: 14, color: 'var(--text-dim)' }}>
              <div><strong style={{ color: 'var(--text)' }}>Mensaje:</strong> {ultimoCommit.commit.message}</div>
              <div><strong style={{ color: 'var(--text)' }}>Autor:</strong> {ultimoCommit.commit.author?.name}</div>
              <div><strong style={{ color: 'var(--text)' }}>Fecha:</strong> {new Date(ultimoCommit.commit.author?.date || '').toLocaleString('es-AR')}</div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-dim)' }}>No hay información disponible.</p>
          )}
        </section>
      </main>
    </div>
  );
}

function Metrica({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div>
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 4 }}>
        {titulo}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--azul)' }}>
        {valor}
      </div>
    </div>
  );
}
