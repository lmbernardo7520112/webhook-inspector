// packages/web/src/components/DeleteConfirmationDialog.tsx
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.js'
import { type ReactNode } from 'react'

interface DeleteConfirmationDialogProps {
  children: ReactNode // O gatilho que vai abrir o diálogo
  onConfirm: () => void
}

export function DeleteConfirmationDialog({ children, onConfirm }: DeleteConfirmationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja excluir este webhook? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <button className="px-4 py-2 rounded-md bg-zinc-700 text-zinc-50 hover:bg-zinc-600">
              Cancelar
            </button>
          </DialogClose>
          {/* Adicionamos DialogClose aqui para que o modal se feche após a confirmação */}
          <DialogClose asChild>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Sim, excluir
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}