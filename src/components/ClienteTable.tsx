// src/components/ClienteTable.tsx
import React, { useEffect, useState } from 'react';
import { useClienteStore } from '../stores/clienteStore';
import type { Cliente } from '../types/Cliente';

interface CreateClienteForm {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}
interface EditClienteForm extends CreateClienteForm {}

const emptyCreateForm: CreateClienteForm = { nombre: '', email: '', telefono: '', direccion: '' };
const emptyEditForm: EditClienteForm = { nombre: '', email: '', telefono: '', direccion: '' };

const ClienteTable: React.FC = () => {
  const { clientes, loading, error, fetchClientes, addCliente, updateCliente } = useClienteStore();
  const [createForm, setCreateForm] = useState<CreateClienteForm>(emptyCreateForm);
  const [editForm, setEditForm] = useState<EditClienteForm>(emptyEditForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<'create' | 'edit' | null>(null);

  useEffect(() => { fetchClientes(); }, [fetchClientes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (modalOpen === 'create') setCreateForm({ ...createForm, [name]: value });
    else setEditForm({ ...editForm, [name]: value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCliente(createForm);
    setModalOpen(null);
    setCreateForm(emptyCreateForm);
  };

  const openEdit = (cli: Cliente) => {
    setEditId(cli.id);
    setEditForm({ nombre: cli.nombre, email: cli.email||'', telefono: cli.telefono||'', direccion: cli.direccion||'' });
    setModalOpen('edit');
  };
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) await updateCliente(editId, editForm);
    setModalOpen(null);
    setEditForm(emptyEditForm);
    setEditId(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center mb-4">
        <button className="btn btn-success" onClick={() => setModalOpen('create')}>
          + Nuevo Cliente
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead><tr>
            <th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Dirección</th><th>Creado</th><th>Actualizado</th><th>Acciones</th>
          </tr></thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr><td colSpan={8} className="text-center">No hay clientes.</td></tr>
            ) : clientes.map(cli => (
              <tr key={cli.id}>
                <td>{cli.id}</td><td>{cli.nombre}</td>
                <td>{cli.email}</td><td>{cli.telefono}</td><td>{cli.direccion}</td>
                <td>{cli.createdAt.substring(0,19).replace('T',' ')}</td>
                <td>{cli.updatedAt.substring(0,19).replace('T',' ')}</td>
                <td>
                  <button className="btn btn-xs btn-info mr-2" onClick={() => openEdit(cli)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen === 'create' && (
        <dialog open className="modal modal-open">
          <form className="modal-box max-w-sm" onSubmit={handleCreate} method="dialog">
            <h3 className="font-bold text-lg mb-4">Crear Cliente</h3>
            {['nombre','email','telefono','direccion'].map(f => (
              <div className="mb-2" key={f}>
                <label className="block text-sm mb-1">{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                <input type="text" name={f} className="input input-bordered w-full" value={(createForm as any)[f]} onChange={handleChange} />
              </div>
            ))}
            <div className="modal-action justify-center">
              <button type="submit" className="btn btn-success rounded-full">Crear</button>
              <button type="button" className="btn btn-error rounded-full" onClick={() => setModalOpen(null)}>Cancelar</button>
            </div>
          </form>
        </dialog>
      )}

      {modalOpen === 'edit' && (
        <dialog open className="modal modal-open">
          <form className="modal-box max-w-sm" onSubmit={handleEdit} method="dialog">
            <h3 className="font-bold text-lg mb-4">Editar Cliente</h3>
            {['nombre','email','telefono','direccion'].map(f => (
              <div className="mb-2" key={f}>
                <label className="block text-sm mb-1">{f.charAt(0).toUpperCase()+f.slice(1)}</label>
                <input type="text" name={f} className="input input-bordered w-full" value={(editForm as any)[f]} onChange={handleChange} />
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

export default ClienteTable;

