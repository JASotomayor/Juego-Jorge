import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memory Match 🃏',
  description: 'El juego de memoria más divertido. ¡Reta a tus amigos!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-game-bg font-display antialiased">
        {children}
      </body>
    </html>
  )
}
