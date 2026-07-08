import Link from 'next/link'
import { Calendar, Tag, AlertTriangle, Edit2, Trash2 } from 'lucide-react'

export default function NoticeCard({ notice, onDeleteClick }) {
  const { id, title, body, category, priority, publishDate, image } = notice

  // Format the publish date nicely
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch (e) {
      return dateString
    }
  }

  // Get Priority Badge Color Scheme
  const isUrgent = priority === 'Urgent'
  const priorityBadgeStyle = isUrgent
    ? 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10'
    : 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10'

  // Get Category Badge Color Scheme
  const getCategoryStyle = (cat) => {
    switch (cat) {
      case 'Exam':
        return 'bg-amber-50 text-amber-800 border-amber-200'
      case 'Event':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200'
      default: // General
        return 'bg-blue-50 text-blue-800 border-blue-200'
    }
  }

  // Get Category Specific Header Gradient & Icon
  const renderCardHeader = () => {
    if (image && image.trim() !== '') {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = ''
            e.target.className = 'hidden'
            e.target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-500', 'to-violet-600')
          }}
        />
      )
    }

    // Gradient Fallback based on category
    switch (category) {
      case 'Exam':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center p-4">
            <span className="h-24 w-24 text-white/10 absolute -right-2 -bottom-2 transform rotate-12 select-none font-bold text-7xl">EXAM</span>
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Calendar className="h-7 w-7" />
            </div>
          </div>
        )
      case 'Event':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center p-4">
            <span className="h-24 w-24 text-white/10 absolute -right-2 -bottom-2 transform rotate-12 select-none font-bold text-7xl">FEST</span>
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <Tag className="h-7 w-7" />
            </div>
          </div>
        )
      default: // General
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center p-4">
            <span className="h-24 w-24 text-white/10 absolute -right-2 -bottom-2 transform rotate-12 select-none font-bold text-6xl">INFO</span>
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
              <AlertTriangle className="h-7 w-7" />
            </div>
          </div>
        )
    }
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-gray-200/80">
      
      {/* Notice Card Header (Image or dynamic gradient placeholder) */}
      <div className="relative h-44 w-full overflow-hidden">
        {renderCardHeader()}
        
        {/* Priority Badge Overlay */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md ring-1 ring-inset bg-white/95 text-gray-900 border-gray-100">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></span>
          {priority}
        </div>
      </div>

      {/* Notice Content */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Category & Date Metadata */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${getCategoryStyle(category)}`}>
            <Tag className="h-3 w-3" />
            {category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(publishDate)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
          {title}
        </h3>

        {/* Body Description */}
        <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap mb-6 flex-1">
          {body}
        </p>

        {/* Action buttons (Footer) */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-4 mt-auto">
          <Link
            href={`/edit/${id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 active:scale-95"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </Link>
          <button
            onClick={() => onDeleteClick(id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-100 hover:text-red-700 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>

      </div>
    </article>
  )
}
