import { useState, useEffect, useRef } from 'react'
import { Clock, Coffee, Leaf, Minus, Plus, Play, Pause, RotateCcw } from 'lucide-react'

const PRESETS = {
  pomodoro: { breakInterval: 25, shortBreak: 5  },
  deep:     { breakInterval: 50, shortBreak: 10 },
  custom:   { breakInterval: 30, shortBreak: 5  },
}

const SESSION_CARDS = [
  { key: 'pomodoro', icon: Clock,  name: 'Pomodoro clásico', desc: ['25 min enfoque', '5 min descanso']  },
  { key: 'deep',     icon: Coffee, name: 'Enfoque profundo',  desc: ['50 min enfoque', '10 min descanso'] },
  { key: 'custom',   icon: Leaf,   name: 'Personalizado',     desc: ['Configura tus tiempos'], iconColor: 'text-green-600' },
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function Stepper({ value, onChange, min = 1, max = 120, disabled = false }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled}
        className="w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="text-lg font-bold w-6 text-center">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled}
        className="w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  )
}

function TimerView({ breakInterval, shortBreak, initialMode, onBack }) {
  const [mode, setMode]       = useState(initialMode)
  const [timeLeft, setTimeLeft] = useState((initialMode === 'focus' ? breakInterval : shortBreak) * 60)
  const [running, setRunning] = useState(true)
  const intervalRef = useRef(null)

  const totalSeconds = mode === 'focus' ? breakInterval * 60 : shortBreak * 60
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100

  // countdown
  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, timeLeft])

  // auto-switch when segment ends
  useEffect(() => {
    if (timeLeft === 0) {
      const next = mode === 'focus' ? 'break' : 'focus'
      setMode(next)
      setTimeLeft((next === 'focus' ? breakInterval : shortBreak) * 60)
      setRunning(true)
    }
  }, [timeLeft, mode, breakInterval, shortBreak])

  const switchMode = (newMode) => {
    clearInterval(intervalRef.current)
    setMode(newMode)
    setTimeLeft((newMode === 'focus' ? breakInterval : shortBreak) * 60)
    setRunning(true)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setTimeLeft(totalSeconds)
    setRunning(false)
  }

  const isFocus = mode === 'focus'

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <div className="flex gap-2">
        {[{ key: 'focus', label: 'Enfoque' }, { key: 'break', label: 'Descanso' }].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              mode === key ? 'bg-[#0b2b2a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#e5e7eb" strokeWidth="7" />
          <circle
            cx="50" cy="50" r="44" fill="none"
            stroke={isFocus ? '#00343a' : '#4ade80'}
            strokeWidth="7"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold tabular-nums ${isFocus ? 'text-[#00343a]' : 'text-green-600'}`}>
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-gray-400 mt-1">{isFocus ? 'Enfoque' : 'Descanso'}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          className="w-14 h-14 rounded-full bg-[#00343a] flex items-center justify-center hover:bg-[#004d55] transition-colors shadow-md"
        >
          {running
            ? <Pause className="w-6 h-6 text-white" />
            : <Play  className="w-6 h-6 text-white ml-1" />
          }
        </button>
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-base"
          title="Editar configuración"
        >
          ✏️
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Enfoque cada {breakInterval} min · Descanso {shortBreak} min · cambia automático
      </p>
    </div>
  )
}

export default function FocusModePopup({ onClose }) {
  const [tab, setTab]               = useState('personalizar')
  const [sessionType, setSessionType] = useState('pomodoro')
  const [breakInterval, setBreakInterval] = useState(PRESETS.pomodoro.breakInterval)
  const [shortBreak, setShortBreak]       = useState(PRESETS.pomodoro.shortBreak)
  const [timerMode, setTimerMode]         = useState('focus')

  const isCustom = sessionType === 'custom'

  const handleSessionType = (key) => {
    setSessionType(key)
    if (key !== 'custom') {
      setBreakInterval(PRESETS[key].breakInterval)
      setShortBreak(PRESETS[key].shortBreak)
    }
  }

  const startTimer = (mode) => {
    setTimerMode(mode)
    setTab('iniciar')
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">

        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex gap-2">
            {[{ key: 'iniciar', label: 'Iniciar' }, { key: 'personalizar', label: 'Personalizar' }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                  tab === key
                    ? 'bg-[#0b2b2a] text-white border-[#0b2b2a]'
                    : 'bg-white text-[#0b2b2a] border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Cerrar
          </button>
        </div>

        {tab === 'iniciar' ? (
          <TimerView
            breakInterval={breakInterval}
            shortBreak={shortBreak}
            initialMode={timerMode}
            onBack={() => setTab('personalizar')}
          />
        ) : (
          <div className="p-5 flex flex-col gap-4">

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0b2b2a]" />
              <h2 className="text-base font-bold text-[#0b2b2a]">Personalizar modo de enfoque</h2>
            </div>

            {/* Tipo de sesión */}
            <div className="bg-[#8aa5a0] rounded-2xl p-4 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">Tipo de sesión</h3>
              <div className="grid grid-cols-3 gap-3">
                {SESSION_CARDS.map(({ key, icon: Icon, iconColor, name, desc }) => (
                  <button
                    key={key}
                    onClick={() => handleSessionType(key)}
                    className={`rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all ${
                      sessionType === key
                        ? 'bg-white border-2 border-green-400 shadow-sm'
                        : 'bg-[#9bb5b0] hover:bg-[#a5bfba]'
                    }`}
                  >
                    <Icon className={`w-7 h-7 ${iconColor ?? 'text-[#0b2b2a]'}`} />
                    <span className="text-sm font-bold text-[#0b2b2a]">{name}</span>
                    <div className="flex flex-col">
                      {desc.map((line, i) => (
                        <span key={i} className="text-xs text-gray-500">{line}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cada cuánto descansar */}
            <div className="bg-[#8aa5a0] rounded-2xl p-4 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">Cada cuánto descansar</h3>
              <div className="flex items-center gap-4">
                <Stepper value={breakInterval} onChange={setBreakInterval} min={5} max={120} disabled={!isCustom} />
                <span className="text-sm font-medium text-white">Minutos de enfoque</span>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-white/80 shrink-0">5 min</span>
                  <input
                    type="range" min={5} max={120} value={breakInterval}
                    disabled={!isCustom}
                    onChange={(e) => isCustom && setBreakInterval(Number(e.target.value))}
                    className="flex-1 accent-[#0b2b2a] disabled:opacity-60"
                  />
                  <span className="text-xs text-white/80 shrink-0">120 min</span>
                </div>
              </div>
            </div>

            {/* Descanso */}
            <div className="bg-[#8aa5a0] rounded-2xl p-4 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">Descanso</h3>
              <div className="bg-[#9bb5b0] rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">Descanso corto</span>
                </div>
                <div className="flex items-center gap-3">
                  <Stepper value={shortBreak} onChange={setShortBreak} min={1} max={30} disabled={!isCustom} />
                  <span className="text-xs text-white/80">Minutos</span>
                  <button
                    onClick={() => startTimer('break')}
                    className="ml-auto px-3 py-1.5 bg-[#0b2b2a] text-white text-xs font-semibold rounded-lg hover:bg-[#1a3f3e] transition-colors"
                  >
                    Iniciar
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => startTimer('focus')}
              className="w-full py-3 bg-[#00343a] text-white font-bold rounded-2xl hover:bg-[#004d55] transition-colors text-sm"
            >
              Iniciar modo enfoque
            </button>

          </div>
        )}
      </div>
    </div>
  )
}
