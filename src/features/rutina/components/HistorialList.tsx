import { Icon } from '../../../components/ui/Icons'
import { minutesToHHMM } from '../../../lib/utils'
import type { SesionHistorial } from '../types'

export function HistorialList({
  historial,
  onDeleteSesion,
}: {
  historial: SesionHistorial[]
  onDeleteSesion?: (sesion: SesionHistorial) => void
}) {
  if (historial.length === 0) {
    return (
      <p className="py-6 text-center text-sm font-medium text-muted">
        Aún no hay entrenamientos finalizados.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {historial.map(({ sesion, ejercicios }) => {
        const totalSeries = ejercicios.reduce(
          (acc, e) => acc + e.series.length,
          0,
        )
        const totalPeso = ejercicios.reduce(
          (acc, e) => acc + e.series.reduce((s, x) => s + x.peso * x.repeticiones, 0),
          0,
        )
        return (
          <li key={sesion.id} className="rounded-3xl border-2 border-line bg-white p-4">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon name="historial" size={18} className="text-primary" />
                  <div>
                    <p className="text-sm font-extrabold text-ink">
                      {new Date(sesion.completadaAt ?? sesion.fecha).toLocaleDateString(
                        'es-ES',
                        { day: '2-digit', month: 'short', year: 'numeric' },
                      )}
                    </p>
                    <p className="text-xs font-medium text-muted">
                      {new Date(sesion.completadaAt ?? sesion.fecha).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-muted">
                  {ejercicios.length} ejercicios · {totalSeries} series
                </span>
                {onDeleteSesion && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onDeleteSesion({ sesion, ejercicios })
                    }}
                    className="rounded-full p-1.5 text-muted transition-colors hover:bg-error-light hover:text-error"
                    aria-label="Eliminar entrenamiento"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                )}
              </summary>
              <div className="mt-3 space-y-3 border-t border-line pt-3">
                {ejercicios.map(({ ejercicio, series }) => (
                  <div key={ejercicio.id}>
                    <p className="text-sm font-extrabold text-ink">{ejercicio.nombre}</p>
                    <ul className="mt-1 space-y-1">
                      {series.map((s) => (
                        <li
                          key={s.id}
                          className="flex items-center justify-between text-sm font-medium text-muted"
                        >
                          <span>
                            Serie {s.set} · {s.repeticiones} reps
                          </span>
                          <span className="font-bold text-ink">{s.peso} lbs</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="flex items-center gap-1.5 text-xs font-bold text-muted">
                  <Icon name="fuego" size={14} className="text-primary" />
                  Peso total levantado: {Math.round(totalPeso)} lbs
                </p>
                <p className="text-xs font-medium text-muted">
                  Duración: {minutesToHHMM(
                    Math.max(
                      1,
                      Math.round(
                        (new Date(sesion.completadaAt ?? sesion.fecha).getTime() -
                          new Date(sesion.fecha).getTime()) /
                          60000,
                      ),
                    ),
                  )}
                </p>
              </div>
            </details>
          </li>
        )
      })}
    </ul>
  )
}