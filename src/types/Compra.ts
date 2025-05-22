export interface DetalleCompra {
  id: number;
  compraId: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  createdAt: string | null;
}

export interface Compra {
  id: number;
  usuarioId: number;
  nombreUsuario: string;
  proveedorId: number;
  nombreProveedor: string;
  fecha: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  detalles: DetalleCompra[];
}
