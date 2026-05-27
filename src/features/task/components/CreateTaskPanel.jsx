import { useState } from 'react'
import { getCurrentUser } from 'aws-amplify/auth'
import SidePanel from './SidePanel'
import { createTask } from '../services/taskApi'

const PRIORITY_OPTIONS = [
  { value: 'high',   label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low',    label: 'Baja' },
]

const EMPTY = {
  name: '',
  description: '',
  due_date: '',
  estimated_time_hours: '',
  priority: '',
  attachment_link: '',
}

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#0b2b2a] text-base outline-none focus:border-[#00343a] focus:ring-2 focus:ring-[#00343a]/20 transition'

export default function CreateTaskPanel({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleClose = () => {
    setForm(EMPTY)
    setError(null)
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const currentUser = await getCurrentUser()
      const userId = currentUser?.userId || currentUser?.username
      await createTask(userId, {
        titulo: form.name,
        descripcion: form.description,
        fechaFin: form.due_date || null,
        tiempoEstimado: form.estimated_time_hours ? parseFloat(form.estimated_time_hours) : null,
        prioridad: form.priority || null,
        linkAdjunto: form.attachment_link || null,
      })
      onCreated?.()
      handleClose()
    } catch {
      setError('No se pudo crear la tarea. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SidePanel isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} className="flex flex-col h-full px-10 py-10 gap-6">
        <h2 className="text-2xl font-bold text-[#0b2b2a] text-center mb-2">Crear Tarea</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#0b2b2a]" htmlFor="name">
            Título
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#0b2b2a]" htmlFor="description">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#0b2b2a]" htmlFor="due_date">
              Fecha Fin
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              value={form.due_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#0b2b2a]" htmlFor="estimated_time_hours">
              Tiempo estimado
            </label>
            <input
              id="estimated_time_hours"
              name="estimated_time_hours"
              type="number"
              min="0"
              step="0.5"
              placeholder="horas"
              value={form.estimated_time_hours}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#0b2b2a]" htmlFor="priority">
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Seleccionar prioridad</option>
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[#0b2b2a]" htmlFor="attachment_link">
            Link Adjunto
          </label>
          <input
            id="attachment_link"
            name="attachment_link"
            type="url"
            placeholder="https://"
            value={form.attachment_link}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <div className="mt-auto flex justify-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 rounded-2xl bg-[#0b2b2a] text-white font-semibold text-base hover:bg-[#12403e] disabled:opacity-60 transition-colors"
          >
            {loading ? 'Creando...' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-10 py-3 rounded-2xl bg-[#e0e0e0] text-[#0b2b2a] font-semibold text-base hover:bg-[#d0d0d0] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </SidePanel>
  )
}
