export interface Producto {
  codigo: string;
  nombre: string;
  descripcion: string;
  familia: string;
  familiaNombre: string;
  subcategoria: string;
  subcategoriaNombre: string;
  marcas: string[];
  medidas: string[];
  foto: string | null;
  descontinuado: boolean;
}

export interface Subcategoria {
  slug: string;
  nombre: string;
  cantidad: number;
}

export interface Familia {
  slug: string;
  nombre: string;
  totalProductos: number;
  subcategorias: Subcategoria[];
}

export interface ItemPedido {
  codigo: string;
  nombre: string;
  cantidad: number;
}
