import { X } from 'lucide-react'
import Modal from './Modal'

const STATUS_LABELS = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Finalizado',
}

const STATUS_COLORS = {
  pending: 'bg-yellow-400 text-white',
  in_progress: 'bg-[#3e9e72] text-white',
  completed: 'bg-blue-500 text-white',
}

const PRIORITY_LABELS = {
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
}

const formatDate = (value) => {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit' }).format(date)
}

const formatHours = (value) => {
  if (value === null || value === undefined || value === '') return 'Sin tiempo'
  const hours = parseFloat(value)
  if (Number.isNaN(hours)) return String(value)
  if (hours === 0) return '0m'
  if (hours < 1) return `${Math.round(hours * 60)}m`
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function TaskDetailModal({ task, onClose }) {
  const statusColor = STATUS_COLORS[task?.status] ?? 'bg-gray-200 text-gray-700'
  const statusLabel = STATUS_LABELS[task?.status] ?? task?.status
  const priorityLabel = PRIORITY_LABELS[task?.priority] ?? task?.priority

  return (
    <Modal isOpen={!!task} onClose={onClose}>
      <div className="px-8 pt-8 pb-7">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-2xl font-bold text-[#0b2b2a]">{task?.name}</h2>
            <span className={`rounded-full px-5 py-1 text-base font-semibold ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 h-9 w-9 shrink-0 grid place-items-center rounded-full hover:bg-gray-100 text-[#0b2b2a]"
            aria-label="Cerrar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-5 leading-relaxed text-[#0b2b2a]">
          <span className="font-bold">Descripcion: </span>
          {task?.description || 'Sin descripción'}
        </div>

        <div className="space-y-2 text-[#0b2b2a] text-base">
          <p>
            <span className="font-bold">Fecha Fin : </span>
            {formatDate(task?.due_date)}
          </p>
          <p>
            <span className="font-bold">Tiempo Estimado : </span>
            {formatHours(task?.estimated_time_hours)}
          </p>
          <p>
            <span className="font-bold">Prioridad : </span>
            {priorityLabel}
          </p>
          {task?.attachment_link && (
            <p className="flex items-start gap-1">
              <span className="font-bold whitespace-nowrap">Link adjunto : </span>
              <a
                href={task.attachment_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {task.attachment_link}
              </a>
            </p>
          )}
          <p>
            <span className="font-bold">Tiempo desarrollado : </span>
            {formatHours(task?.developed_time_hours)}
          </p>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            className="px-6 py-3 rounded-2xl bg-[#0b2b2a] text-white font-semibold text-base hover:bg-[#12403e] transition-colors"
          >
            Finalizar
          </button>
          <button
            type="button"
            className="px-6 py-3 rounded-2xl bg-[#e0e0e0] text-[#0b2b2a] font-semibold text-base hover:bg-[#d0d0d0] transition-colors"
          >
            Eliminar
          </button>
          <button
            type="button"
            className="px-6 py-3 rounded-2xl border-2 border-[#0b2b2a] text-[#0b2b2a] font-semibold text-base hover:bg-gray-50 transition-colors"
          >
            Empezar
          </button>
        </div>
      </div>
    </Modal>
  )
}
