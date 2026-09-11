'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Producto } from '@/types';
import { agregarAlPedido } from '@/lib/carrito';

export default function ProductoRow({ producto }: { producto: Producto }) {
  const [agregado, setAgregado] = useState(false);
  const tieneFoto = !!producto.foto;

  function agregar() {
    agregarAlPedido(producto.codigo, producto.nombre);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  }

  return (
    <tr>
      <td>
        {tieneFoto ? (
          <Image
            className="foto"
            src={`/imagenes/${producto.foto}`}
            alt={producto.nombre}
            width={60}
            height={60}
            loading="lazy"
            unoptimized
          />
        ) : (
          <div className="sin-foto">sin foto</div>
        )}
      </td>
      <td className="codigo">{producto.codigo}</td>
      <td>{producto.nombre}</td>
      <td>
        <button
          className={`btn-agregar ${agregado ? 'agregado' : ''}`}
          onClick={agregar}
        >
          {agregado ? '✓ Agregado' : '+ Agregar'}
        </button>
      </td>
    </tr>
  );
}
