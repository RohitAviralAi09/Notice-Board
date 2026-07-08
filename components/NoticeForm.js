import { useState } from 'react'
import { Calendar, Tag, AlertCircle, Image as ImageIcon, Send, Loader2, FileText, Sparkles, Bell } from 'lucide-react'

export default function NoticeForm({ initialData = {}, onSubmit, isSubmitting, apiErrors = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    body: initialData.body || '',
    category: initialData.category || 'General',
    priority: initialData.priority || 'Normal',
    publishDate: initialData.publishDate
      ? new Date(initialData.publishDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    image: initialData.image || '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const tempErrors = {}
    if (!formData.title.trim()) {
      tempErrors.title = 'Title is required'
    }
    if (!formData.body.trim()) {
      tempErrors.body = 'Body is required'
    }
    if (!formData.category) {
      tempErrors.category = 'Category is required'
    }
    if (!formData.priority) {
      tempErrors.priority = 'Priority is required'
    }
    if (!formData.publishDate) {
      tempErrors.publishDate = 'Publish date is required'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const allErrors = { ...errors, ...apiErrors }

  // Preview styling helpers
  const isUrgent = formData.priority === 'Urgent'
  const getCategoryStyle = (cat) => {
    switch (cat) {
      case 'Exam':
        return 'bg-amber-50 text-amber-800 border-amber-200'
      case 'Event':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200'
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
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

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
      {/* Form Fields Column */}
      <div className="lg:col-span-3">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold leading-6 text-gray-900">
              Notice Title <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Midterm Examination Schedule Announcement"
                className={`block w-full rounded-xl border-0 px-4 py-3 text-gray-900 ring-1 ring-inset transition-all duration-200 placeholder:text-gray-400 focus:ring-4 sm:text-sm sm:leading-6 ${
                  allErrors.title
                    ? 'ring-red-300 focus:ring-red-500/20 focus:border-red-500 border-red-500'
                    : 'ring-gray-200 focus:ring-indigo-600/20 focus:border-indigo-600'
                }`}
              />
            </div>
            {allErrors.title && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {allErrors.title}
              </p>
            )}
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-semibold leading-6 text-gray-900">
              Notice Body <span className="text-red-500">*</span>
            </label>
            <div className="mt-2">
              <textarea
                name="body"
                id="body"
                rows={5}
                value={formData.body}
                onChange={handleChange}
                placeholder="Type your notice announcement details here..."
                className={`block w-full rounded-xl border-0 px-4 py-3 text-gray-900 ring-1 ring-inset transition-all duration-200 placeholder:text-gray-400 focus:ring-4 sm:text-sm sm:leading-6 ${
                  allErrors.body
                    ? 'ring-red-300 focus:ring-red-500/20 focus:border-red-500 border-red-500'
                    : 'ring-gray-200 focus:ring-indigo-600/20 focus:border-indigo-600'
                }`}
              />
            </div>
            {allErrors.body && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {allErrors.body}
              </p>
            )}
          </div>

          {/* Grid for Dropdowns & Picker */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Category Dropdown */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold leading-6 text-gray-900">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 transition-all duration-200 focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="General">General</option>
                  <option value="Exam">Exam</option>
                  <option value="Event">Event</option>
                </select>
              </div>
            </div>

            {/* Priority Dropdown */}
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold leading-6 text-gray-900">
                Priority <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-0 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 transition-all duration-200 focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Publish Date Picker */}
            <div>
              <label htmlFor="publishDate" className="block text-sm font-semibold leading-6 text-gray-900">
                Publish Date <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="publishDate"
                  id="publishDate"
                  value={formData.publishDate}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border-0 px-4 py-3 text-gray-900 ring-1 ring-inset transition-all duration-200 focus:ring-4 sm:text-sm sm:leading-6 ${
                    allErrors.publishDate
                      ? 'ring-red-300 focus:ring-red-500/20 focus:border-red-500 border-red-500'
                      : 'ring-gray-200 focus:ring-indigo-600/20 focus:border-indigo-600'
                  }`}
                />
              </div>
              {allErrors.publishDate && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {allErrors.publishDate}
                </p>
              )}
            </div>
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold leading-6 text-gray-900">
              Image URL <span className="text-xs text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <ImageIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="url"
                name="image"
                id="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="block w-full rounded-xl border-0 py-3 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 transition-all duration-200 placeholder:text-gray-400 focus:ring-4 focus:ring-indigo-600/20 focus:border-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 transition duration-200 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-75 disabled:pointer-events-none active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Publish Notice
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Live Preview Column */}
      <div className="lg:col-span-2 flex flex-col justify-start">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Live Preview</h3>
          </div>

          {/* Notice Card Replica */}
          <div className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-md transition-all duration-300">
            {/* Image/Gradient Header */}
            <div className="relative h-44 w-full overflow-hidden">
              {formData.image.trim() !== '' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.image}
                  alt={formData.title || 'Preview'}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              ) : formData.category === 'Exam' ? (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center p-4">
                  <span className="h-24 w-24 text-white/10 absolute -right-2 -bottom-2 transform rotate-12 select-none font-bold text-7xl">EXAM</span>
                  <div className="h-14 w-14 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
                    <Calendar className="h-7 w-7" />
                  </div>
                </div>
              ) : formData.category === 'Event' ? (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center p-4">
                  <span className="h-24 w-24 text-white/10 absolute -right-2 -bottom-2 transform rotate-12 select-none font-bold text-7xl">FEST</span>
                  <div className="h-14 w-14 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
                    <Tag className="h-7 w-7" />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 flex items-center justify-center p-4">
                  <span className="h-24 w-24 text-white/10 absolute -right-2 -bottom-2 transform rotate-12 select-none font-bold text-6xl">INFO</span>
                  <div className="h-14 w-14 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
                    <AlertCircle className="h-7 w-7" />
                  </div>
                </div>
              )}

              {/* Priority Badge Overlay */}
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md ring-1 ring-inset bg-white/95 text-gray-900 border-gray-100">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></span>
                {formData.priority}
              </div>
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col p-5">
              {/* Category & Date Metadata */}
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${getCategoryStyle(formData.category)}`}>
                  <Tag className="h-3 w-3" />
                  {formData.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(formData.publishDate)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2">
                {formData.title.trim() || 'Notice Title Preview'}
              </h3>

              {/* Body */}
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap mb-6 flex-1 min-h-[3.5rem] max-h-48 overflow-y-auto">
                {formData.body.trim() || 'Notice body contents will preview here...'}
              </p>

              {/* Action Buttons Mockup */}
              <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-4 mt-auto">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-150 bg-gray-50/50 px-3 py-1.5 text-xs font-semibold text-gray-400 shadow-sm cursor-not-allowed">
                  Edit
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-50 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-red-300 shadow-sm cursor-not-allowed">
                  Delete
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
