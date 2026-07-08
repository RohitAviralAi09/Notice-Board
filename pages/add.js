import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NoticeForm from '../components/NoticeForm'
import { ArrowLeft, Megaphone, AlertCircle, X } from 'lucide-react'

export default function AddNotice() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiErrors, setApiErrors] = useState({})
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    setApiErrors({})
    setToast(null)

    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          // Validation errors from server
          setApiErrors(data.errors)
          showToast('Please fix the validation errors below.')
        } else {
          // Generic server error
          throw new Error(data.error || 'Failed to create notice.')
        }
        return
      }

      // Successful notice creation
      sessionStorage.setItem('flash_message', 'Notice created successfully!')
      router.push('/')
    } catch (err) {
      console.error(err)
      showToast(err.message || 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Create Notice | Notice Board</title>
        <meta name="description" content="Add a new notification to the board." />
      </Head>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Form Container */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          {/* Header Banner */}
          <div className="bg-gradient-to-tr from-indigo-900 to-indigo-950 px-6 py-8 sm:px-10 text-white flex items-center gap-4">
            <div className="rounded-xl bg-white/10 p-2.5">
              <Megaphone className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Create New Announcement</h1>
              <p className="text-sm text-indigo-200 mt-1">
                Fill in the details below to publish a new notice to the board.
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8 sm:p-10">
            <NoticeForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              apiErrors={apiErrors}
            />
          </div>
        </div>

      </div>

      {/* Floating Error Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-xl transition-all duration-300 transform translate-y-0 max-w-sm bg-white border-red-100 animate-slide-in">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
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
