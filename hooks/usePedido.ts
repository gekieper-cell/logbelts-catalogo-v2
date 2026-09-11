'use client';

import { useEffect, useState } from 'react';
import { ItemPedido } from '@/types';
import { obtenerPedido } from '@/lib/carrito';

export function usePedido() {
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    setItems(obtenerPedido());
    setCargado(true);

    const handler = () => setItems(obtenerPedido());
    window.addEventListener('pedido-actualizado', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('pedido-actualizado', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return { items, cargado };
}
