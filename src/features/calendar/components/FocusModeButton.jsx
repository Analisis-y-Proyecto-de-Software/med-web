import { useState } from 'react'
import { Focus } from 'lucide-react'
import FocusModePopup from './FocusModePopup'

export default function FocusModeButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#00343a] text-white py-3 text-sm font-semibold hover:bg-[#004d55] transition-colors shadow-sm"
      >
        <Focus className="w-4 h-4" />
        Iniciar modo enfoque
      </button>

      {open && <FocusModePopup onClose={() => setOpen(false)} />}
    </>
  )
}
