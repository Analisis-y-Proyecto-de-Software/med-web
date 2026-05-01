import TaskList from '../features/task/components/TaskList'
import useTasks from '../features/task/hooks/useTasks'

export default function TaskPage() {
  const { tasks, loading, error } = useTasks()

  return (
    <section className="h-full bg-[#f8f9fa]">
      <div className="h-full flex flex-col gap-4">
        <header className="flex items-center justify-end">
          <button
            type="button"
            className="rounded-xl bg-[#8aa5a0] px-6 py-3 text-lg font-semibold text-white shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
          >
            + Nueva Tarea
          </button>
        </header>

        <div className="grid grid-cols-[2.2fr_1fr_1fr_0.8fr_56px] items-center gap-4 px-6 text-xl font-semibold text-[#0b2b2a]">
          <div className="flex items-center gap-2">
            Tarea/ Estado
            <span className="inline-block h-0 w-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-[#0b2b2a]" />
          </div>
          <div className="flex items-center gap-2">
            Fecha Fin
            <span className="inline-block h-0 w-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-[#0b2b2a]" />
          </div>
          <div className="flex items-center gap-2">
            Tiempo estimado
            <span className="inline-block h-0 w-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-[#0b2b2a]" />
          </div>
          <div className="flex items-center gap-2">
            Prioridad
            <span className="inline-block h-0 w-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-[#0b2b2a]" />
          </div>
          <div />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
          <TaskList tasks={tasks} loading={loading} error={error} />
        </div>
      </div>
    </section>
  )
}
