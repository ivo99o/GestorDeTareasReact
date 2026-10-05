import FormularioTarea from './FormularioTarea'
import './Sidebar.css'

function Sidebar({ abierta, onAbrir, onCerrar, tareaEnEdicion, onGuardar }) {
  return (
    <>
      {!abierta && (
        <button
          type="button"
          className="fab-agregar"
          aria-label="Agregar tarea"
          onClick={onAbrir}
        >
          +
        </button>
      )}

      <aside className={`sidebar d-flex flex-column align-items-center py-4 px-3 ${abierta ? 'abierta' : ''}`}>
        <div className="sidebar-titulo">
          <h2>Agregar Tarea</h2>
          <button
            type="button"
            className="btn-cerrar-form"
            aria-label="Cerrar formulario"
            onClick={onCerrar}
          >
            &times;
          </button>
        </div>

        <FormularioTarea tareaEnEdicion={tareaEnEdicion} onGuardar={onGuardar} />
      </aside>
    </>
  )
}

export default Sidebar
