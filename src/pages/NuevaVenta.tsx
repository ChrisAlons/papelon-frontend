// src/pages/NuevaVenta.tsx
import React, { useEffect, useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { useClienteStore } from '../stores/clienteStore';
import { useProductStore } from '../stores/productStore';
import { useVentaStore } from '../stores/ventaStore';
import type { VentaRequest, DetalleVentaRequest } from '../types/VentaRequest';
import { useNavigate } from 'react-router-dom';

const NuevaVenta: React.FC = () => {
  const { users, fetchUsers, currentUser } = useUserStore();
  const { clientes, fetchClientes } = useClienteStore();
  const { products, fetchProducts } = useProductStore();
  const { createVenta, loading: loadingVenta, error: errorVenta } = useVentaStore();
  const navigate = useNavigate();

  const [usuarioId, setUsuarioId] = useState<number | ''>('');
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [items, setItems] = useState<DetalleVentaRequest[]>([
    { productoId: 0, cantidad: 1, precioUnitario: 0 },
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchClientes();
    fetchProducts();
    // Si el usuario es cajero, setear usuarioId automáticamente
    if (currentUser && currentUser.rol === 'CAJERO') {
      setUsuarioId(currentUser.id);
    }
  }, []);

  const handleItemChange = (
    idx: number,
    field: keyof DetalleVentaRequest,
    value: string
  ) => {
    const list = [...items];
    if (field === 'productoId') {
      const id = parseInt(value, 10) || 0;
      list[idx].productoId = id;
      const prod = products.find(p => p.id === id);
      list[idx].precioUnitario = prod ? prod.precioVenta : 0;
    } else if (field === 'cantidad') {
      list[idx].cantidad = parseInt(value, 10) || 0;
    } else if (field === 'precioUnitario') {
      list[idx].precioUnitario = parseFloat(value) || 0;
    }
    setItems(list);
  };

  const addItem = () => {
    setItems([...items, { productoId: 0, cantidad: 1, precioUnitario: 0 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const subtotal = (item: DetalleVentaRequest) => item.cantidad * item.precioUnitario;
  const total = items.reduce((sum, it) => sum + subtotal(it), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId || items.length === 0) {
      setFormError('Selecciona un usuario y agrega al menos un producto');
      return;
    }
    const payload: VentaRequest = {
      usuarioId: Number(usuarioId),
      detalles: items.filter(it => it.productoId > 0),
    };
    if (clienteId) payload.clienteId = Number(clienteId);
    try {
      await createVenta(payload);
      navigate('/ventas');
    } catch {
      // errorVenta shown
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registrar Nueva Venta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Usuario</label>
          {currentUser && currentUser.rol === 'CAJERO' ? (
            <input
              type="text"
              className="input input-bordered w-full bg-gray-100"
              value={currentUser.username + ' (CAJERO)'}
              disabled
            />
          ) : (
            <select
              className="select select-bordered w-full"
              value={usuarioId}
              onChange={e => setUsuarioId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Selecciona usuario</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username}</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block font-medium">Cliente (opcional)</label>
          <select
            className="select select-bordered w-full"
            value={clienteId}
            onChange={e => setClienteId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">--</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2">Productos</label>
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-sm">Producto</label>
                  <select
                    className="select select-bordered w-full"
                    value={item.productoId}
                    onChange={e => handleItemChange(idx, 'productoId', e.target.value)}
                  >
                    <option value={0}>--</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    className="input input-bordered w-20"
                    value={item.cantidad}
                    onChange={e => handleItemChange(idx, 'cantidad', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm">Precio Venta</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-24"
                    value={item.precioUnitario}
                    onChange={e => handleItemChange(idx, 'precioUnitario', e.target.value)}
                  />
                </div>
                <div>
                  <button type="button" className="btn btn-error btn-sm" onClick={() => removeItem(idx)}>
                    ✕
                  </button>
                </div>
                <div className="flex-1 text-right text-sm">
                  Subtotal: {subtotal(item).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-secondary btn-sm mt-2" onClick={addItem}>
            + Agregar producto
          </button>
        </div>
        <div className="text-right font-bold text-lg">Total: {total.toFixed(2)}</div>
        {(formError || errorVenta) && <div className="alert alert-error">{formError || errorVenta}</div>}
        <div className="text-right">
          <button type="submit" className="btn btn-primary" disabled={loadingVenta}>
            {loadingVenta ? 'Guardando...' : 'Registrar Venta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevaVenta;

