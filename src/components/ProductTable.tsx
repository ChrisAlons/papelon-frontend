import React, { useEffect, useState } from "react";
import { useProductStore } from "../stores/productStore";
import type { Producto } from "../types/Producto";

// Tipos para formularios
type CreateProductForm = {
  nombre: string;
  descripcion: string;
  precioCompra: number;
  precioVenta: number;
};
type EditProductForm = CreateProductForm;

const emptyCreateForm: CreateProductForm = {
  nombre: "",
  descripcion: "",
  precioCompra: 0,
  precioVenta: 0,
};

const emptyEditForm: EditProductForm = {
  nombre: "",
  descripcion: "",
  precioCompra: 0,
  precioVenta: 0,
};

const ProductTable: React.FC = () => {
  const {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
  } = useProductStore();

  const [createForm, setCreateForm] = useState<CreateProductForm>(emptyCreateForm);
  const [editForm, setEditForm] = useState<EditProductForm>(emptyEditForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<"create" | "edit" | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Crear producto
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProduct(createForm);
    setModalOpen(null);
    setCreateForm(emptyCreateForm);
  };

  // Editar producto
  const openEditModal = (product: Producto) => {
    setEditForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precioCompra: product.precioCompra,
      precioVenta: product.precioVenta,
    });
    setEditId(product.id);
    setModalOpen("edit");
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      await updateProduct(editId, editForm);
    }
    setModalOpen(null);
    setEditForm(emptyEditForm);
    setEditId(null);
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-center mb-4">
        <button className="btn btn-success" onClick={() => setModalOpen("create")}>
          + Nuevo Producto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Compra</th>
              <th>Venta</th>
              <th>Creado</th>
              <th>Actualizado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.nombre}</td>
                  <td>{product.descripcion}</td>
                  <td>{product.precioCompra}</td>
                  <td>{product.precioVenta}</td>
                  <td>{product.createdAt && product.createdAt.substring(0, 19).replace("T", " ")}</td>
                  <td>{product.updatedAt && product.updatedAt.substring(0, 19).replace("T", " ")}</td>
                  <td>
                    <button
                      className="btn btn-xs btn-info mr-2"
                      onClick={() => openEditModal(product)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear producto */}
      {modalOpen === "create" && (
        <dialog open className="modal modal-open text-start">
          <form method="dialog" className="modal-box max-w-sm" onSubmit={handleCreateSubmit}>
            <h3 className="font-bold text-lg mb-4">Crear Producto</h3>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="input input-bordered w-full"
                placeholder="Nombre"
                value={createForm.nombre}
                onChange={handleCreateChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                className="textarea textarea-bordered w-full"
                placeholder="Descripción"
                value={createForm.descripcion}
                onChange={handleCreateChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">Precio de compra</label>
              <input
                type="number"
                step="0.01"
                name="precioCompra"
                className="input input-bordered w-full"
                placeholder="Precio de compra"
                value={createForm.precioCompra}
                onChange={handleCreateChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">Precio de venta</label>
              <input
                type="number"
                step="0.01"
                name="precioVenta"
                className="input input-bordered w-full"
                placeholder="Precio de venta"
                value={createForm.precioVenta}
                onChange={handleCreateChange}
                required
              />
            </div>
            <div className="modal-action justify-center">
              <button type="submit" className="btn btn-success rounded-full">
                Crear
              </button>
              <button
                type="button"
                className="btn btn-error rounded-full"
                onClick={() => setModalOpen(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </dialog>
      )}

      {/* Modal para editar producto */}
      {modalOpen === "edit" && (
        <dialog open className="modal modal-open text-start">
          <form method="dialog" className="modal-box max-w-sm" onSubmit={handleEditSubmit}>
            <h3 className="font-bold text-lg mb-4">Editar Producto</h3>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="input input-bordered w-full"
                placeholder="Nombre"
                value={editForm.nombre}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                className="textarea textarea-bordered w-full"
                placeholder="Descripción"
                value={editForm.descripcion}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">Precio de compra</label>
              <input
                type="number"
                step="0.01"
                name="precioCompra"
                className="input input-bordered w-full"
                placeholder="Precio de compra"
                value={editForm.precioCompra}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium text-gray-700">Precio de venta</label>
              <input
                type="number"
                step="0.01"
                name="precioVenta"
                className="input input-bordered w-full"
                placeholder="Precio de venta"
                value={editForm.precioVenta}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="modal-action justify-center">
              <button type="submit" className="btn btn-success rounded-full">
                Actualizar
              </button>
              <button
                type="button"
                className="btn btn-error rounded-full"
                onClick={() => setModalOpen(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </dialog>
      )}

      {loading && <span className="loading loading-spinner text-primary"></span>}
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default ProductTable;
