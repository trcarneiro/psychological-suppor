import React from 'react'
import { Info } from '@phosphor-icons/react'

export function BetaBanner() {
  return (
    <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm text-blue-700">
        <Info className="w-4 h-4" />
        <p>
          <strong>Modo Beta:</strong> Esta plataforma está em fase de testes. O uso é gratuito por tempo limitado.
        </p>
      </div>
    </div>
  )
}
