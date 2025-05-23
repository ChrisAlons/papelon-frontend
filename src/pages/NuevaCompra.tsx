// src/pages/NuevaCompra.tsx
import React, { useEffect, useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { useProveedorStore } from '../stores/proveedorStore';
import { useProductStore } from '../stores/productStore';
import { useCompraStore } from '../stores/compraStore';
import type { Producto } from '../types/Producto';
import type { CompraRequest, DetalleCompraRequest } from '../types/CompraRequest';
import { useNavigate } from 'react-router-dom';

const NuevaCompra: React.FC = () => {
  const { users, fetchUsers } = useUserStore();
  const { proveedores, fetchProveedores } = useProveedorStore();
  const { products, fetchProducts } = useProductStore();
  const { createCompra, loading: loadingCompra, error: errorCompra } = useCompraStore();
  const navigate = useNavigate();

  const [usuarioId, setUsuarioId] = useState<number | ''>('');
  const [proveedorId, setProveedorId] = useState<number | ''>('');
  const [items, setItems] = useState<DetalleCompraRequest[]>([
    { productoId: 0, cantidad: 1, precioUnitario: 0 },
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchProveedores();
    fetchProducts();
  }, []);

  const handleItemChange = (
    index: number,
    field: keyof DetalleCompraRequest,
    value: string
  ) => {
    const list = [...items];
    if (field === 'productoId') {
      const id = parseInt(value, 10) || 0;
      list[index].productoId = id;
      const prod = products.find((p) => p.id === id);
      list[index].precioUnitario = prod ? prod.precioCompra : 0;
    } else if (field === 'cantidad') {
      list[index].cantidad = parseInt(value, 10) || 0;
    } else if (field === 'precioUnitario') {
      list[index].precioUnitario = parseFloat(value) || 0;
    }
    setItems(list);
  };

  const addItem = () => {
    setItems([...items, { productoId: 0, cantidad: 1, precioUnitario: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = (item: DetalleCompraRequest) =>
    item.cantidad * item.precioUnitario;
  const total = items.reduce((sum, item) => sum + subtotal(item), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId || !proveedorId || items.length === 0) {
      setFormError('Completa todos los campos y agrega al menos un producto');
      return;
    }
    const payload: CompraRequest = {
      usuarioId: Number(usuarioId),
      proveedorId: Number(proveedorId),
      detalles: items.filter((it) => it.productoId > 0),
    };
    try {
      await createCompra(payload);
      navigate('/compras');
    } catch {
      /* errorCompra ya seteado */
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registrar Nueva Compra</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Usuario</label>
          <select
            className="select select-bordered w-full"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Selecciona usuario</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium">Proveedor</label>
          <select
            className="select select-bordered w-full"
            value={proveedorId}
            onChange={(e) => setProveedorId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Selecciona proveedor</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
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
                    onChange={(e) => handleItemChange(idx, 'productoId', e.target.value)}
                  >
                    <option value={0}>--</option>
                    {products.map((p: Producto) => (
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
                    onChange={(e) => handleItemChange(idx, 'cantidad', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered w-24"
                    value={item.precioUnitario}
                    onChange={(e) => handleItemChange(idx, 'precioUnitario', e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-error btn-sm"
                    onClick={() => removeItem(idx)}
                  >
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

        <div className="text-right font-bold text-lg">
          Total: {total.toFixed(2)}
        </div>

        {(formError || errorCompra) && (
          <div className="alert alert-error">
            {formError || errorCompra}
          </div>
        )}

        <div className="text-right">
          <button type="submit" className="btn btn-primary" disabled={loadingCompra}>
            {loadingCompra ? 'Guardando...' : 'Registrar Compra'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevaCompra;

