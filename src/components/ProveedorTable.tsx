// src/components/ProveedorTable.tsx
import React, { useEffect, useState } from 'react';
import { useProveedorStore } from '../stores/proveedorStore';
import type { Proveedor } from '../types/Proveedor';

// Form types
interface CreateProveedorForm {
  nombre: string;
  telefono: string;
  direccion: string;
}
interface EditProveedorForm extends CreateProveedorForm {}

const emptyCreateForm: CreateProveedorForm = { nombre: '', telefono: '', direccion: '' };
const emptyEditForm: EditProveedorForm = { nombre: '', telefono: '', direccion: '' };

const ProveedorTable: React.FC = () => {
  const { proveedores, loading, error, fetchProveedores, addProveedor, updateProveedor } = useProveedorStore();

  const [createForm, setCreateForm] = useState<CreateProveedorForm>(emptyCreateForm);
  const [editForm, setEditForm] = useState<EditProveedorForm>(emptyEditForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<'create' | 'edit' | null>(null);

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProveedor(createForm);
    setModalOpen(null);
    setCreateForm(emptyCreateForm);
  };

  const openEditModal = (prov: Proveedor) => {
    setEditForm({ nombre: prov.nombre, telefono: prov.telefono, direccion: prov.direccion });
    setEditId(prov.id);
    setModalOpen('edit');
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) await updateProveedor(editId, editForm);
    setModalOpen(null);
    setEditForm(emptyEditForm);
    setEditId(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-center mb-4">
        <button className="btn btn-success" onClick={() => setModalOpen('create')}>
          + Nuevo Proveedor
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Creado</th>
              <th>Actualizado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">No hay proveedores.</td>
              </tr>
            ) : (
              proveedores.map((prov) => (
                <tr key={prov.id}>
                  <td>{prov.id}</td>
                  <td>{prov.nombre}</td>
                  <td>{prov.telefono}</td>
                  <td>{prov.direccion}</td>
                  <td>{prov.createdAt?.substring(0,19).replace('T',' ')}</td>
                  <td>{prov.updatedAt?.substring(0,19).replace('T',' ')}</td>
                  <td>
                    <button className="btn btn-xs btn-info mr-2" onClick={() => openEditModal(prov)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Create */}
      {modalOpen === 'create' && (
        <dialog open className="modal modal-open">
          <form method="dialog" className="modal-box max-w-sm text-start" onSubmit={handleCreateSubmit}>
            <h3 className="font-bold text-lg mb-4">Crear Proveedor</h3>
            {['nombre','telefono','direccion'].map((field) => (
              <div className="mb-2" key={field}>
                <label className="block text-sm mb-1">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                <input type="text" name={field} className="input input-bordered w-full" value={(createForm as any)[field]} onChange={handleCreateChange} required />
              </div>
            ))}
            <div className="modal-action justify-center">
              <button type="submit" className="btn btn-success rounded-full">Crear</button>
              <button type="button" className="btn btn-error rounded-full" onClick={() => setModalOpen(null)}>Cancelar</button>
            </div>
          </form>
        </dialog>
      )}

      {/* Modal Edit */}
      {modalOpen === 'edit' && (
        <dialog open className="modal modal-open">
          <form method="dialog" className="modal-box max-w-sm text-start" onSubmit={handleEditSubmit}>
            <h3 className="font-bold text-lg mb-4">Editar Proveedor</h3>
            {['nombre','telefono','direccion'].map((field) => (
              <div className="mb-2" key={field}>
                <label className="block text-sm mb-1">{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                <input type="text" name={field} className="input input-bordered w-full" value={(editForm as any)[field]} onChange={handleEditChange} required />
              </div>
            ))}
            <div className="modal-action justify-center">
              <button type="submit" className="btn btn-info rounded-full">Guardar</button>
              <button type="button" className="btn btn-error rounded-full" onClick={() => setModalOpen(null)}>Cancelar</button>
            </div>
          </form>
        </dialog>
      )}

      {loading && <span className="loading loading-spinner text-primary"></span>}
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default ProveedorTable;

