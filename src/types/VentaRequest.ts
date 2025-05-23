// src/types/VentaRequest.ts
export interface DetalleVentaRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface VentaRequest {
  usuarioId: number;
  clienteId?: number;
  detalles: DetalleVentaRequest[];
}
