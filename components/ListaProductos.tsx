'use client';

import { useState, useMemo } from 'react';
import { Producto } from '@/types';
import ProductoRow from './ProductoRow';
import FiltrosProductos from './FiltrosProductos';

export default function ListaProductos({ productos }: { productos: Producto[] }) {
  const [soloConFoto, setSoloConFoto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const filtrados = useMemo(() => {
    let lista = productos;
    if (soloConFoto) lista = lista.filter(p => !!p.foto);
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      lista = lista.filter(
        p =>
          p.codigo.toLowerCase().includes(q) ||
          p.nombre.toLowerCase().includes(q)
      );
    }
    return lista;
  }, [productos, soloConFoto, busqueda]);

  return (
    <>
      <FiltrosProductos
        total={productos.length}
        filtrados={filtrados.length}
        soloConFoto={soloConFoto}
        setSoloConFoto={setSoloConFoto}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />

      {filtrados.length === 0 ? (
        <p style={{ padding: 40, textAlign: 'center', color: 'var(--text-dim)' }}>
          No hay productos que coincidan.
        </p>
      ) : (
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Código</th>
              <th>Nombre</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map(p => (
              <ProductoRow key={p.codigo} producto={p} />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
