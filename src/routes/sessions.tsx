import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useFormSessions } from '../hooks/useFormSessions'

import { Button } from '@/components/ui/button'
import { CirclePlus, ArrowLeft, FileText, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/sessions')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { sessions, createSession, deleteSession } = useFormSessions()

  return (
    <div className="min-h-screen flex flex-col items-center gap-5">
      <div className="w-full max-w-[40rem]">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="hover:bg-zinc-200"
        >
          <ArrowLeft />
          Home
        </Button>
      </div>
      <h1 className="font-bold text-3xl mb-10">Your Current Sessions</h1>

      <div className="multipage-form-body">
        {/* New session button */}
        <Button
          onClick={() => {
            const sessionId = createSession()
            navigate({ to: '/select', search: { sessionId: sessionId } })
          }}
          className="w-full gap-2"
        >
          <CirclePlus className="w-4 h-4" />
          Start New Session
        </Button>

        {/* Sessions list */}
        {sessions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No saved sessions yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {sessions.length} saved session{sessions.length > 1 ? 's' : ''}:
            </p>
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-md hover:bg-zinc-50"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{session.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Updated {new Date(session.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate({
                        to: '/select',
                        search: { sessionId: session.id },
                      })
                    }
                  >
                    Resume
                  </Button>
                  <Button
                    className="hover:bg-red-700 hover:text-white"
                    size="sm"
                    variant="outline"
                    onClick={() => deleteSession(session.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
