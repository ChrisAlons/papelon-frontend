import React, { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import type { Usuario } from "../types/Usuario";

// Tipos para formularios
type CreateUserForm = {
  username: string;
  password: string;
  rol: string;
};
type EditUserForm = Omit<CreateUserForm, "password">;

const emptyCreateForm: CreateUserForm = {
  username: "",
	password: "",
  rol: "",

};

const emptyEditForm: EditUserForm = {
  username: "",
  rol: "",
};

const UserTable: React.FC = () => {
  const {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    // deleteUser,
  } = useUserStore();

  const [createForm, setCreateForm] = useState<CreateUserForm>(emptyCreateForm);
  const [editForm, setEditForm] = useState<EditUserForm>(emptyEditForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState<"create" | "edit" | null>(null);

  // const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Crear usuario
  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addUser(createForm);
    setModalOpen(null);
    setCreateForm(emptyCreateForm);
  };

  // Editar usuario
  const openEditModal = (user: Usuario) => {
    setEditForm({
      username: user.username,
      rol: user.rol,
    });
    setEditId(user.id);
    setModalOpen("edit");
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      await updateUser(editId, editForm);
    }
    setModalOpen(null);
    setEditForm(emptyEditForm);
    setEditId(null);
  };

  // Eliminar usuario
  // const handleDelete = async () => {
  //   if (deleteId !== null) {
  //     await deleteUser(deleteId);
  //     setDeleteId(null);
  //   }
  // };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={() => setModalOpen("create")}>
          + Nuevo Usuario
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Creado</th>
              <th>Actualizado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.rol}</td>
                  <td>{user.createdAt && user.createdAt.substring(0, 19).replace("T", " ")}</td>
                  <td>{user.updatedAt && user.updatedAt.substring(0, 19).replace("T", " ")}</td>
                  <td>
                    <button
                      className="btn btn-xs btn-info mr-2"
                      onClick={() => openEditModal(user)}
                    >
                      Editar
                    </button>
                    {/* <button
                      className="btn btn-xs btn-error"
                      onClick={() => setDeleteId(user.id)}
                    >
                      Eliminar
                    </button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear usuario */}
      {modalOpen === "create" && (
        <dialog open className="modal modal-open">
          <form method="dialog" className="modal-box" onSubmit={handleCreateSubmit}>
            <h3 className="font-bold text-lg mb-4">Crear Usuario</h3>
            <div className="mb-2">
              <input
                type="text"
                name="username"
                className="input input-bordered w-full"
                placeholder="Usuario"
                value={createForm.username}
                onChange={handleCreateChange}
                required
              />
            </div>
            <div className="mb-2">
              <select
                name="rol"
                className="select select-bordered w-full"
                value={createForm.rol}
                onChange={handleCreateChange}
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="ADMIN">ADMIN</option>
                <option value="CAJERO">CAJERO</option>
              </select>
            </div>
            <div className="mb-2">
              <input
                type="password"
                name="password"
                className="input input-bordered w-full"
                placeholder="Contraseña"
                value={createForm.password}
                onChange={handleCreateChange}
                required
              />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Crear
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setModalOpen(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </dialog>
      )}

      {/* Modal para editar usuario */}
      {modalOpen === "edit" && (
        <dialog open className="modal modal-open">
          <form method="dialog" className="modal-box" onSubmit={handleEditSubmit}>
            <h3 className="font-bold text-lg mb-4">Editar Usuario</h3>
            <div className="mb-2">
              <input
                type="text"
                name="username"
                className="input input-bordered w-full"
                placeholder="Usuario"
                value={editForm.username}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="mb-2">
              <select
                name="rol"
                className="select select-bordered w-full"
                value={editForm.rol}
                onChange={handleEditChange}
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="ADMIN">ADMIN</option>
                <option value="CAJERO">CAJERO</option>
              </select>
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setModalOpen(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </dialog>
      )}

      {/* Modal de confirmación para eliminar */}
      {/* {deleteId !== null && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">¿Eliminar usuario?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDelete}>
                Eliminar
              </button>
              <button
                className="btn"
                onClick={() => setDeleteId(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </dialog>
      )} */}

      {loading && <span className="loading loading-spinner text-primary"></span>}
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default UserTable;
