// packages/web/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css' // <-- GARANTA QUE ESTA LINHA ESTEJA AQUI E PERTO DO TOPO

import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
