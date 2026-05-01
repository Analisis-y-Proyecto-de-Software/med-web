import { Eye } from 'lucide-react'

const formatDueDate = (value) => {
  if (!value) return 'Sin fecha'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date)
}

const formatDuration = (value) => {
  if (!value) return 'Sin tiempo'

  if (typeof value === 'number') {
    return `${value}h`
  }

  return value
}

export default function TaskList({ tasks, loading, error }) {
  if (loading) {
    return (
      <div className="rounded-[18px] bg-[#00343a] px-7 py-6 text-xl text-white/80 shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
        Cargando tareas...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[18px] bg-[#00343a] px-7 py-6 text-xl text-red-100 shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
        {error}
      </div>
    )
  }

  if (!tasks.length) {
    return (
      <div className="rounded-[18px] bg-[#00343a] px-7 py-6 text-xl text-white/80 shadow-[0_6px_16px_rgba(0,0,0,0.15)]">
        No hay tareas para mostrar.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => {
        const title = task?.title || task?.name || task?.tarea || `Tarea ${index + 1}`
        const status = task?.status || task?.estado || 'En progreso'
        const dueDate = task?.due_date || task?.fecha_fin || task?.dueDate || task?.fechaFin
        const duration =
          task?.estimated_time_hours ||
          task?.estimated_time ||
          task?.tiempo_estimado ||
          task?.estimatedTime
        const priority = task?.priority || task?.prioridad || 'Media'

        return (
          <article
            key={task?.id || `${title}-${index}`}
            className="grid grid-cols-[2.2fr_1fr_1fr_0.8fr_56px] items-center gap-4 rounded-[18px] bg-[#00343a] px-7 py-5 text-white shadow-[0_6px_16px_rgba(0,0,0,0.15)]"
          >
            <div className="space-y-1">
              <p className="text-xl font-semibold">{title}</p>
              <p className="text-base text-white/70">Estado: {status}</p>
            </div>
            <p className="text-xl">{formatDueDate(dueDate)}</p>
            <p className="text-xl">{formatDuration(duration)}</p>
            <p className="text-xl">{priority}</p>
            <button
              type="button"
              className="h-12 w-12 grid place-items-center text-white/80 hover:text-white"
              aria-label="Ver tarea"
            >
              <Eye className="h-8 w-8" />
            </button>
          </article>
        )
      })}
    </div>
  )
}
