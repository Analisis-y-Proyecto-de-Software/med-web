import { useState } from 'react'
import { Calendar } from 'primereact/calendar'
import corazones from '../../../assets/corazones.png'
import enfadado from '../../../assets/enfadado.png'
import meh from '../../../assets/meh.png'
import sonrisa from '../../../assets/sonrisa.png'
import triste from '../../../assets/triste.png'

const EMOTION_BY_ID = {
  1: { icon: corazones, label: 'Excelente' },
  2: { icon: sonrisa, label: 'Bien' },
  3: { icon: meh, label: 'Neutral' },
  4: { icon: triste, label: 'Mal' },
  5: { icon: enfadado, label: 'Muy Mal' },
}

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

export default function RegistroEmocionalList({ 
  records, 
  loading, 
  error, 
  selectedDate, 
  onSelectedDateChange,
  selectedStateId,
  onSelectedStateChange 
}) {
  const [showStateOverlay, setShowStateOverlay] = useState(false)

  const handleStateClick = (id) => {
    onSelectedStateChange(id)
    setShowStateOverlay(false) // Cierra al seleccionar
  }

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
      const id = Number(record?.emotional_state_id || record?.state_id)
      const emotionData = EMOTION_BY_ID[id] || EMOTION_BY_ID[2]

      return (
        <article
          key={record?.id || `record-${index}`}
          className="flex items-center justify-between gap-6 rounded-[16px] bg-white px-7 py-5 shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
        >
          <div className="text-2xl font-semibold text-[#0b2b2a]">
            {formatRecordDate(createdAt)}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-[#0b2b2a]">
              {record?.name || emotionData.label}
            </span>
            <img src={emotionData.icon} alt="Emoción" className="h-16 w-16" />
          </div>
        </article>
      )
    })
  }

  return (
    <div className="h-full rounded-[22px] border border-[#7b9c93] bg-[#7ea79b] p-5 shadow-[0_10px_24px_rgba(0,0,0,0.1)] flex flex-col">
      <div className="flex items-center justify-between px-4 text-[#0c2a2b] mb-4">
        
        {/* SECTOR FECHA */}
        <div className="flex items-center gap-2 text-2xl font-semibold select-none">
          {/* Al presionar sobre la palabra "Fecha", se limpia el filtro */}
          <span 
            onClick={() => onSelectedDateChange(null)} 
            className={`cursor-pointer transition-colors ${selectedDate ? 'text-white border-b-2 border-white' : 'hover:text-[#1a4a4c]'}`}
            title="Haga clic aquí para limpiar el filtro de fecha"
          >
            Fecha
          </span>
          
          {/* El disparador del calendario queda restringido únicamente al icono de triángulo */}
          <div className="relative flex items-center justify-center w-6 h-6 bg-transparent hover:bg-[#6c9589] rounded-md transition-all cursor-pointer">
            <span className="inline-block h-0 w-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-[#0c2a2b]" />
            <Calendar
              value={selectedDate}
              onChange={(e) => onSelectedDateChange(e.value)}
              appendTo={typeof window !== 'undefined' ? document.body : null}
              dateFormat="yy-mm-dd"
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, zIndex: 10, cursor: 'pointer' }}
              inputStyle={{ width: '100%', height: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* SECTOR ESTADO / EMOCIÓN */}
        <div className="relative flex items-center gap-2 text-2xl font-semibold select-none">
          {/* Al presionar sobre "Estado", se limpia el filtro y se cierra el menú */}
          <span 
            onClick={() => {
              onSelectedStateChange(null)
              setShowStateOverlay(false)
            }} 
            className={`cursor-pointer transition-colors ${selectedStateId ? 'text-white border-b-2 border-white' : 'hover:text-[#1a4a4c]'}`}
            title="Haga clic aquí para limpiar el filtro de estado"
          >
            Estado
          </span>
          
          {/* Al presionar la flecha, se abre/cierra la ventana flotante de emociones */}
          <button 
            onClick={() => setShowStateOverlay(!showStateOverlay)}
            className="flex items-center justify-center w-6 h-6 hover:bg-[#6c9589] rounded-md transition-all focus:outline-none"
          >
            <span className="inline-block h-0 w-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-[#0c2a2b]" />
          </button>

          {/* OVERLAY FLOTANTE DE EMOCIONES (Efecto según imagen image_b5a6e1.png) */}
          {showStateOverlay && (
            <div className="absolute right-0 top-full mt-2 z-30 w-44 rounded-2xl bg-[#5f8479]/90 p-3 shadow-xl backdrop-blur-sm border border-[#7b9c93]">
              <div className="grid grid-cols-3 gap-2 justify-items-center items-center">
                {Object.entries(EMOTION_BY_ID).map(([id, data]) => (
                  <button
                    key={id}
                    onClick={() => handleStateClick(Number(id))}
                    className={`p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 ${
                      selectedStateId === Number(id) ? 'bg-white/30 ring-2 ring-white' : 'hover:bg-white/10'
                    }`}
                    title={data.label}
                  >
                    <img src={data.icon} alt={data.label} className="h-9 w-9 object-contain" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* LISTADO DE TARJETAS */}
      <div className="mt-1 flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
        {renderContent()}
      </div>
    </div>
  )
}