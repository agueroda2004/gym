import { useState } from 'react'
import { Header } from '../../../components/ui/Header'
import { CiclismoPage } from '../../ciclismo/pages/Ciclismo'
import { CorrerPage } from '../../correr/pages/Correr'

type Tab = 'ciclismo' | 'correr'

function Deporte() {
  const [tab, setTab] = useState<Tab>('ciclismo')

  return (
    <div className="px-4 pt-6">
      <Header title="Deporte" subtitle="Registra tus actividades" />

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border-2 border-line bg-white p-1">
        <button
          onClick={() => setTab('ciclismo')}
          className={`rounded-xl px-4 py-2.5 text-sm font-extrabold uppercase tracking-wide transition-colors ${
            tab === 'ciclismo'
              ? 'bg-primary text-white'
              : 'text-muted hover:text-primary'
          }`}
        >
          Ciclismo
        </button>
        <button
          onClick={() => setTab('correr')}
          className={`rounded-xl px-4 py-2.5 text-sm font-extrabold uppercase tracking-wide transition-colors ${
            tab === 'correr' ? 'bg-primary text-white' : 'text-muted hover:text-primary'
          }`}
        >
          Correr
        </button>
      </div>

      {tab === 'ciclismo' ? <CiclismoPage /> : <CorrerPage />}
    </div>
  )
}

export default Deporte