import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Chip } from '../../../components/ui/Chip'
import { ConfirmSheet } from '../../../components/ui/ConfirmSheet'
import { Header } from '../../../components/ui/Header'
import { Icon } from '../../../components/ui/Icons'
import { Input } from '../../../components/ui/Input'
import { ValidationError } from '../../../lib/validators'
import { formatFechaHora } from '../../../lib/utils'
import { useSesion } from '../hooks/useSesion'
import type { SerieRegistrada } from '../types'

interface EjercicioInputs {
  peso: string
  repeticiones: string
}

function Entrenar() {
  const { sesionId } = useParams<{ sesionId: string }>()
  const navigate = useNavigate()
  const { sesion, rutina, plan, series, lastWeights, loading, addSerie, removeSerie, completar } =
    useSesion(sesionId)

  const [inputs, setInputs] = useState<Record<string, EjercicioInputs>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirm, setConfirm] = useState(false)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    setInputs((prev) => {
      const next: Record<string, EjercicioInputs> = { ...prev }
      for (const p of plan) {
        if (!next[p.ejercicioId]) {
          next[p.ejercicioId] = { peso: '', repeticiones: '' }
        }
      }
      return next
    })
  }, [plan])

  useEffect(() => {
    setInputs((prev) => {
      const next = { ...prev }
      for (const p of plan) {
        const peso = lastWeights[p.ejercicioId]
        if (peso && !next[p.ejercicioId]?.peso) {
          next[p.ejercicioId] = {
            peso: String(peso),
            repeticiones: next[p.ejercicioId]?.repeticiones ?? '',
          }
        }
      }
      return next
    })
  }, [plan, lastWeights])

  if (loading) {
    return (
      <div className="mx-auto min-h-svh max-w-md bg-cream px-4 pt-6">
        <p className="py-10 text-center text-sm font-medium text-muted">Cargando...</p>
      </div>
    )
  }

  if (!sesion || !rutina) {
    return <Navigate to="/hoy" replace />
  }

  const seriesDe = (ejercicioId: string): SerieRegistrada[] =>
    series.filter((s) => s.ejercicioId === ejercicioId)

  const handleAddSerie = async (ejercicioId: string) => {
    setErrors((prev) => ({ ...prev, [ejercicioId]: '' }))
    const value = inputs[ejercicioId] ?? { peso: '', repeticiones: '' }
    try {
      await addSerie(ejercicioId, {
        peso: Number(value.peso),
        repeticiones: Number(value.repeticiones),
      })
    } catch (e) {
      if (e instanceof ValidationError) {
        setErrors((prev) => ({ ...prev, [ejercicioId]: Object.values(e.errors)[0] ?? '' }))
      }
    }
  }

  const handleFinish = async () => {
    setFinishing(true)
    await completar()
    navigate(`/rutinas/${sesion.rutinaId}`)
  }

  const totalSeries = series.length

  return (
    <div className="mx-auto min-h-svh max-w-md bg-cream px-4 pt-6 pb-10">
      <Header
        title={rutina.nombre}
        subtitle={formatFechaHora(sesion.fecha)}
        back
        onBack={() => navigate(`/rutinas/${sesion.rutinaId}`)}
      />

      <div className="mb-5 flex items-center justify-between rounded-3xl border-2 border-line bg-white px-4 py-3">
        <span className="text-sm font-bold text-muted">Series registradas</span>
        <span className="rounded-full bg-primary-light px-3 py-1 text-sm font-extrabold text-primary">
          {totalSeries}
        </span>
      </div>

      <div className="space-y-4">
        {plan.map((p) => {
          const ultima = lastWeights[p.ejercicioId]
          const deEjercicio = seriesDe(p.ejercicioId)
          return (
            <div key={p.ejercicioId} className="rounded-3xl border-2 border-line bg-white p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="min-w-0 flex-1 truncate text-base font-extrabold text-ink">
                  {p.ejercicio.nombre}
                </h3>
                <Chip className="pointer-events-none">
                  {p.ejercicio.grupoMuscular}
                </Chip>
              </div>
              <p className="mb-3 text-xs font-bold text-primary">
                {ultima
                  ? `Última vez: ${ultima} lbs`
                  : 'Primera vez: sin peso previo'}
              </p>

              {deEjercicio.length > 0 && (
                <ul className="mb-3 space-y-1.5">
                  {deEjercicio.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-2xl bg-cream px-3 py-2"
                    >
                      <span className="text-sm font-bold text-ink">
                        Serie {s.set}
                      </span>
                      <span className="text-sm font-semibold text-ink">
                        {s.repeticiones} reps · {s.peso} lbs
                      </span>
                      <button
                        onClick={() => void removeSerie(s.id)}
                        className="rounded-full p-1 text-muted transition-colors hover:text-error"
                        aria-label="Quitar serie"
                      >
                        <Icon name="x" size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Peso (lbs)"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.5"
                  value={inputs[p.ejercicioId]?.peso ?? ''}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [p.ejercicioId]: {
                        peso: e.target.value,
                        repeticiones: prev[p.ejercicioId]?.repeticiones ?? '',
                      },
                    }))
                  }
                  className="py-2 text-sm"
                />
                <Input
                  label="Repeticiones"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={inputs[p.ejercicioId]?.repeticiones ?? ''}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      [p.ejercicioId]: {
                        peso: prev[p.ejercicioId]?.peso ?? '',
                        repeticiones: e.target.value,
                      },
                    }))
                  }
                  className="py-2 text-sm"
                />
              </div>
              {errors[p.ejercicioId] && (
                <p className="mt-1 text-sm font-semibold text-error">{errors[p.ejercicioId]}</p>
              )}
              <Button
                variant="secondary"
                full
                className="mt-3"
                type="button"
                onClick={() => void handleAddSerie(p.ejercicioId)}
              >
                Agregar serie
              </Button>
            </div>
          )
        })}
      </div>

      <Button
        full
        className="mt-6"
        variant="success"
        onClick={() => setConfirm(true)}
      >
        Finalizar entrenamiento
      </Button>

      <ConfirmSheet
        open={confirm}
        title="¿Finalizar entrenamiento?"
        message={`Se guardarán ${totalSeries} series de ${plan.length} ejercicios en tu historial.`}
        confirmLabel="Finalizar"
        loading={finishing}
        onConfirm={() => void handleFinish()}
        onClose={() => setConfirm(false)}
      />
    </div>
  )
}

export default Entrenar