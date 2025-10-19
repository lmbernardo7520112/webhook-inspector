// packages/web/src/components/DeleteConfirmationDialog.tsx
import * as Dialog from '@radix-ui/react-dialog'
import { type ReactNode } from 'react'

interface DeleteConfirmationDialogProps {
  children: ReactNode // O botão que vai abrir o diálogo
  onConfirm: () => void
}

export function DeleteConfirmationDialog({ children, onConfirm }: DeleteConfirmationDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-bold">
            Confirmar Exclusão
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            Você tem certeza que deseja excluir este webhook? Esta ação não pode ser desfeita.
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-4">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
                Cancelar
              </button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Sim, excluir
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}