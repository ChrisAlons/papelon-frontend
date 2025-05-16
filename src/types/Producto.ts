// src/types/Producto.ts
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
  createdAt: string;
  updatedAt: string;
}

// Tipo auxiliar para crear/editar productos (sin campos autogenerados)
export type ProductoCrear = Omit<Producto, "id" | "createdAt" | "updatedAt">;
