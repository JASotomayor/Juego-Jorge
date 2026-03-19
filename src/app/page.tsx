import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center
      bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 px-4">

      {/* Hero */}
      <div className="text-center max-w-xl">
        <div className="text-8xl mb-4 animate-bounce">🃏</div>
        <h1 className="text-5xl sm:text-6xl font-black text-purple-700 text-shadow mb-3">
          Memory Match
        </h1>
        <p className="text-xl text-gray-600 font-semibold mb-8">
          El juego de memoria más divertido.<br />
          <span className="text-pink-500">¡Reta a tus amigos y escala el ranking!</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/register"
            className="px-8 py-4 rounded-3xl bg-gradient-to-r from-purple-500 to-violet-600
              text-white font-black text-xl shadow-lg hover:scale-105 transition-transform"
          >
            🚀 ¡Empezar gratis!
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 rounded-3xl border-2 border-purple-400
              text-purple-700 font-black text-xl hover:bg-purple-50 transition"
          >
            Iniciar sesión
          </Link>
        </div>
        <Link
          href="/demo"
          className="mt-3 text-sm text-purple-500 font-bold hover:underline"
        >
          🎮 Probar sin cuenta
        </Link>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-2xl w-full">
        {[
          { icon: '🎮', text: '5 mazos temáticos' },
          { icon: '🏆', text: 'Ranking global' },
          { icon: '⚔️', text: 'Retos entre amigos' },
          { icon: '📊', text: 'Tus estadísticas' },
        ].map(({ icon, text }) => (
          <div
            key={text}
            className="bg-white/70 rounded-2xl p-4 text-center shadow-sm border border-purple-100"
          >
            <div className="text-3xl mb-1">{icon}</div>
            <p className="text-sm font-bold text-gray-700">{text}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 text-xs text-gray-400 font-medium">
        Emojis de código abierto · Gratis para siempre
      </p>
    </main>
  )
}
