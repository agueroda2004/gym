import { useState } from 'react'
import { ConfirmSheet } from '../../../components/ui/ConfirmSheet'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Fab } from '../../../components/ui/Fab'
import { Header } from '../../../components/ui/Header'
import { RutinaForm } from '../components/RutinaForm'
import { RutinaList } from '../components/RutinaList'
import { useRutina } from '../hooks/useRutina'
import type { Rutina } from '../types'

function RutinaPage() {
  const { rutinas, loading, create, remove, setActiva } = useRutina()
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<Rutina | null>(null)

  const handleDelete = async () => {
    if (!deleting) return
    await remove(deleting.id)
    setDeleting(null)
  }

  return (
    <div className="px-4 pt-6">
      <Header title="Rutinas" subtitle="Planifica tu semana" />

      {loading ? (
        <p className="py-10 text-center text-sm font-medium text-muted">Cargando...</p>
      ) : rutinas.length === 0 ? (
        <EmptyState
          icon="rutina"
          title="Crea tu primera rutina"
          message="Define los días que entrenas y los ejercicios de cada día."
        />
      ) : (
        <RutinaList
          rutinas={rutinas}
          onSetActiva={(r) => void setActiva(r.id)}
          onDelete={setDeleting}
        />
      )}

      <Fab onClick={() => setFormOpen(true)} />

      <RutinaForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(input) => create(input)}
      />

      <ConfirmSheet
        open={deleting !== null}
        title="Eliminar rutina"
        message={`¿Seguro que quieres eliminar "${deleting?.nombre}"? Se borrarán sus días, ejercicios e historial.`}
        confirmLabel="Eliminar"
        danger
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}

export default RutinaPage