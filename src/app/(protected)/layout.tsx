export const dynamic = 'force-dynamic'

import { Navbar } from '@/components/ui/Navbar'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20 sm:pb-0">
        {children}
      </main>
    </div>
  )
}
