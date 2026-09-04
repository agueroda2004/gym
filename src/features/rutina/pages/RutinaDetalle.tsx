import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Chip } from '../../../components/ui/Chip'
import { ConfirmSheet } from '../../../components/ui/ConfirmSheet'
import { Header } from '../../../components/ui/Header'
import { Icon } from '../../../components/ui/Icons'
import { diaDeHoy } from '../../../lib/utils'
import { useNotification } from '../../notifications/hooks/useNotification'
import { HistorialList } from '../components/HistorialList'
import { RutinaForm, type RutinaFormValues } from '../components/RutinaForm'
import { useRutina } from '../hooks/useRutina'
import {
  crearSesion,
  deleteSesion,
  getRutinaCompleta,
  getSesionEnProgreso,
  getSesionesCompletadas,
} from '../service/Rutina.service'
import type { RutinaCompleta, Sesion, SesionHistorial } from '../types'

function toFormValues(completa: RutinaCompleta): RutinaFormValues {
  return {
    nombre: completa.rutina.nombre,
    dias: completa.dias.map((d) => ({
      diaSemana: d.entrenamiento.diaSemana,
      ejercicios: d.ejercicios.map(({ data, ejercicio }) => ({
        ejercicioId: ejercicio.id,
        nombre: ejercicio.nombre,
        series: String(data.series),
        repeticiones: String(data.repeticiones),
        peso: data.peso ? String(data.peso) : '',
        descanso: String(data.descanso),
      })),
    })),
  }
}

