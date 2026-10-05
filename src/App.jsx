import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Inicio from './pages/Inicio'
import {
  calcularEstado,
  calcularSiguienteId,
  cargarTareas,
  guardarTareas,
  notificar,
  pedirPermisoNotificaciones,
} from './utils/tareas'

function App() {
  const [tareas, setTareas] = useState(() => cargarTareas())
  const [, forzarActualizacion] = useState(0)
  const siguienteId = useRef(calcularSiguienteId(tareas))
  const estadosAnteriores = useRef(new Map())

  useEffect(() => {
    pedirPermisoNotificaciones()
  }, [])

  useEffect(() => {
    guardarTareas(tareas)
  }, [tareas])

  useEffect(() => {
    function revisarCambiosDeEstado(notificarCambios) {
      tareas.forEach((tarea) => {
        const estado = calcularEstado(tarea.fechaObjetivo)
        const estadoAnterior = estadosAnteriores.current.get(tarea.id)

        if (estadoAnterior !== estado.texto) {
          if (notificarCambios && estadoAnterior !== undefined) {
            const esUrgente = estado.texto === 'AMARILLO' || estado.texto === 'NARANJA' || estado.texto === 'VENCIDA'
            if (esUrgente) {
              notificar(tarea, estado)
            }
          }
          estadosAnteriores.current.set(tarea.id, estado.texto)
        }
      })
    }

    revisarCambiosDeEstado(true)

    const intervalo = setInterval(() => {
      revisarCambiosDeEstado(true)
      forzarActualizacion((valor) => valor + 1)
    }, 10000)

    return () => clearInterval(intervalo)
  }, [tareas])

  function guardarTarea(datosTarea, idEditado) {
    if (idEditado === null) {
      setTareas((actuales) => [...actuales, { id: siguienteId.current++, ...datosTarea }])
    } else {
      setTareas((actuales) =>
        actuales.map((tarea) => (tarea.id === idEditado ? { ...tarea, ...datosTarea } : tarea)),
      )
    }
  }

  function eliminarTarea(id) {
    setTareas((actuales) => actuales.filter((tarea) => tarea.id !== id))
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Inicio tareas={tareas} onGuardar={guardarTarea} onEliminar={eliminarTarea} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
