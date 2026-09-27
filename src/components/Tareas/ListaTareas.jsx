import TarjetaTarea from './TarjetaTarea'
import './Tareas.css'

function ListaTareas({ tareas, onEditar, onEliminar }) {
  if (tareas.length === 0) {
    return (
      <p className="text-center text-muted mb-0">No hay tareas que coincidan con estos filtros.</p>
    )
  }

  return (
    <div className="lista-tareas" aria-label="Listado de tareas">
      {tareas.map((tarea) => (
        <TarjetaTarea key={tarea.id} tarea={tarea} onEditar={onEditar} onEliminar={onEliminar} />
      ))}
    </div>
  )
}

export default ListaTareas
