import { useState, useEffect } from 'react'
import Head from 'next/head'
import NoticeCard from '../components/NoticeCard'
import DeleteModal from '../components/DeleteModal'
import { Megaphone, Search, AlertCircle, RefreshCw, CheckCircle, X } from 'lucide-react'

export default function Home() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [noticeToDelete, setNoticeToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Toast Notification State
  const [toast, setToast] = useState(null)

  // Fetch notices from API
  const fetchNotices = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/notices')
      if (!res.ok) {
        throw new Error('Failed to load notices from server')
      }
      const data = await res.json()
      setNotices(data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong while fetching notices.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
    
    // Check if redirect has success message in sessionStorage
    const flashMessage = sessionStorage.getItem('flash_message')
    if (flashMessage) {
      showToast(flashMessage)
      sessionStorage.removeItem('flash_message')
    }
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Handle Delete Confirmation
  const handleDeleteClick = (id) => {
    setNoticeToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!noticeToDelete) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/notices/${noticeToDelete}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) {
        throw new Error('Failed to delete notice')
      }

      // Remove deleted notice from state
      setNotices((prev) => prev.filter((item) => item.id !== noticeToDelete))
      showToast('Notice deleted successfully')
    } catch (err) {
      console.error(err)
      showToast(err.message || 'Error occurred during deletion', 'error')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setNoticeToDelete(null)
    }
  }

  // Filter Notices
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.body.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'All' || notice.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Head>
        <title>Notice Board | Campus & Corporate Announcements</title>
        <meta name="description" content="Stay informed with real-time updates on examinations, events, and general notices." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-3xl bg-indigo-950 px-6 py-12 shadow-xl sm:px-12 sm:py-16 md:px-16 mb-10">
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              Notice Board
            </h1>
            <p className="mt-4 text-base text-indigo-200 leading-relaxed">
              Welcome to the central notice hub. Get official notifications regarding upcoming exams, events, and general guidelines. Urgent matters are pinned at the top.
            </p>

            {/* Stats widgets */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 relative z-10">
              <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 transition duration-300 hover:bg-white/10">
                <span className="block text-2xl font-bold text-white">{notices.length}</span>
                <span className="block text-xs font-semibold text-indigo-200 mt-1">Total Notices</span>
              </div>
              <div className="rounded-2xl bg-rose-500/10 backdrop-blur-md border border-rose-500/20 p-4 transition duration-300 hover:bg-rose-500/20">
                <span className="block text-2xl font-bold text-rose-400">{notices.filter(n => n.priority === 'Urgent').length}</span>
                <span className="block text-xs font-semibold text-rose-200 mt-1">Urgent Pinned</span>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 transition duration-300 hover:bg-white/10">
                <span className="block text-2xl font-bold text-white">{notices.filter(n => n.category === 'Exam').length}</span>
                <span className="block text-xs font-semibold text-indigo-200 mt-1">Exam Schedules</span>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 transition duration-300 hover:bg-white/10">
                <span className="block text-2xl font-bold text-white">{notices.filter(n => n.category === 'Event').length}</span>
                <span className="block text-xs font-semibold text-indigo-200 mt-1">Campus Events</span>
              </div>
            </div>
          </div>
          {/* Decorative Background Glows */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl"></div>
        </section>

        {/* Filters and Search Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/80 pb-6 mb-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {['All', 'General', 'Exam', 'Event'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat === 'All' ? 'All Notices' : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative max-w-md w-full sm:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4.5 w-4.5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

        </div>

        {/* Primary Content States */}

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm animate-pulse">
                <div className="h-44 bg-slate-200"></div>
                <div className="flex-1 p-5 space-y-4">
                  <div className="flex gap-4">
                    <div className="h-5 w-16 bg-slate-200 rounded"></div>
                    <div className="h-5 w-24 bg-slate-200 rounded"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                    <div className="h-8 w-16 bg-slate-200 rounded"></div>
                    <div className="h-8 w-16 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center max-w-xl mx-auto shadow-sm">
            <div className="flex justify-center text-red-600 mb-3">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-red-900">Failed to Load Notices</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <button
              onClick={fetchNotices}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition duration-150 active:scale-95"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && filteredNotices.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center max-w-md mx-auto">
            <div className="flex justify-center text-indigo-500/80 mb-4">
              <Megaphone className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Notices Found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm || selectedCategory !== 'All'
                ? "We couldn't find any announcements matching your current search or filters."
                : "No announcements have been published yet. Be the first to publish a notice!"}
            </p>
            {(searchTerm || selectedCategory !== 'All') ? (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
                className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Clear Search & Filters
              </button>
            ) : (
              <a
                href="/add"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition duration-150"
              >
                Create Notice
              </a>
            )}
          </div>
        )}

        {/* NOTICES GRID */}
        {!loading && !error && filteredNotices.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        )}

      </div>

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setNoticeToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
      />

      {/* FLOATING SUCCESS/ERROR TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-xl transition-all duration-300 transform translate-y-0 max-w-sm bg-white border-gray-100 animate-slide-in">
          {toast.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          )}
          <div className="flex-1 text-sm font-medium text-gray-800">
            {toast.message}
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  )
}
