// src/types/CompraRequest.ts
export interface DetalleCompraRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CompraRequest {
  usuarioId: number;
  proveedorId: number;
  detalles: DetalleCompraRequest[];
}
