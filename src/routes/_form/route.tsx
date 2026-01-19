import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_form')({
  validateSearch: (search: Record<string, unknown>) => ({
    sessionId: search.sessionId as string,
    textAction: search.textAction as 'edit' | 'create' | undefined,
    authorAction: search.authorAction as 'edit' | 'create' | undefined,
    textId: search.textId as string | undefined,
    authorId: search.authorId as string | undefined,
  }),

  //Runs before route loads, makes sessionId available to all child routes via context
  beforeLoad: ({ search }) => {
    return {
      sessionId: search.sessionId,
      textAction: search.textAction as 'edit' | 'create' | undefined,
      authorAction: search.authorAction as 'edit' | 'create' | undefined,
      textId: search.textId as string | undefined,
      authorId: search.authorId as string | undefined,
    }
  },

  component: FormLayout,
})

function FormLayout() {
  return <Outlet />
}
