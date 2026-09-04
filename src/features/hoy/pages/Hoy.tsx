import { useCallback, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Header } from '../../../components/ui/Header'
import { Icon } from '../../../components/ui/Icons'
import { diaDeHoy } from '../../../lib/utils'
import type { DiaSemana } from '../../../lib/constants'
import { CiclismoForm } from '../../ciclismo/components/CiclismoForm'
import { useCiclismo } from '../../ciclismo/hooks/useCiclismo'
import { CorrerForm } from '../../correr/components/CorrerForm'
import { useCorrer } from '../../correr/hooks/useCorrer'
import { useRutina } from '../../rutina/hooks/useRutina'
import { crearSesion, getPlanDelDia, getSesionEnProgreso } from '../../rutina/service/Rutina.service'
import type { PlanDelDia, Sesion } from '../../rutina/types'

function Hoy() {
  const navigate = useNavigate()
  const { rutinas, loading: loadingRutinas } = useRutina()
  const { create: createCiclismo } = useCiclismo()
  const { create: createCorrer } = useCorrer()

  const [plan, setPlan] = useState<PlanDelDia | null>(null)
  const [inProgress, setInProgress] = useState<Sesion | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [starting, setStarting] = useState(false)
  const [cicliOpen, setCicliOpen] = useState(false)
  const [correrOpen, setCorrerOpen] = useState(false)

  const activa = rutinas.find((r) => r.activa)
  const hoy = diaDeHoy()

  const loadPlan = useCallback(async () => {
    if (!activa) {
      setPlan(null)
      setInProgress(null)
      setLoadingPlan(false)
      return
    }
    setLoadingPlan(true)
    try {
      setPlan(await getPlanDelDia(activa.id, diaDeHoy() as DiaSemana))
      setInProgress((await getSesionEnProgreso(activa.id)) ?? null)
    } finally {
      setLoadingPlan(false)
    }
  }, [activa])

  useEffect(() => {
    void loadPlan()
  }, [loadPlan])

  const start = async () => {
    if (!activa || !plan) return
    setStarting(true)
    try {
      if (inProgress) {
        navigate(`/entrenar/${inProgress.id}`)
        return
      }
      const sesion = await crearSesion(activa.id, plan.entrenamiento.id)
      navigate(`/entrenar/${sesion.id}`)
    } finally {
      setStarting(false)
    }
  }

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="px-4 pt-6">
      <Header title="¡A entrenar!" subtitle={today.charAt(0).toUpperCase() + today.slice(1)} />

      {loadingRutinas || loadingPlan ? (
        <p className="py-10 text-center text-sm font-medium text-muted">Cargando...</p>
      ) : !activa ? (
        <section className="rounded-3xl border-2 border-line bg-white p-5 text-center">
          <div className="mb-3 flex justify-center text-primary">
            <Icon name="pesa" size={44} />
          </div>
          <h2 className="mb-1 text-lg font-extrabold text-ink">No tienes rutina activa</h2>
          <p className="mb-4 text-sm font-medium text-muted">
            Marca una rutina como activa para ver aquí lo que toca entrenar hoy.
          </p>
          <Link to="/rutinas">
            <Button full>Ir a mis rutinas</Button>
          </Link>
        </section>
      ) : !plan ? (
        <section className="rounded-3xl border-2 border-success bg-success-light p-5 text-center">
          <div className="mb-3 flex justify-center text-success">
            <Icon name="check" size={44} />
          </div>
          <h2 className="mb-1 text-lg font-extrabold text-ink">Hoy es día de descanso</h2>
          <p className="text-sm font-medium text-muted">
            La rutina «{activa.nombre}» no tiene entrenamiento planificado para {hoy}.
          </p>
        </section>
      ) : (
        <section className="mb-6 rounded-3xl border-2 border-primary bg-white p-5">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">Rutina de hoy</h2>
            <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-extrabold uppercase text-primary">
              {hoy}
            </span>
          </div>
          <p className="mb-4 text-sm font-medium text-muted">{activa.nombre}</p>
          <ul className="mb-5 space-y-2">
            {plan.ejercicios.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-2 rounded-2xl border-2 border-line px-3 py-2"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">
                  {p.ejercicio.nombre}
                </span>
                <span className="shrink-0 text-xs font-bold text-muted">
                  {p.series}×{p.repeticiones} · {p.peso} lbs
                </span>
              </li>
            ))}
          </ul>
          <Button full onClick={() => void start()} disabled={starting}>
            {inProgress ? 'Continuar entrenamiento' : 'Comenzar entrenamiento'}
          </Button>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-base font-extrabold text-ink">Registrar actividad</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCicliOpen(true)}
            className="flex flex-col items-center gap-2 rounded-3xl border-2 border-line bg-white p-5 transition-colors hover:border-primary"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
              <Icon name="bici" size={26} />
            </span>
            <span className="text-sm font-extrabold text-ink">Ciclismo</span>
          </button>
          <button
            onClick={() => setCorrerOpen(true)}
            className="flex flex-col items-center gap-2 rounded-3xl border-2 border-line bg-white p-5 transition-colors hover:border-primary"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
              <Icon name="correr" size={26} />
            </span>
            <span className="text-sm font-extrabold text-ink">Correr</span>
          </button>
        </div>
      </section>

      <CiclismoForm
        open={cicliOpen}
        onClose={() => setCicliOpen(false)}
        onSubmit={(input) => createCiclismo(input)}
      />
      <CorrerForm
        open={correrOpen}
        onClose={() => setCorrerOpen(false)}
        onSubmit={(input) => createCorrer(input)}
      />
    </div>
  )
}

export default Hoy