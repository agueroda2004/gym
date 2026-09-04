import { useState } from 'react'
import { ConfirmSheet } from '../../../components/ui/ConfirmSheet'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Fab } from '../../../components/ui/Fab'
import { Header } from '../../../components/ui/Header'
import type { GrupoMuscular } from '../../../lib/constants'
import { EjercicioFilters } from '../components/EjercicioFilters'
import { EjercicioForm } from '../components/EjercicioForm'
import { EjercicioList } from '../components/EjercicioList'
import { useEjercicio } from '../hooks/useEjercicio'
import type { Ejercicio } from '../types'

function EjercicioPage() {
  const { ejercicios, loading, create, update, remove } = useEjercicio()
  const [search, setSearch] = useState('')
  const [grupo, setGrupo] = useState<GrupoMuscular | ''>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Ejercicio | null>(null)
  const [deleting, setDeleting] = useState<Ejercicio | null>(null)

  const filtered = ejercicios.filter(
    (e) =>
      (grupo === '' || e.grupoMuscular === grupo) &&
      e.nombre.toLowerCase().includes(search.trim().toLowerCase()),
  )

  const handleDelete = async () => {
    if (!deleting) return
    await remove(deleting.id)
    setDeleting(null)
  }

  return (
    <div className="px-4 pt-6">
      <Header title="Ejercicios" subtitle="Tu catálogo de ejercicios" />

      <EjercicioFilters search={search} onSearch={setSearch} grupo={grupo} onGrupo={setGrupo} />

      {loading ? (
        <p className="py-10 text-center text-sm font-medium text-muted">Cargando...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="musculo"
          title={ejercicios.length === 0 ? 'Crea tu primer ejercicio' : 'Sin resultados'}
          message={
            ejercicios.length === 0
              ? 'Agrega ejercicios para usarlos en tus rutinas.'
              : 'Prueba con otro nombre o grupo muscular.'
          }
        />
      ) : (
        <EjercicioList
          ejercicios={filtered}
          onEdit={(e) => {
            setEditing(e)
            setFormOpen(true)
          }}
          onDelete={setDeleting}
        />
      )}

      <Fab
        onClick={() => {
          setEditing(null)
          setFormOpen(true)
        }}
      />

      <EjercicioForm
        open={formOpen}
        ejercicio={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={(input) => (editing ? update(editing.id, input) : create(input))}
      />

      <ConfirmSheet
        open={deleting !== null}
        title="Eliminar ejercicio"
        message={`¿Seguro que quieres eliminar "${deleting?.nombre}"?`}
        confirmLabel="Eliminar"
        danger
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}

export default EjercicioPage