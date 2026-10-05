import { useState } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import Filtros from '../components/Filtros/Filtros'
import ListaTareas from '../components/Tareas/ListaTareas'
import { calcularEstado } from '../utils/tareas'
import './Inicio.css'

function Inicio({ tareas, onGuardar, onEliminar }) {
  const [idEnEdicion, setIdEnEdicion] = useState(null)
  const [sidebarAbierta, setSidebarAbierta] = useState(false)
  const [filtroCategoriaActivo, setFiltroCategoriaActivo] = useState('todos')
  const [soloPendientes, setSoloPendientes] = useState(false)

  const tareaEnEdicion = tareas.find((tarea) => tarea.id === idEnEdicion) || null

  const tareasAMostrar = tareas
    .filter((tarea) => {
      const coincideCategoria = filtroCategoriaActivo === 'todos' || tarea.categoria === filtroCategoriaActivo
      const coincidePendiente = !soloPendientes || calcularEstado(tarea.fechaObjetivo).clave === 'pendiente'
      return coincideCategoria && coincidePendiente
    })
    .sort((a, b) => a.fechaObjetivo - b.fechaObjetivo)

  function guardarTarea(datosTarea) {
    onGuardar(datosTarea, idEnEdicion)
    setIdEnEdicion(null)
    setSidebarAbierta(false)
  }

  function eliminarTarea(id) {
    onEliminar(id)

    if (idEnEdicion === id) {
      setIdEnEdicion(null)
    }
  }

  function iniciarEdicion(id) {
    setIdEnEdicion(id)
    setSidebarAbierta(true)
  }

  return (
    <main className="app-layout d-flex flex-column flex-lg-row min-vh-100">
      <Sidebar
        abierta={sidebarAbierta}
        onAbrir={() => setSidebarAbierta(true)}
        onCerrar={() => setSidebarAbierta(false)}
        tareaEnEdicion={tareaEnEdicion}
        onGuardar={guardarTarea}
      />

      <section className="contenido flex-grow-1 py-4 px-3 px-md-4">
        <h1 className="h2 text-center mb-4">Tareas</h1>

        <Filtros
          filtroCategoriaActivo={filtroCategoriaActivo}
          soloPendientes={soloPendientes}
          onCambiarCategoria={setFiltroCategoriaActivo}
          onAlternarPendientes={() => setSoloPendientes((actual) => !actual)}
        />

        <ListaTareas tareas={tareasAMostrar} onEditar={iniciarEdicion} onEliminar={eliminarTarea} />
      </section>
    </main>
  )
}

export default Inicio
