import RegistroEmocionalList from '../features/registroEmocional/components/RegistroEmocionalList'
import useRegistroEmocional from '../features/registroEmocional/hooks/useRegistroEmocional'
import enfadado from '../assets/enfadado.png'
import triste from '../assets/triste.png'
import meh from '../assets/meh.png'
import sonrisa from '../assets/sonrisa.png'
import corazones from '../assets/corazones.png'

export default function RegistroEmocionalPage() {
  const { records, loading, error, submitRecord } = useRegistroEmocional()

  return (
    <section className="h-full bg-[#f8f9fa]">
      <div className="h-full flex flex-col gap-4">
        <header className="flex flex-col items-center gap-4 rounded-[18px] bg-white px-6 py-6 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-semibold text-[#0b2b2a]">Registra tu estado emocional</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { id: 1, src: enfadado, alt: 'Enfadado', name: 'enfadado' },
              { id: 2, src: triste, alt: 'Triste', name: 'triste' },
              { id: 3, src: meh, alt: 'Neutral', name: 'neutral' },
              { id: 4, src: sonrisa, alt: 'Feliz', name: 'feliz' },
              { id: 5, src: corazones, alt: 'Muy feliz', name: 'muy bien' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => void submitRecord({ name: item.name, id: item.id })}
                disabled={loading}
                title={item.alt}
                className="rounded-md bg-transparent p-1 hover:opacity-80 disabled:opacity-60"
              >
                <img src={item.src} alt={item.alt} className="h-14 w-14" />
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 min-h-0">
          <RegistroEmocionalList records={records} loading={loading} error={error} />
        </div>
      </div>
    </section>
  )
}
