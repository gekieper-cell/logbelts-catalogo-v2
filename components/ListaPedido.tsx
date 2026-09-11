'use client';

import Link from 'next/link';
import { usePedido } from '@/hooks/usePedido';
import { totalItems } from '@/lib/carrito';

export default function ListaPedido() {
  const { items, cargado } = usePedido();
  const total = totalItems(items);

  if (!cargado) {
    return <Link href="/pedido" className="pedido-btn">Pedido</Link>;
  }

  return (
    <Link href="/pedido" className="pedido-btn">
      Pedido
      {total > 0 && <span className="pedido-badge">{total}</span>}
    </Link>
  );
}
