import corazones from '../../../assets/corazones.png'
import enfadado from '../../../assets/enfadado.png'
import meh from '../../../assets/meh.png'
import sonrisa from '../../../assets/sonrisa.png'
import triste from '../../../assets/triste.png'

const EMOTION_BY_NAME = new Map([
  ['feliz', sonrisa],
  ['bien', sonrisa],
  ['contento', sonrisa],
  ['neutral', meh],
  ['meh', meh],
  ['triste', triste],
  ['mal', triste],
  ['enojado', enfadado],
  ['enfadado', enfadado],
  ['molesto', enfadado],
  ['amor', corazones],
  ['excelente', corazones],
  ['muy bien', corazones],
])

const EMOTION_BY_ID = {
  1: enfadado,
  2: triste,
  3: meh,
  4: sonrisa,
  5: corazones,
}

const normalize = (value) => (value || '').toString().trim().toLowerCase()

const formatRecordDate = (value) => {
  if (!value) return 'Sin fecha'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'

  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  if (isToday) {
    const time = new Intl.DateTimeFormat('es-AR', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
    return `Hoy, ${time}`
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const getEmotionIcon = (record) => {
  const name = normalize(record?.name || record?.emotion)
  if (EMOTION_BY_NAME.has(name)) {
    return EMOTION_BY_NAME.get(name)
  }

  const id = Number(record?.emotional_state_id || record?.state_id)
  return EMOTION_BY_ID[id] || sonrisa
}

export default function RegistroEmocionalList({ records, loading, error }) {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="rounded-[16px] bg-white px-6 py-5 text-xl text-[#4b4b4b] shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
          Cargando registros...
        </div>
      )
    }

    if (error) {
      return (
        <div className="rounded-[16px] bg-white px-6 py-5 text-xl text-red-700 shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
          {error}
        </div>
      )
    }

    if (!records.length) {
      return (
        <div className="rounded-[16px] bg-white px-6 py-5 text-xl text-[#4b4b4b] shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
          No hay registros para mostrar.
        </div>
      )
    }

    return records.map((record, index) => {
      const createdAt = record?.created_at || record?.createdAt || record?.date
      const icon = getEmotionIcon(record)
      const label = record?.name || record?.emotion || `Registro ${index + 1}`

      return (
        <article
          key={record?.id || `${label}-${index}`}
          className="flex items-center justify-between gap-6 rounded-[16px] bg-white px-7 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
        >
          <div className="text-2xl font-semibold text-[#0b2b2a]">
            {formatRecordDate(createdAt)}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-[#0b2b2a]">{label}</span>
            <img src={icon} alt={label} className="h-16 w-16" />
          </div>
        </article>
      )
    })
  }

  return (
    <div className="h-full rounded-[22px] border border-[#7b9c93] bg-[#7ea79b] p-5 shadow-[0_10px_24px_rgba(0,0,0,0.1)] flex flex-col">
      <div className="flex items-center justify-between px-4 text-2xl font-semibold text-[#0c2a2b]">
        <span className="flex items-center gap-2">
          Fecha
          <span className="inline-block h-0 w-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-[#0c2a2b]" />
        </span>
        <span className="flex items-center gap-2">
          Estado
          <span className="inline-block h-0 w-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-[#0c2a2b]" />
        </span>
      </div>

      <div className="mt-3 flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
        {renderContent()}
      </div>
    </div>
  )
}
