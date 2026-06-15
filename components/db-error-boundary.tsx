'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

interface DbErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function DbErrorBoundary({ children, fallback }: DbErrorBoundaryProps) {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('Supabase') || event.error?.message?.includes('database')) {
        console.error('[v0] Database connection error:', event.error)
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  return (
    <>
      {children}
      {fallback && (
        <div className="hidden" id="db-error-fallback">
          {fallback}
        </div>
      )}
    </>
  )
}

export function DatabaseDownMessage() {
  return (
    <div className="min-h-screen bg-foreground text-background flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold">Service Temporarily Unavailable</h1>
        <p className="text-background/70">
          We&apos;re experiencing database connectivity issues. Our team has been notified and is working on a fix.
        </p>
        <p className="text-sm text-background/60">
          Please try refreshing the page in a few moments, or contact us at{' '}
          <a href="mailto:info@casantevents.com" className="text-primary hover:underline">
            info@casantevents.com
          </a>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Refresh Page
        </button>
      </div>
    </div>
  )
}
