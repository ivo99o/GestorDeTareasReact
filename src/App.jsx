import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Filtros from './components/Filtros/Filtros'
import ListaTareas from './components/Tareas/ListaTareas'
import {
  calcularEstado,
  calcularSiguienteId,
  cargarTareas,
  guardarTareas,
  notificar,
  pedirPermisoNotificaciones,
} from './utils/tareas'
import './App.css'

function App() {
  const [tareas, setTareas] = useState(() => cargarTareas())
  const [idEnEdicion, setIdEnEdicion] = useState(null)
  const [sidebarAbierta, setSidebarAbierta] = useState(false)
  const [filtroCategoriaActivo, setFiltroCategoriaActivo] = useState('todos')
  const [soloPendientes, setSoloPendientes] = useState(false)
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

  const tareaEnEdicion = tareas.find((tarea) => tarea.id === idEnEdicion) || null

  const tareasAMostrar = tareas
    .filter((tarea) => {
      const coincideCategoria = filtroCategoriaActivo === 'todos' || tarea.categoria === filtroCategoriaActivo
      const coincidePendiente = !soloPendientes || calcularEstado(tarea.fechaObjetivo).clave === 'pendiente'
      return coincideCategoria && coincidePendiente
    })
    .sort((a, b) => a.fechaObjetivo - b.fechaObjetivo)

  function guardarTarea(datosTarea) {
    if (idEnEdicion === null) {
      setTareas((actuales) => [...actuales, { id: siguienteId.current++, ...datosTarea }])
    } else {
      setTareas((actuales) =>
        actuales.map((tarea) => (tarea.id === idEnEdicion ? { ...tarea, ...datosTarea } : tarea)),
      )
    }

    setIdEnEdicion(null)
    setSidebarAbierta(false)
  }

  function eliminarTarea(id) {
    setTareas((actuales) => actuales.filter((tarea) => tarea.id !== id))

    if (idEnEdicion === id) {
      setIdEnEdicion(null)
    }
  }

  function iniciarEdicion(id) {
    setIdEnEdicion(id)
    setSidebarAbierta(true)
  }

  return (
    <div className="app-layout d-flex flex-column flex-lg-row min-vh-100">
      <Sidebar
        abierta={sidebarAbierta}
        onAbrir={() => setSidebarAbierta(true)}
        onCerrar={() => setSidebarAbierta(false)}
        tareaEnEdicion={tareaEnEdicion}
        onGuardar={guardarTarea}
      />

      <div className="contenido flex-grow-1 py-4 px-3 px-md-4">
        <h2 className="text-center mb-4">Tareas</h2>

        <Filtros
          filtroCategoriaActivo={filtroCategoriaActivo}
          soloPendientes={soloPendientes}
          onCambiarCategoria={setFiltroCategoriaActivo}
          onAlternarPendientes={() => setSoloPendientes((actual) => !actual)}
        />

        <ListaTareas tareas={tareasAMostrar} onEditar={iniciarEdicion} onEliminar={eliminarTarea} />
      </div>
    </div>
  )
}

export default App
