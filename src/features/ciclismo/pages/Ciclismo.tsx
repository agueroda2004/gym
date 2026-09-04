import { useState } from 'react'
import { ConfirmSheet } from '../../../components/ui/ConfirmSheet'
import { EmptyState } from '../../../components/ui/EmptyState'
import { Fab } from '../../../components/ui/Fab'
import { CiclismoForm } from '../components/CiclismoForm'
import { CiclismoList } from '../components/CiclismoList'
import { useCiclismo } from '../hooks/useCiclismo'
import type { Ciclismo } from '../types'

export function CiclismoPage() {
  const { ciclismos, loading, create, update, remove } = useCiclismo()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Ciclismo | null>(null)
  const [deleting, setDeleting] = useState<Ciclismo | null>(null)

  const handleDelete = async () => {
    if (!deleting) return
    await remove(deleting.id)
    setDeleting(null)
  }

  return (
    <div>
      {loading ? (
        <p className="py-10 text-center text-sm font-medium text-muted">Cargando...</p>
      ) : ciclismos.length === 0 ? (
        <EmptyState
          icon="bici"
          title="Sin registros de ciclismo"
          message="Registra tus rutas en bici para llevar tu historial."
        />
      ) : (
        <CiclismoList
          registros={ciclismos}
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

      <CiclismoForm
        open={formOpen}
        registro={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={(input) => (editing ? update(editing.id, input) : create(input))}
      />

      <ConfirmSheet
        open={deleting !== null}
        title="Eliminar registro"
        message="¿Seguro que quieres eliminar este registro de ciclismo?"
        confirmLabel="Eliminar"
        danger
        onConfirm={() => void handleDelete()}
        onClose={() => setDeleting(null)}
      />
    </div>
  )
}