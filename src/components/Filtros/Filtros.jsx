import { NOMBRES_CATEGORIA } from '../../utils/tareas'
import './Filtros.css'

function Filtros({ filtroCategoriaActivo, soloPendientes, onCambiarCategoria, onAlternarPendientes }) {
  return (
    <div className="filtros d-flex flex-wrap justify-content-center gap-2 mb-4" aria-label="Filtrar tareas por categoría y estado">
      <button
        type="button"
        className={`btn ${filtroCategoriaActivo === 'todos' ? 'btn-dark' : 'btn-outline-dark'}`}
        onClick={() => onCambiarCategoria('todos')}
      >
        Todos
      </button>

      {Object.entries(NOMBRES_CATEGORIA).map(([valor, nombre]) => (
        <button
          key={valor}
          type="button"
          className={`btn ${filtroCategoriaActivo === valor ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => onCambiarCategoria(valor)}
        >
          {nombre}
        </button>
      ))}

      <button
        type="button"
        className={`btn ${soloPendientes ? 'btn-dark' : 'btn-outline-dark'}`}
        aria-pressed={soloPendientes}
        onClick={onAlternarPendientes}
      >
        Pendiente
      </button>
    </div>
  )
}

export default Filtros
