import Link from 'next/link'
import { useRouter } from 'next/router'
import { Plus, Bell } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-between rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 text-white shadow-md shadow-indigo-100 transition-all duration-300 group-hover:scale-105">
            <Bell className="h-6 w-6 animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-indigo-950 to-violet-950 bg-clip-text text-transparent sm:block">
            NoticeBoard
          </span>
        </Link>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/add"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
              router.pathname === '/add'
                ? 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>New Notice</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
