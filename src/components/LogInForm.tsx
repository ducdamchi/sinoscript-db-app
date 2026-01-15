import { useState, FormEvent, ChangeEvent } from 'react'
import { supabase } from '../utils/supabase-client'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export default function LogInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Error signing up:', error.message)
      toast.error(error.message || 'Error logging in. Please try again.')
    } else {
      toast.success('Logged in successfully!')
      navigate({ to: '/' })
    }
  }

  return (
    <div className="flex flex-col items-center p-6 gap-3 w-[30rem] rounded-md ">
      <h2>Only admins have access to this portal.</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-2 w-full mt-10"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          className="w-full border-1 p-2 rounded-md border-zinc-400/70"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className="w-full border-1 p-2 rounded-md border-zinc-400/70"
        />
        <button
          type="submit"
          className="w-full border-1 p-2 rounded-md border-zinc-400/70 bg-zinc-900 text-zinc-100 transition-all ease-out duration-200"
        >
          Log In
        </button>
      </form>
      <h2 className="italic text-zinc-400 mt-10">
        For any inquiry, contact sinoscript.org@gmail.com
      </h2>
    </div>
  )
}
