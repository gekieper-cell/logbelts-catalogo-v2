'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUpload() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function seleccionar(e: React.ChangeEvent<HTMLInputElement>) {
    setArchivo(e.target.files?.[0] || null);
    setMensaje(null);
  }

  async function subir() {
    if (!archivo) return;
    setCargando(true);
    setMensaje(null);

    try {
      const formData = new FormData();
      formData.append('archivo', archivo);

      const res = await fetch('/admin/api/subir-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje({ tipo: 'ok', texto: data.mensaje || '¡CSV subido! Vercel está redeployando.' });
        setArchivo(null);
        if (inputRef.current) inputRef.current.value = '';
        router.refresh();
      } else {
        setMensaje({ tipo: 'error', texto: data.error || 'Error al subir' });
      }
    } catch (e) {
      setMensaje({ tipo: 'error', texto: 'Error de conexión' });
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      {/* BOTÓN DE DESCARGA DEL TEMPLATE */}
      <div style={{
        padding: 16,
        background: 'var(--bg-alt)',
        borderRadius: 10,
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            📥 Plantilla de ejemplo
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            Descargá el CSV de ejemplo con el formato correcto
          </div>
        </div>
        <a
          href="/admin/api/template"
          download="template-productos-logbelts.csv"
          style={{
            padding: '10px 20px',
            background: 'var(--azul)',
            color: 'white',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          ⬇️ Descargar template
        </a>
      </div>

      {/* INSTRUCCIONES */}
      <div style={{
        padding: 16,
        border: '1px solid var(--border)',
        borderRadius: 10,
        marginBottom: 24,
        fontSize: 13,
        color: 'var(--text-dim)',
        lineHeight: 1.7,
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
          📋 Cómo preparar el CSV
        </div>
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          <li>Descargá el template (botón de arriba)</li>
          <li>Abrilo con Excel</li>
          <li>Borrar las filas de ejemplo y cargá tus productos</li>
          <li>Guardá como <strong>CSV UTF-8</strong> con el separador <code>;</code></li>
          <li>Subí el archivo acá abajo</li>
        </ol>
        <div style={{ marginTop: 12 }}>
          <strong style={{ color: 'var(--text)' }}>Las fotos</strong> se llaman{' '}
          <code>{'{codigo}'}.jpg</code> y van en{' '}
          <code>public/imagenes/</code>
        </div>
      </div>

      {/* UPLOAD */}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={seleccionar}
        style={{ marginBottom: 12, fontSize: 14 }}
      />

      {archivo && (
        <div style={{
          padding: 12,
          background: 'var(--bg-alt)',
          borderRadius: 8,
          fontSize: 13,
          color: 'var(--text-dim)',
          marginBottom: 12,
        }}>
          📄 {archivo.name} — {(archivo.size / 1024).toFixed(1)} KB
        </div>
      )}

      <button
        onClick={subir}
        disabled={!archivo || cargando}
        style={{
          padding: '10px 20px',
          background: 'var(--azul)',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: !archivo || cargando ? 'not-allowed' : 'pointer',
          opacity: !archivo || cargando ? 0.5 : 1,
        }}
      >
        {cargando ? '⏳ Subiendo...' : '📤 Subir CSV'}
      </button>

      {mensaje && (
        <div style={{
          marginTop: 16,
          padding: 12,
          borderRadius: 8,
          background: mensaje.tipo === 'ok' ? '#10b98120' : '#ef444420',
          color: mensaje.tipo === 'ok' ? '#10b981' : '#ef4444',
          fontSize: 14,
        }}>
          {mensaje.tipo === 'ok' ? '✅ ' : '❌ '}
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}
