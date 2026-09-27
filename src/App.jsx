import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Filtros from './components/Filtros/Filtros'
import {
  calcularSiguienteId,
  cargarTareas,
  guardarTareas,
  pedirPermisoNotificaciones,
} from './utils/tareas'
import './App.css'

function App() {
  const [tareas, setTareas] = useState(() => cargarTareas())
  const [idEnEdicion, setIdEnEdicion] = useState(null)
  const [sidebarAbierta, setSidebarAbierta] = useState(false)
  const [filtroCategoriaActivo, setFiltroCategoriaActivo] = useState('todos')
  const [soloPendientes, setSoloPendientes] = useState(false)
  const siguienteId = useRef(calcularSiguienteId(tareas))

  useEffect(() => {
    pedirPermisoNotificaciones()
  }, [])

  useEffect(() => {
    guardarTareas(tareas)
  }, [tareas])

  const tareaEnEdicion = tareas.find((tarea) => tarea.id === idEnEdicion) || null

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

        <ul>
          {tareas.map((tarea) => (
            <li key={tarea.id}>{tarea.titulo}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
