import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { supabase } from '../utils/supabase-client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const navigate = useNavigate()
  const logOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-w-screen flex justify-center">
      <div className="w-[50%] max-w-[30rem] min-w-[20rem] flex flex-col items-center justify-center gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            navigate({ to: '/sessions' })
          }}
        >
          Add/Edit Text
        </Button>
        <Button variant="outline" className="w-full" onClick={() => logOut()}>
          Log Out
        </Button>
      </div>
    </div>
  )
}
