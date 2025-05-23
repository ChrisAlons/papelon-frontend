// src/types/Venta.ts
export interface DetalleVenta {
  id: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  createdAt: string;
}

export interface Venta {
  id: number;
  usuarioId: number;
  clienteId: number | null;
  fecha: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  detalles: DetalleVenta[];
}
