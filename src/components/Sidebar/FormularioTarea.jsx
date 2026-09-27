import { useEffect, useState } from 'react'
import { NOMBRES_CATEGORIA } from '../../utils/tareas'

function FormularioTarea({ tareaEnEdicion, onGuardar }) {
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [telefono, setTelefono] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  useEffect(() => {
    if (tareaEnEdicion) {
      setTitulo(tareaEnEdicion.titulo)
      setCategoria(tareaEnEdicion.categoria)
      setTelefono(tareaEnEdicion.telefono)
      setFecha(tareaEnEdicion.fechaObjetivo.toISOString().slice(0, 10))
      setHora(tareaEnEdicion.fechaObjetivo.toTimeString().slice(0, 5))
    } else {
      setTitulo('')
      setCategoria('')
      setTelefono('')
      setFecha('')
      setHora('')
    }
  }, [tareaEnEdicion])

  function manejarEnvio(evento) {
    evento.preventDefault()

    const fechaObjetivo = new Date(`${fecha}T${hora || '23:59'}`)

    onGuardar({
      titulo: titulo.trim(),
      categoria,
      telefono: telefono.trim(),
      fechaObjetivo,
    })
  }

  return (
    <form className="form-tarea" onSubmit={manejarEnvio}>
      <div className="campos d-flex flex-column gap-4">
        <div className="campo d-flex flex-column gap-1">
          <label htmlFor="titulo" className="form-label mb-0">Título</label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            placeholder="Título de la tarea"
            required
          />
        </div>

        <div className="campo d-flex flex-column gap-1">
          <label htmlFor="categoria" className="form-label mb-0">Categoría</label>
          <select
            className="form-select"
            id="categoria"
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
            required
          >
            <option value="">Seleccionar categoría</option>
            {Object.entries(NOMBRES_CATEGORIA).map(([valor, nombre]) => (
              <option key={valor} value={valor}>{nombre}</option>
            ))}
          </select>
        </div>

        <div className="campo d-flex flex-column gap-1">
          <label htmlFor="telefono" className="form-label mb-0">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            id="telefono"
            value={telefono}
            onChange={(evento) => setTelefono(evento.target.value)}
            placeholder="Ej: 3815551234"
            required
          />
        </div>

        <div className="campo d-flex flex-column gap-1">
          <label htmlFor="fecha" className="form-label mb-0">Fecha objetivo</label>
          <input
            type="date"
            className="form-control"
            id="fecha"
            value={fecha}
            onChange={(evento) => setFecha(evento.target.value)}
            required
          />
        </div>

        <div className="campo d-flex flex-column gap-1">
          <label htmlFor="hora" className="form-label mb-0">Hora</label>
          <input
            type="time"
            className="form-control"
            id="hora"
            value={hora}
            onChange={(evento) => setHora(evento.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-crear fw-bold w-100 mt-4">
        {tareaEnEdicion ? 'Guardar cambios' : 'Crear tarea'}
      </button>
    </form>
  )
}

export default FormularioTarea
