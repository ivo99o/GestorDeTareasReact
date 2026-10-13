export const CLAVE_LOCALSTORAGE = 'gestor-tareas'

export const NOMBRES_CATEGORIA = {
  laboral: 'Laboral',
  estudio: 'Estudio',
  recordatorio: 'Recordatorio',
}

export function crearTareasDeEjemplo() {
  const ahora = Date.now()
  const HORA = 60 * 60 * 1000
  const DIA = 24 * HORA
  let siguienteId = 1

  return [
    {
      id: siguienteId++,
      titulo: 'Entregar informe',
      categoria: 'laboral',
      telefono: '3815551234',
      fechaObjetivo: new Date(ahora - 1 * DIA),
    },
    {
      id: siguienteId++,
      titulo: 'Parcial de Programacion IV',
      categoria: 'estudio',
      telefono: '3815551234',
      fechaObjetivo: new Date(ahora + 5 * HORA),
    },
    {
      id: siguienteId++,
      titulo: 'Turno con el dentista',
      categoria: 'recordatorio',
      telefono: '3815551234',
      fechaObjetivo: new Date(ahora + 18 * HORA),
    },
    {
      id: siguienteId++,
      titulo: 'Renovar el DNI',
      categoria: 'laboral',
      telefono: '3815551234',
      fechaObjetivo: new Date(ahora + 2 * DIA),
    },
  ]
}

export function cargarTareas() {
  const guardado = localStorage.getItem(CLAVE_LOCALSTORAGE)

  if (!guardado) {
    return crearTareasDeEjemplo()
  }

  return JSON.parse(guardado).map((tarea) => ({
    ...tarea,
    fechaObjetivo: new Date(tarea.fechaObjetivo),
  }))
}

export function guardarTareas(tareas) {
  localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(tareas))
}

export function calcularSiguienteId(tareas) {
  return tareas.reduce((max, tarea) => Math.max(max, tarea.id + 1), 1)
}

export function calcularEstado(fechaObjetivo) {
  const horasRestantes = (fechaObjetivo.getTime() - Date.now()) / (60 * 60 * 1000)

  if (horasRestantes < 0) {
    return { clase: 'tarea--vencida', clave: 'vencida', texto: 'VENCIDA', icono: '🔴' }
  }
  if (horasRestantes <= 12) {
    return { clase: 'tarea--naranja', clave: 'naranja', texto: 'NARANJA', icono: '🟠' }
  }
  if (horasRestantes <= 24) {
    return { clase: 'tarea--amarilla', clave: 'amarilla', texto: 'AMARILLO', icono: '🟡' }
  }
  return { clase: 'tarea--pendiente', clave: 'pendiente', texto: 'PENDIENTE', icono: '⚪' }
}

export function pedirPermisoNotificaciones() {
  if (!('Notification' in window)) {
    return
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

export function notificar(tarea, estado) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  new Notification('Gestor de Tareas', {
    body: `${estado.icono} "${tarea.titulo}" está en estado ${estado.texto}`,
  })
}
