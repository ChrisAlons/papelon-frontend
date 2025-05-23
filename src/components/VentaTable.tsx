// src/components/VentaTable.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVentaStore } from '../stores/ventaStore';
import { useUserStore } from '../stores/userStore';
import { useClienteStore } from '../stores/clienteStore';
import { useProductStore } from '../stores/productStore';
import type { Venta } from '../types/Venta';

const VentaTable: React.FC = () => {
  const { ventas, loading, error, fetchVentas } = useVentaStore();
  const { users, fetchUsers } = useUserStore();
  const { clientes, fetchClientes } = useClienteStore();
  const { products, fetchProducts } = useProductStore();
  const [detalleOpen, setDetalleOpen] = useState<Venta | null>(null);

  useEffect(() => {
    fetchVentas();
    fetchUsers();
    fetchClientes();
    fetchProducts();
  }, [fetchVentas, fetchUsers, fetchClientes, fetchProducts]);

  const formatDate = (dt: string) => dt.substring(0, 19).replace('T', ' ');

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center items-center mb-4">
        <Link to="/ventas/nueva" className="btn btn-success">+ Nueva Venta</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">No hay ventas registradas.</td>
              </tr>
            ) : (
              ventas.map(v => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{users.find(u=>u.id===v.usuarioId)?.username || v.usuarioId}</td>
                  {v.clienteId ? (
                    <td>{clientes.find(c=>c.id===v.clienteId)?.nombre || v.clienteId}</td>
                  ) : <td><span className="italic text-gray-400">Sin cliente</span></td>}
                  <td>{formatDate(v.fecha)}</td>
                  <td>{v.total}</td>
                  <td>
                    <button className="btn btn-xs btn-info" onClick={() => setDetalleOpen(v)}>
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {detalleOpen && (
        <dialog open className="modal modal-open" onClick={() => setDetalleOpen(null)}>
          <div className="modal-box p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4">Detalle de venta #{detalleOpen.id}</h3>
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
                {detalleOpen.detalles.length === 0 ? (
                  <tr><td colSpan={4} className="text-center">Sin detalles.</td></tr>
                ) : detalleOpen.detalles.map(d => (
                  <tr key={d.id}>
                    <td>{products.find(p=>p.id===d.productoId)?.nombre || d.productoId}</td>
                    <td>{d.cantidad}</td>
                    <td>{d.precioUnitario}</td>
                    <td>{(d.cantidad * d.precioUnitario).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center">
              <button className="btn btn-error rounded-full" onClick={() => setDetalleOpen(null)}>Cerrar</button>
            </div>
          </div>
        </dialog>
      )}

      {loading && <span className="loading loading-spinner text-primary"></span>}
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default VentaTable;

