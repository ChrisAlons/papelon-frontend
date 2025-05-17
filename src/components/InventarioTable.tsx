import React, { useEffect, useState } from "react";
import { useInventarioStore } from "../stores/inventarioStore";

type Orden = "asc" | "desc";
type Columna = "productoId" | "nombreProducto" | "stockActual";

const InventarioTable: React.FC = () => {
  const { inventarios, loading, error, fetchInventario } = useInventarioStore();

  const [columna, setColumna] = useState<Columna>("nombreProducto");
  const [orden, setOrden] = useState<Orden>("asc");
  const [filtroNombre, setFiltroNombre] = useState<string>("");

  useEffect(() => {
    fetchInventario();
  }, [fetchInventario]);

  // Filtra los inventarios por nombreProducto
  const inventariosFiltrados = inventarios.filter(inv =>
    inv.nombreProducto.toLowerCase().includes(filtroNombre.toLowerCase())
  );

  // Ordena los filtrados
  const inventariosOrdenados = [...inventariosFiltrados].sort((a, b) => {
    let valorA = a[columna];
    let valorB = b[columna];
    if (columna === "nombreProducto") {
      valorA = String(valorA).toLowerCase();
      valorB = String(valorB).toLowerCase();
      return orden === "asc"
        ? (valorA as string).localeCompare(valorB as string, "es", { sensitivity: "base" })
        : (valorB as string).localeCompare(valorA as string, "es", { sensitivity: "base" });
    } else {
      return orden === "asc"
        ? Number(valorA) - Number(valorB)
        : Number(valorB) - Number(valorA);
    }
  });

  const flecha = (col: Columna) =>
    columna === col ? (orden === "asc" ? "▲" : "▼") : "↕";

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Inventario</h2>
      {/* Input para filtrar por nombre */}
      <div className="mb-4">
        <input
          type="text"
          className="input input-bordered input-info w-full max-w-xs"
          placeholder="Filtrar por nombre de producto..."
          value={filtroNombre}
          onChange={e => setFiltroNombre(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full min-w-[800px]"> {/* Agrega min-w-[800px] */}
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  className="flex items-center gap-1 hover:underline"
                  onClick={() => {
                    setColumna("productoId");
                    setOrden(columna === "productoId" && orden === "asc" ? "desc" : "asc");
                  }}
                >
                  ID Producto <span className="text-xs">{flecha("productoId")}</span>
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="flex items-center gap-1 hover:underline"
                  onClick={() => {
                    setColumna("nombreProducto");
                    setOrden(columna === "nombreProducto" && orden === "asc" ? "desc" : "asc");
                  }}
                >
                  Nombre Producto <span className="text-xs">{flecha("nombreProducto")}</span>
                </button>
              </th>
              <th>
                <button
                  type="button"
                  className="flex items-center gap-1 hover:underline"
                  onClick={() => {
                    setColumna("stockActual");
                    setOrden(columna === "stockActual" && orden === "asc" ? "desc" : "asc");
                  }}
                >
                  Stock actual <span className="text-xs">{flecha("stockActual")}</span>
                </button>
              </th>
              <th>Última actualización</th>
            </tr>
          </thead>
          <tbody>
            {inventariosOrdenados.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No hay productos coincidentes.
                </td>
              </tr>
            ) : (
              inventariosOrdenados.map((inv) => (
                <tr key={inv.productoId}>
                  <td>{inv.productoId}</td>
                  <td>{inv.nombreProducto}</td>
                  <td>{inv.stockActual}</td>
                  <td>{inv.updatedAt && inv.updatedAt.substring(0, 19).replace("T", " ")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {loading && <span className="loading loading-spinner text-primary"></span>}
      {error && <div className="alert alert-error mt-4">{error}</div>}
    </div>
  );
};

export default InventarioTable;
