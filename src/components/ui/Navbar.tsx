'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { getAvatarUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard',  icon: '🏠', label: 'Inicio' },
  { href: '/play',       icon: '🎮', label: 'Jugar' },
  { href: '/ranking',    icon: '🏆', label: 'Ranking' },
  { href: '/friends',    icon: '👫', label: 'Amigos' },
  { href: '/challenges', icon: '⚔️',  label: 'Retos' },
]

export function Navbar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()

  return (
    <>
      {/* Top bar — desktop */}
      <nav className="hidden sm:flex items-center justify-between px-6 py-3
        bg-white/90 backdrop-blur border-b border-purple-100 shadow-sm sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2 font-black text-xl text-purple-700">
          🃏 Memory Match
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm transition',
                pathname.startsWith(item.href)
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition">
            <Image
              src={getAvatarUrl(profile?.avatar_url ?? null, profile?.username ?? 'user')}
              alt="Mi perfil"
              width={36}
              height={36}
              className="rounded-full border-2 border-purple-300"
            />
            <span className="font-bold text-sm text-gray-700 hidden lg:block">
              {profile?.username}
            </span>
          </Link>
          <button
            onClick={signOut}
            className="text-xs text-gray-400 hover:text-red-500 transition font-bold px-2"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* Bottom bar — mobile */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40
        bg-white/95 backdrop-blur border-t border-purple-100 shadow-lg">
        <div className="flex justify-around items-center py-2">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition',
                pathname.startsWith(item.href) ? 'text-purple-600' : 'text-gray-400'
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          ))}
          <Link href="/profile" className="flex flex-col items-center gap-0.5 px-3 py-1">
            <Image
              src={getAvatarUrl(profile?.avatar_url ?? null, profile?.username ?? 'user')}
              alt="Perfil"
              width={28}
              height={28}
              className="rounded-full border-2 border-purple-300"
            />
            <span className="text-[10px] font-bold text-gray-400">Yo</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