function RutinaDetalle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const notify = useNotification()
  const { update, remove, setActiva } = useRutina()

  const [completa, setCompleta] = useState<RutinaCompleta | null>(null)
  const [inProgress, setInProgress] = useState<Sesion | null>(null)
  const [historial, setHistorial] = useState<SesionHistorial[]>([])
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmDeleteSesion, setConfirmDeleteSesion] = useState<SesionHistorial | null>(null)
  const [starting, setStarting] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      setCompleta(await getRutinaCompleta(id))
      setInProgress((await getSesionEnProgreso(id)) ?? null)
      setHistorial(await getSesionesCompletadas(id))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const rutina = completa?.rutina
  const hoy = diaDeHoy()
  const planHoy = completa?.dias.find((d) => d.entrenamiento.diaSemana === hoy)

  const start = async () => {
    if (!id || !planHoy || !rutina) return
    setStarting(true)
    try {
      if (inProgress) {
        navigate(`/entrenar/${inProgress.id}`)
        return
      }
      const sesion = await crearSesion(id, planHoy.entrenamiento.id)
      navigate(`/entrenar/${sesion.id}`)
    } finally {
      setStarting(false)
    }
  }

  const handleDelete = async () => {
    if (!rutina) return
    await remove(rutina.id)
    navigate('/rutinas')
  }

  const handleDeleteSesion = async () => {
    if (!confirmDeleteSesion) return
    const sesion = confirmDeleteSesion.sesion
    await deleteSesion(sesion.id)
    notify.success('Entrenamiento eliminado')
    setConfirmDeleteSesion(null)
    await load()
  }

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <p className="py-10 text-center text-sm font-medium text-muted">Cargando...</p>
      </div>
    )
  }

  if (!rutina || !completa) {
    return (
      <div className="px-4 pt-6">
        <Header title="Rutina" back onBack={() => navigate('/rutinas')} />
        <p className="py-10 text-center text-sm font-medium text-muted">Rutina no encontrada.</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-8">
      <Header
        title={rutina.nombre}
        subtitle="Detalle de rutina"
        back
        onBack={() => navigate('/rutinas')}
        action={
          <button
            onClick={() => setEditOpen(true)}
            className="rounded-full border-2 border-line bg-white p-2 text-ink transition-colors hover:border-primary"
            aria-label="Editar rutina"
          >
            <Icon name="edit" size={18} />
          </button>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <Chip className="pointer-events-none" active={rutina.activa}>
          {rutina.activa ? 'Rutina activa' : 'Inactiva'}
        </Chip>
        <button
          onClick={() => void setActiva(rutina.id)}
          className="rounded-full border-2 border-line bg-white px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:border-primary hover:text-primary"
        >
          {rutina.activa ? 'Quitar activa' : 'Marcar como activa'}
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="rounded-full border-2 border-line bg-white p-1.5 text-muted transition-colors hover:border-error hover:text-error"
          aria-label="Eliminar rutina"
        >
          <Icon name="trash" size={16} />
        </button>
      </div>

      <section className="mb-6 rounded-3xl border-2 border-line bg-white p-4">
        <h2 className="mb-3 text-base font-extrabold text-ink">Hoy</h2>
        {planHoy ? (
          <>
            <ul className="mb-4 space-y-2">
              {planHoy.ejercicios.map(({ data, ejercicio }) => (
                <li
                  key={data.id}
                  className="flex items-center justify-between gap-2 rounded-2xl border-2 border-line px-3 py-2"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">
                    {ejercicio.nombre}
                  </span>
                  <span className="shrink-0 text-xs font-bold text-muted">
                    {data.series}×{data.repeticiones} · {data.peso} lbs
                  </span>
                </li>
              ))}
            </ul>
            <Button full onClick={() => void start()} disabled={starting}>
              {inProgress ? 'Continuar entrenamiento' : 'Comenzar entrenamiento'}
            </Button>
          </>
        ) : (
          <p className="text-sm font-medium text-muted">
            Hoy ({hoy}) no hay entrenamiento planificado en esta rutina.
          </p>
        )}
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-base font-extrabold text-ink">Plan semanal</h2>
        <div className="space-y-2">
          {completa.dias.map((d) => {
            const esHoy = d.entrenamiento.diaSemana === hoy
            return (
              <div
                key={d.entrenamiento.id}
                className={`rounded-3xl border-2 p-4 ${
                  esHoy ? 'border-primary bg-primary-light' : 'border-line bg-white'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-ink">
                    {d.entrenamiento.diaSemana}
                  </h3>
                  {esHoy && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                      Hoy
                    </span>
                  )}
                </div>
                {d.ejercicios.length === 0 ? (
                  <p className="text-sm font-medium text-muted">Sin ejercicios</p>
                ) : (
                  <ul className="space-y-1">
                    {d.ejercicios.map(({ data, ejercicio }) => (
                      <li key={data.id} className="flex justify-between gap-2 text-sm">
                        <span className="min-w-0 flex-1 truncate font-semibold text-ink">
                          {ejercicio.nombre}
                        </span>
                        <span className="shrink-0 font-medium text-muted">
                          {data.series}×{data.repeticiones} · {data.peso} lbs · {data.descanso}s
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-ink">
          <Icon name="historial" size={18} className="text-primary" />
          Historial
        </h2>
        <HistorialList
          historial={historial}
          onDeleteSesion={setConfirmDeleteSesion}
        />
      </section>

      <RutinaForm
        open={editOpen}
        rutina={rutina}
        initial={toFormValues(completa)}
        onClose={() => setEditOpen(false)}
        onSubmit={(input) => update(rutina.id, input)}
      />

      <ConfirmSheet
        open={confirmDelete}
        title="Eliminar rutina"
        message={`¿Seguro que quieres eliminar "${rutina.nombre}"? Se borrarán sus días, ejercicios e historial.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={() => void handleDelete()}
        onClose={() => setConfirmDelete(false)}
      />

      <ConfirmSheet
        open={confirmDeleteSesion !== null}
        title="Eliminar entrenamiento"
        message={
          confirmDeleteSesion
            ? `¿Eliminar el entrenamiento del ${new Date(
                confirmDeleteSesion.sesion.completadaAt ?? confirmDeleteSesion.sesion.fecha,
              ).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}? Se borrarán también sus series registradas.`
            : ''
        }
        confirmLabel="Eliminar"
        danger
        onConfirm={() => void handleDeleteSesion()}
        onClose={() => setConfirmDeleteSesion(null)}
      />
    </div>
  )
}

export default RutinaDetalle