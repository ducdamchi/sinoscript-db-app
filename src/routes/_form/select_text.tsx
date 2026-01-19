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

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { useFormSessions } from '../../hooks/useFormSessions'
import { Input } from '@/components/ui/input'
import FormNav from '@/components/FormNav'
import { ItemPicker } from '@/components/ItemPicker'

export const Route = createFileRoute('/_form/select_text')({
  validateSearch: (search: Record<string, unknown>) => ({
    sessionId: search.sessionId as string,
    textAction: search.textAction as 'edit' | 'create' | undefined,
    authorAction: search.authorAction as 'edit' | 'create' | undefined,
    textId: search.textId as string | undefined,
    authorId: search.authorId as string | undefined,
  }),
  beforeLoad: ({ context }) => {
    // Ensure sessionId exists in context
    return context
  },
  component: RouteComponent,
})

function RouteComponent() {
  /* Tell Tanstack Router which route's search schema to use */
  const navigate = useNavigate({ from: '/select_text' })

  /* Read /_form context returned from beforeLoad */
  const {
    sessionId,
    textAction: ctxTextAction,
    authorAction,
    textId,
    authorId,
  } = useRouteContext({
    from: '/_form/select_text',
  }) as {
    sessionId: string
    textAction: 'edit' | 'create' | undefined
    authorAction: 'edit' | 'create' | undefined
    textId: string | undefined
    authorId: string | undefined
  }

  /* Fetch methods from useFormSessions custom hook */
  const { getSession, updateSession, updateSessionData, sessionsLoaded } =
    useFormSessions()

  /* State variables */
  const [textAction, setTextAction] = useState<'edit' | 'create' | undefined>(
    ctxTextAction,
  )
  const [regions, setRegions] = useState<any>([])
  const [texts, setTexts] = useState<any>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedText, setSelectedText] = useState<string | undefined>(textId)
  const [sessionName, setSessionName] = useState<string | null>(null)

  /* Check if session is loaded and import saved info from local storage */
  useEffect(() => {
    if (sessionsLoaded && sessionId) {
      const session = getSession(sessionId)

      if (session && session?.data) {
        // Set state with saved values
        setSelectedRegion(session.data.region || '')
        setTextAction(session.action_text || undefined)
        setSessionName(session.name || '')
      }
    }
  }, [sessionId, sessionsLoaded])

  /* Fetch all available regions */
  useEffect(() => {
    const fetchRegions = async () => {
      const { error, data } = await supabase
        .from('regions')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching regions: ', error.message)
      }

      setRegions(data)
    }
    fetchRegions()
  }, [])

  /* Fetch all available texts based on selected region */
  useEffect(() => {
    const fetchTexts = async (region: string) => {
      if (!region) return

      const { error, data } = await supabase
        .from('texts')
        .select('*')
        .eq('region', region)

      if (error) {
        console.error('Error fetching texts: ', error.message)
      }

      setTexts(data ?? [])
    }
    fetchTexts(selectedRegion)
  }, [selectedRegion])

  return (
    <div className="form-wrapper">
      <FormNav
        backLink="/sessions"
        backTitle="Sessions"
        nextLink="/text_info"
        nextTitle="Text Info"
      />
      <h1 className="form-title">Select Text</h1>
      <div className="form-body">
        {/* Session info field */}
        <Field className="flex flex-col">
          <FieldLabel>Session name</FieldLabel>
          <Input
            value={sessionName || ''}
            onChange={(e) => {
              const newName = e.target.value
              setSessionName(newName)
              updateSession(sessionId, { name: newName })
            }}
            required
            id="session-name"
            placeholder="E.g. Adding Dao De Jing from China, Editing The Tale of Kieu from Vietnam, etc."
          ></Input>
          <FieldDescription>
            (Optional) Give your session a descriptive name for ease of future
            access. E.g., "Adding Dao De Jing from China", "Editing The Tale of
            Kieu from Vietnam", etc.
          </FieldDescription>
        </Field>

        {/* Region field */}
        <Field className="flex flex-col">
          <FieldLabel>Region</FieldLabel>
          <Select
            value={selectedRegion}
            onValueChange={(value) => {
              setSelectedRegion(value)
              updateSessionData(sessionId, { region: value })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region: any) => (
                <SelectItem key={region.id} value={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>
            Select the region that your text belongs to.
          </FieldDescription>
        </Field>

        {/* Text field */}
        {selectedRegion && (
          <ItemPicker
            label="Text"
            placeholder={`Search for text from ${selectedRegion}`}
            items={texts.map((text: any) => ({
              id: text.id,
              primary: text.name.english,
              secondary: text.author,
            }))}
            selectedId={selectedText || null}
            onSelect={(id) => {
              setSelectedText(id)
              updateSessionData(sessionId, { textId: id })
              navigate({
                search: {
                  sessionId,
                  textAction,
                  authorAction,
                  textId: id,
                  authorId, // Include textId in URL immediately
                },
                replace: true,
              })
            }}
          />
        )}

        {/* Form Action field */}
        <Field className="flex flex-col">
          <FieldLabel>Desired action</FieldLabel>
          <Select
            value={textAction || ''}
            onValueChange={(value) => {
              const action = value as 'edit' | 'create'
              setTextAction(action)
              updateSession(sessionId, { action_text: action })
              navigate({
                search: {
                  sessionId,
                  textAction: action,
                  authorAction,
                  authorId,
                  textId: action === 'edit' ? selectedText : undefined,
                },
                replace: true,
              })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select desired action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled={selectedText === null} value="edit">
                Proceed with selected text (A text must be selected)
              </SelectItem>
              <SelectItem value="create">Create new text</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            Choose to edit an existing text or create a new text.
          </FieldDescription>
        </Field>
      </div>
      {/* Form Navigation */}
      <FormNav
        backLink="/sessions"
        backTitle="Sessions"
        nextLink="/text_info"
        nextTitle="Text Info"
      />
    </div>
  )
}
