'use client';

import { ItemPedido } from '@/types';

const STORAGE_KEY = 'logbelts-pedido';

export function obtenerPedido(): ItemPedido[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function guardarPedido(items: ItemPedido[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('pedido-actualizado'));
}

export function agregarAlPedido(codigo: string, nombre: string, cantidad = 1) {
  const items = obtenerPedido();
  const idx = items.findIndex(i => i.codigo === codigo);
  if (idx >= 0) {
    items[idx].cantidad += cantidad;
  } else {
    items.push({ codigo, nombre, cantidad });
  }
  guardarPedido(items);
}

export function quitarDelPedido(codigo: string) {
  const items = obtenerPedido().filter(i => i.codigo !== codigo);
  guardarPedido(items);
}

export function cambiarCantidad(codigo: string, cantidad: number) {
  const items = obtenerPedido();
  const idx = items.findIndex(i => i.codigo === codigo);
  if (idx >= 0) {
    if (cantidad <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].cantidad = cantidad;
    }
    guardarPedido(items);
  }
}

export function vaciarPedido() {
  guardarPedido([]);
}

export function totalItems(items: ItemPedido[]): number {
  return items.reduce((s, i) => s + i.cantidad, 0);
}
