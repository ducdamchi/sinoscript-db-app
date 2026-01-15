import {
  HeadContent,
  Navigate,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import appCss from '../styles.css?url'
import Header from '@/components/Header'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { supabase } from '../utils/supabase-client'
import { Spinner } from '@/components/ui/spinner'

export const Route = createRootRoute({
  component: RootLayout,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'SinoScript Database App',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootLayout() {
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await supabase.auth.getSession()
      setSession(currentSession.data.session)
      setIsLoading(false)
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      },
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-w-screen min-h-screen flex justify-center top-[40%] bg-zinc-100">
        <Spinner className="w-[4rem] h-[4rem]" />
      </div>
    )
  }

  if (!session && window.location.pathname !== '/login') {
    return <Navigate to="/login" />
  }

  return (
    <>
      {/* <Header /> */}
      <Outlet />
      <Toaster position="top-right" />
    </>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-zinc-100 text-zinc-900">
        <Header />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
