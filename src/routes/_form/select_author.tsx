import {
  createFileRoute,
  useNavigate,
  useRouteContext,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase-client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { useFormSessions } from '../../hooks/useFormSessions'
import { Input } from '@/components/ui/input'
import FormNav from '@/components/FormNav'
import { ItemPicker } from '@/components/ItemPicker'

export const Route = createFileRoute('/_form/select_author')({
  validateSearch: (search: Record<string, unknown>) => ({
    sessionId: search.sessionId as string,
    textAction: search.textAction as 'edit' | 'create' | undefined,
    authorAction: search.authorAction as 'edit' | 'create' | undefined,
  }),
  beforeLoad: ({ context }) => {
    // Ensure sessionId exists in context
    return context
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate({ from: '/select_author' })
  const {
    sessionId,
    textAction,
    authorAction: ctxAuthorAction,
  } = useRouteContext({
    from: '/_form/select_author',
  }) as {
    sessionId: string
    textAction?: 'edit' | 'create'
    authorAction?: 'edit' | 'create'
  }

  type UUID = string
  // const [regions, setRegions] = useState<any>([])
  // const [texts, setTexts] = useState<any>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedAuthor, setSelectedAuthor] = useState<UUID | null>(null)
  const [authorAction, setAuthorAction] = useState<'edit' | 'create' | null>(
    ctxAuthorAction ?? null,
  )
  // const [sessionName, setSessionName] = useState<string | null>(null)
  const { getSession, updateSession, updateSessionData, sessionsLoaded } =
    useFormSessions()
  const [authors, setAuthors] = useState<any>([])

  // const navigate = useNavigate()

  useEffect(() => {
    if (sessionsLoaded && sessionId) {
      const session = getSession(sessionId)
      // console.log('session:', session)
      if (session && session?.data) {
        // Set state with saved values
        setSelectedRegion(session.data.region || '')
        setAuthorAction(session.action_author || null)
        // setSessionName(session.name || '')
      }
      // console.log('Received sessionId:', sessionId)
    }
  }, [sessionId, sessionsLoaded])

  // /* Fetch all available regions */
  // useEffect(() => {
  //   const fetchRegions = async () => {
  //     const { error, data } = await supabase
  //       .from('regions')
  //       .select('*')
  //       .order('name', { ascending: true })

  //     if (error) {
  //       console.error('Error fetching regions: ', error.message)
  //     }

  //     setRegions(data)
  //   }
  //   fetchRegions()
  // }, [])

  // /* Fetch all available texts based on selected region */
  // useEffect(() => {
  //   const fetchTexts = async (region: string) => {
  //     const { error, data } = await supabase
  //       .from('texts')
  //       .select('*')
  //       .eq('name', region)

  //     if (error) {
  //       console.error('Error fetching regions: ', error.message)
  //     }

  //     setTexts(data)
  //   }
  //   fetchTexts(selectedRegion)
  // }, [selectedRegion])

  /* Fetch all available texts based on selected region */
  useEffect(() => {
    const fetchAuthors = async () => {
      const { error, data } = await supabase.from('authors').select('*')
      // .eq('name', region)

      if (error) {
        console.error('Error fetching authors: ', error.message)
      }

      setAuthors(data)
    }
    fetchAuthors()
  }, [])

  return (
    <div className="form-wrapper">
      <FormNav
        backLink="/text_info"
        backTitle="Text Info"
        nextLink="/author_info"
        nextTitle="Author Info"
      />
      <h1 className="form-title">Select Author</h1>
      <div className="form-body">
        {/* Text field */}
        {selectedRegion && (
          <ItemPicker
            label="Author"
            placeholder={`Search for all authors`}
            items={authors.map((author: any) => ({
              id: author.id,
              primary: author.name.english,
              secondary: '',
            }))}
            selectedId={selectedAuthor || null}
            onSelect={(id) => {
              setSelectedAuthor(id)
              updateSessionData(sessionId, { author_id: id })
            }}
          />
        )}

        {/* Form Action field */}
        <Field className="flex flex-col">
          <FieldLabel>Desired action</FieldLabel>
          <Select
            value={authorAction || ''}
            onValueChange={(value) => {
              const action = value as 'edit' | 'create'
              setAuthorAction(action)
              updateSession(sessionId, { action_author: action })
              navigate({
                search: {
                  sessionId,
                  textAction,
                  authorAction: action,
                },
                replace: true,
              })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select desired action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled={selectedAuthor === null} value="edit">
                Proceed with selected author (An author must be selected)
              </SelectItem>
              <SelectItem value="create">Create new author</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            Choose to proceed with an existing author or create a new author.
          </FieldDescription>
        </Field>
      </div>
      {/* Form Navigation */}
      <FormNav
        backLink="/text_info"
        backTitle="Text Info"
        nextLink="/author_info"
        nextTitle="Author Info"
      />
    </div>
  )
}
