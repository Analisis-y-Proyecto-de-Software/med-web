const EMOTION_DISPLAY = {
  Excelente: { emoji: '😊', color: '#4ade80' },
  Bien:      { emoji: '🙂', color: '#86efac' },
  Neutral:   { emoji: '😐', color: '#facc15' },
  Mal:       { emoji: '😞', color: '#fb923c' },
  'Muy Mal': { emoji: '😢', color: '#f87171' },
}

export default function TodayEmotionPanel({ entry, loading }) {
  const today = new Date()
  const todayLabel = today.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const states = entry?.emotional_states ?? []
  const lastState = states[states.length - 1]
  const emotion = lastState ? EMOTION_DISPLAY[lastState] : null

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado emocional</p>
      <p className="text-sm text-[#0b2b2a] font-medium capitalize">{todayLabel}</p>

      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#00343a]" />
        ) : emotion ? (
          <div className="flex items-center gap-3">
            <span className="text-6xl leading-none">{emotion.emoji}</span>
            <span className="text-lg font-bold" style={{ color: emotion.color }}>
              {lastState}
            </span>
          </div>
        ) : (
          <>
            <span className="text-5xl leading-none">📭</span>
            <p className="text-sm text-gray-400 text-center">Sin registro para hoy</p>
          </>
        )}
      </div>
    </div>
  )
}
