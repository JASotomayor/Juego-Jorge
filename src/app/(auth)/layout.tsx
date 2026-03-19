export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2">🃏</div>
          <h1 className="text-3xl font-black text-purple-700">Memory Match</h1>
        </div>
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-purple-100 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
