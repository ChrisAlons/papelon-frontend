import React, { useEffect, useState } from "react";
import { useCompraStore } from "../stores/compraStore";
import type { Compra } from "../types/Compra";
import { Link } from "react-router-dom";

const CompraTable: React.FC = () => {
  const { compras, loading, error, fetchCompras } = useCompraStore();
  const [detalleOpen, setDetalleOpen] = useState<Compra | null>(null);

  useEffect(() => {
    fetchCompras();
  }, [fetchCompras]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center mb-4">
        <Link to="/compras/nueva" className="btn btn-success">Nueva Compra</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {compras.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No hay compras registradas.
                </td>
              </tr>
            ) : (
              compras.map((compra) => (
                <tr key={compra.id}>
                  <td>{compra.id}</td>
                  <td>{compra.nombreUsuario || <span className="italic text-gray-400">Sin usuario</span>}</td>
                  <td>{compra.nombreProveedor || <span className="italic text-gray-400">Sin proveedor</span>}</td>
                  <td>{compra.fecha && compra.fecha.substring(0, 19).replace("T", " ")}</td>
                  <td>{compra.total}</td>
                  <td>
                    <button
                      className="btn btn-xs btn-info"
                      onClick={() => setDetalleOpen(compra)}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalle */}
      {detalleOpen !== null && (
          <dialog open className="modal modal-open" onClick={() => setDetalleOpen(null)}>
            <div className="modal-box max-w-lg p-6" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg mb-4">
                Detalle de compra #{detalleOpen.id}
              </h3>
              <table className="table table-sm w-full mb-4">
                <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(detalleOpen.detalles) && detalleOpen.detalles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No hay detalles.
                      </td>
                    </tr>
                ) : (
                    detalleOpen.detalles.map((detalle) => (
                        <tr key={detalle.id}>
                          <td>{detalle.nombreProducto}</td>
                          <td>{detalle.cantidad}</td>
                          <td>{detalle.precioUnitario}</td>
                          <td>{(detalle.cantidad * detalle.precioUnitario).toFixed(2)}</td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
              {/* Monto total */}
              <div className="text-right font-bold text-lg mt-4">
                Total: {detalleOpen.detalles.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario), 0).toFixed(2)}
              </div>
              <div className="flex justify-center mt-4">
                <button
                    className="btn btn-error rounded-full"
                    onClick={() => setDetalleOpen(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </dialog>
      )}

      {loading && <span className="loading loading-spinner text-primary"></span>}
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default CompraTable;
