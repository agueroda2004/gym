import { useState } from 'react'
import { ConfirmSheet } from '../../../components/ui/ConfirmSheet'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Fab } from '../../../components/ui/Fab'
import { CorrerForm } from '../components/CorrerForm'
import { CorrerList } from '../components/CorrerList'
import { useCorrer } from '../hooks/useCorrer'
import type { Correr } from '../types'

export function CorrerPage() {
  const { corridas, loading, create, update, remove } = useCorrer()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Correr | null>(null)
  const [deleting, setDeleting] = useState<Correr | null>(null)

  const handleDelete = async () => {
    if (!deleting) return
    await remove(deleting.id)
    setDeleting(null)
  }

  return (
    <div>
      {loading ? (
        <p className="py-10 text-center text-sm font-medium text-muted">Cargando...</p>
      ) : corridas.length === 0 ? (
        <EmptyState
          icon="correr"
          title="Sin carreras registradas"
          message="Registra tus carreras para llevar tu historial."
        />
      ) : (
        <CorrerList
          registros={corridas}
          onEdit={(r) => {
            setEditing(r)
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

      <CorrerForm
        open={formOpen}
        registro={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={(input) => (editing ? update(editing.id, input) : create(input))}
      />

      <ConfirmSheet
        open={deleting !== null}
        title="Eliminar registro"
        message="¿Seguro que quieres eliminar este registro de carrera?"
        confirmLabel="Eliminar"
        danger
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}