import { createFileRoute } from '@tanstack/react-router'
import LogInForm from '@/components/LogInForm'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen flex flex-col items-center gap-10">
      <LogInForm />
    </div>
  )
}
