'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { usePedido } from '@/hooks/usePedido';
import { cambiarCantidad, quitarDelPedido, vaciarPedido, totalItems } from '@/lib/carrito';
import { exportarPDF } from '@/lib/exportarPDF';
import { exportarCSV } from '@/lib/exportarCSV';

export default function PedidoPage() {
  const { items, cargado } = usePedido();
  const totalUnidades = totalItems(items);

  if (!cargado) {
    return (
      <>
        <Header />
        <main>
          <p>Cargando pedido...</p>
        </main>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main>
          <div className="breadcrumb">
            <Link href="/">Inicio</Link> / Pedido
          </div>
          <h1>Pedido</h1>
          <div className="pedido-vacio">
            <p style={{ fontSize: 18, marginBottom: 16 }}>
              Tu pedido está vacío
            </p>
            <Link href="/" className="btn-primario" style={{ display: 'inline-block' }}>
              Ir al catálogo
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <div className="breadcrumb">
          <Link href="/">Inicio</Link> / Pedido
        </div>
        <h1>Pedido</h1>

        <table className="pedido-tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.codigo}>
                <td className="codigo" style={{ fontFamily: 'monospace', color: 'var(--azul)' }}>
                  {item.codigo}
                </td>
                <td>{item.nombre}</td>
                <td>
                  <input
                    type="number"
                    className="cantidad-input"
                    min={1}
                    value={item.cantidad}
                    onChange={e =>
                      cambiarCantidad(item.codigo, parseInt(e.target.value) || 1)
                    }
                  />
                </td>
                <td>
                  <button
                    className="btn-quitar"
                    onClick={() => quitarDelPedido(item.codigo)}
                    title="Quitar"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pedido-totales">
          <div>
            Total de ítems: <strong>{items.length}</strong>
          </div>
          <div>
            Total de unidades: <strong>{totalUnidades}</strong>
          </div>
        </div>

        <div className="pedido-acciones">
          <button className="btn-primario" onClick={() => exportarPDF(items)}>
            📄 Descargar PDF
          </button>
          <button className="btn-secundario" onClick={() => exportarCSV(items)}>
            📊 Descargar CSV
          </button>
          <button
            className="btn-secundario"
            onClick={() => {
              if (confirm('¿Vaciar todo el pedido?')) vaciarPedido();
            }}
          >
            🗑 Vaciar pedido
          </button>
        </div>
      </main>
    </>
  );
}
