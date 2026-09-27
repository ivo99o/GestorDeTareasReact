import { NOMBRES_CATEGORIA, calcularEstado } from '../../utils/tareas'
import BotonEditar from './BotonEditar'
import BotonEliminar from './BotonEliminar'

function TarjetaTarea({ tarea, onEditar, onEliminar }) {
  const estado = calcularEstado(tarea.fechaObjetivo)

  const fechaLegible = tarea.fechaObjetivo.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  function manejarEliminar() {
    const confirmado = confirm('¿Seguro que querés eliminar esta tarea?')
    if (!confirmado) return

    onEliminar(tarea.id)
  }

  return (
    <div className={`tarea card shadow-sm ${estado.clase}`}>
      <div className="card-body text-center d-flex flex-column">
        <h3 className="tarea-titulo card-title h5 mb-2">{tarea.titulo}</h3>
        <div className="tarea-info text-start">
          <p className="tarea-categoria card-text small mb-1">
            🏷️ Categoría: <strong>{NOMBRES_CATEGORIA[tarea.categoria] || tarea.categoria}</strong>
          </p>
          <p className="tarea-fecha card-text small mb-1">📅 Fecha objetivo: {fechaLegible}</p>
          <p className="tarea-estado card-text small mb-0">
            {estado.icono} Estado: <strong>{estado.texto}</strong>
          </p>
        </div>
        <div className="tarea-acciones d-flex justify-content-center gap-2 mt-auto">
          <BotonEliminar onClick={manejarEliminar} />
          <BotonEditar onClick={() => onEditar(tarea.id)} />
        </div>
      </div>
    </div>
  )
}

export default TarjetaTarea
