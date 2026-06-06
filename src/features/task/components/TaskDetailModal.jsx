import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Modal from './Modal'
import { updateTaskStatus, deleteTask } from '../services/taskApi'

const STATUS_LABELS = {
  pending:     'Pendiente',
  in_progress: 'En progreso',
  done:        'Finalizado',
}

const STATUS_COLORS = {
  pending:     'bg-yellow-400 text-white',
  in_progress: 'bg-[#3e9e72] text-white',
  done:        'bg-blue-500 text-white',
}

const PRIORITY_LABELS = {
  high:   'Alta',
  medium: 'Media',
  low:    'Baja',
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

export default function TaskDetailModal({ task, onClose, onUpdated }) {
  const [localTask, setLocalTask] = useState(task)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (task) setLocalTask(task)
  }, [task])

  const statusColor = STATUS_COLORS[localTask?.status] ?? 'bg-gray-200 text-gray-700'
  const statusLabel = STATUS_LABELS[localTask?.status] ?? localTask?.status
  const priorityLabel = PRIORITY_LABELS[localTask?.priority] ?? localTask?.priority

  const handleDelete = async () => {
    setError(null)
    setLoadingDelete(true)
    try {
      await deleteTask(localTask.id)
      onUpdated?.()
      onClose()
    } catch {
      setError('No se pudo eliminar la tarea. Intenta de nuevo.')
    } finally {
      setLoadingDelete(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setError(null)
    setLoadingStatus(true)
    try {
      const updated = await updateTaskStatus(localTask.id, newStatus)
      setLocalTask(updated)
      onUpdated?.()
    } catch {
      setError('No se pudo actualizar el estado. Intenta de nuevo.')
    } finally {
      setLoadingStatus(false)
    }
  }

  return (
    <Modal isOpen={!!task} onClose={onClose}>
      <div className="px-8 pt-8 pb-7">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-2xl font-bold text-[#0b2b2a]">{localTask?.name}</h2>
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
          {localTask?.description || 'Sin descripción'}
        </div>

        <div className="space-y-2 text-[#0b2b2a] text-base">
          <p>
            <span className="font-bold">Fecha Fin : </span>
            {formatDate(localTask?.due_date)}
          </p>
          <p>
            <span className="font-bold">Tiempo Estimado : </span>
            {formatHours(localTask?.estimated_time_hours)}
          </p>
          <p>
            <span className="font-bold">Prioridad : </span>
            {priorityLabel}
          </p>
          {localTask?.attachment_link && (
            <p className="flex items-start gap-1">
              <span className="font-bold whitespace-nowrap">Link adjunto : </span>
              <a
                href={localTask?.attachment_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {localTask?.attachment_link}
              </a>
            </p>
          )}
          <p>
            <span className="font-bold">Tiempo desarrollado : </span>
            {formatHours(localTask?.developed_time_hours)}
          </p>
        </div>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        <div className="flex gap-4 mt-8">
          {localTask?.status === 'in_progress' && (
            <button
              type="button"
              disabled={loadingStatus}
              onClick={() => handleStatusChange('done')}
              className="px-6 py-3 rounded-2xl bg-[#0b2b2a] text-white font-semibold text-base hover:bg-[#12403e] disabled:opacity-60 transition-colors"
            >
              {loadingStatus ? 'Guardando...' : 'Finalizar'}
            </button>
          )}

          <button
            type="button"
            disabled={loadingDelete}
            onClick={handleDelete}
            className="px-6 py-3 rounded-2xl bg-[#e0e0e0] text-[#0b2b2a] font-semibold text-base hover:bg-[#d0d0d0] disabled:opacity-60 transition-colors"
          >
            {loadingDelete ? 'Eliminando...' : 'Eliminar'}
          </button>

          {localTask?.status === 'pending' && (
            <button
              type="button"
              disabled={loadingStatus}
              onClick={() => handleStatusChange('in_progress')}
              className="px-6 py-3 rounded-2xl border-2 border-[#0b2b2a] text-[#0b2b2a] font-semibold text-base hover:bg-gray-50 disabled:opacity-60 transition-colors"
            >
              {loadingStatus ? 'Guardando...' : 'Empezar'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}
