import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NoticeForm from '../../components/NoticeForm'
import { ArrowLeft, Edit3, AlertCircle, Loader2, X } from 'lucide-react'

export default function EditNotice() {
  const router = useRouter()
  const { id } = router.query

  const [notice, setNotice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiErrors, setApiErrors] = useState({})
  const [toast, setToast] = useState(null)

  // Fetch the notice by ID
  useEffect(() => {
    if (!id) return

    const fetchNotice = async () => {
      setLoading(true)
      setFetchError(null)
      try {
        const res = await fetch(`/api/notices/${id}`)
        if (res.status === 404) {
          throw new Error('Notice not found. It might have been deleted.')
        }
        if (!res.ok) {
          throw new Error('Failed to fetch notice details from server.')
        }
        const data = await res.json()
        setNotice(data)
      } catch (err) {
        console.error(err)
        setFetchError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNotice()
  }, [id])

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
      const res = await fetch(`/api/notices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          setApiErrors(data.errors)
          showToast('Please fix the validation errors below.')
        } else {
          throw new Error(data.error || 'Failed to update notice.')
        }
        return
      }

      sessionStorage.setItem('flash_message', 'Notice updated successfully!')
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
        <title>Edit Notice | Notice Board</title>
        <meta name="description" content="Modify the contents of an existing notice." />
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

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Loading Notice Details...</h3>
            <p className="text-sm text-gray-500 mt-1">Please wait while we retrieve the announcement data.</p>
          </div>
        )}

        {/* FETCH ERROR STATE */}
        {!loading && fetchError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center max-w-xl mx-auto shadow-sm">
            <div className="flex justify-center text-red-600 mb-3">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-red-900">Notice Not Found</h3>
            <p className="mt-2 text-sm text-red-700">{fetchError}</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition duration-150 active:scale-95"
            >
              Return to Dashboard
            </Link>
          </div>
        )}

        {/* FORM CONTAINER */}
        {!loading && !fetchError && notice && (
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
            {/* Header Banner */}
            <div className="bg-gradient-to-tr from-indigo-900 to-indigo-950 px-6 py-8 sm:px-10 text-white flex items-center gap-4">
              <div className="rounded-xl bg-white/10 p-2.5">
                <Edit3 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Edit Announcement</h1>
                <p className="text-sm text-indigo-200 mt-1">
                  Modify the existing notice details below and save your changes.
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="px-6 py-8 sm:p-10">
              <NoticeForm
                initialData={notice}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                apiErrors={apiErrors}
              />
            </div>
          </div>
        )}

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
