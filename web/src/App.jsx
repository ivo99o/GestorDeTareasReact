import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import AppRoutes from './routes/AppRoutes'
import AvisosWhatsApp from './components/AvisosWhatsApp'
import { calcularEstado, calcularSiguienteId, cargarTareas, guardarTareas } from './utils/tareas'
import { enviarAvisoWhatsApp, obtenerMensajeDeError } from './utils/whatsapp'

function App() {
  const [tareas, setTareas] = useState(() => cargarTareas())
  const [, forzarActualizacion] = useState(0)
  const [avisos, setAvisos] = useState([])
  const siguienteId = useRef(calcularSiguienteId(tareas))
  const estadosAnteriores = useRef(new Map())
  const siguienteAviso = useRef(1)

  useEffect(() => {
    guardarTareas(tareas)
  }, [tareas])

  useEffect(() => {
    async function avisarPorWhatsApp(tarea, estado) {
      const id = siguienteAviso.current++

      setAvisos((actuales) => [
        ...actuales,
        { id, fase: 'enviando', titulo: tarea.titulo, telefono: tarea.telefono, estado: estado.texto },
      ])

      try {
        const respuesta = await enviarAvisoWhatsApp(tarea, estado)

        setAvisos((actuales) =>
          actuales.map((aviso) =>
            aviso.id === id
              ? { ...aviso, fase: 'enviado', destino: respuesta.destino, envio: respuesta.estado, hora: new Date() }
              : aviso,
          ),
        )
      } catch (error) {
        setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id))

        Swal.fire({
          icon: 'error',
          title: 'No se pudo enviar el aviso por WhatsApp',
          text: obtenerMensajeDeError(error),
        })
      }
    }

    function revisarCambiosDeEstado(notificarCambios) {
      tareas.forEach((tarea) => {
        const estado = calcularEstado(tarea.fechaObjetivo)
        const estadoAnterior = estadosAnteriores.current.get(tarea.id)

        if (estadoAnterior !== estado.texto) {
          if (notificarCambios && estadoAnterior !== undefined) {
            const esUrgente = estado.texto === 'AMARILLO' || estado.texto === 'NARANJA' || estado.texto === 'VENCIDA'
            if (esUrgente) {
              avisarPorWhatsApp(tarea, estado)
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

  function cerrarAviso(id) {
    setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id))
  }

  return (
    <>
      <AppRoutes tareas={tareas} onGuardar={guardarTarea} onEliminar={eliminarTarea} />

      <AvisosWhatsApp avisos={avisos} onCerrar={cerrarAviso} />
    </>
  )
}

export default App
