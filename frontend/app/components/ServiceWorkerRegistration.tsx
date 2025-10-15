'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado exitosamente:', registration.scope)
        })
        .catch((error) => {
          console.warn('Error al registrar Service Worker:', error)
        })
    }
  }, [])

  return null
}
