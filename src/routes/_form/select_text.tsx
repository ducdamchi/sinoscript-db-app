import {
  createFileRoute,
  useNavigate,
  useRouteContext,
} from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase-client'
import { z } from 'zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { useFormSessions } from '../../hooks/useFormSessions'
import { Input } from '@/components/ui/input'
import FormNav from '@/components/FormNav'
import { ItemPicker } from '@/components/ItemPicker'
import { text } from 'node:stream/consumers'

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

  /* Initialize react-hook-form with Zod resolver */
  const {
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<SelectTextForm>({
    resolver: zodResolver(selectTextSchema),
    mode: 'onChange', // Validate on every change
    defaultValues: {
      sessionName: '',
      selectedRegion: '',
      textAction: undefined,
      selectedText: undefined,
    },
  })

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
  const {
    getSession,
    updateSession,
    updateSessionData,
    clearSessionData,
    sessionsLoaded,
  } = useFormSessions()

  /* State variables */
  const [textAction, setTextAction] = useState<'edit' | 'create' | undefined>(
    ctxTextAction,
  )
  const [regions, setRegions] = useState<any>([])
  const [texts, setTexts] = useState<any>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedText, setSelectedText] = useState<string | undefined>(textId)
  const [sessionName, setSessionName] = useState<string | null>(null)

  /* Alert dialog state */
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [pendingRegion, setPendingRegion] = useState<string | null>(null)
  const [pendingText, setPendingText] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<'edit' | 'create' | null>(
    null,
  )
  const [alertType, setAlertType] = useState<
    'region' | 'text' | 'action' | null
  >(null)

  useEffect(() => {
    console.log('texts:', texts)
    console.log('selectedText:', selectedText)
    console.log(
      'found:',
      texts.find((text: any) => text.id === selectedText),
    )
  }, [texts, selectedText])

  /* Check if session has existing data that would be lost */
  const hasRegionDependentData = () => {
    const session = getSession(sessionId)
    console.log('Session: ', session)

    const hasSessionData = Object.keys(session?.data || {}).length > 0

    return !!(
      hasSessionData ||
      session?.action_text ||
      session?.action_author ||
      session?.textId ||
      session?.authorId
    )
  }

  /* Check if changing text would lose data */
  const hasTextDependentData = () => {
    const session = getSession(sessionId)
    console.log('Session: ', session)
    const hasSessionData = Object.keys(session?.data || {}).length > 0

    return !!(
      hasSessionData ||
      session?.action_text ||
      session?.action_author ||
      session?.authorId
    )
  }

  /* Check if changing action would lose data */
  const hasActionDependentData = () => {
    const session = getSession(sessionId)
    console.log('Session: ', session)

    const hasSessionData = Object.keys(session?.data || {}).length > 0

    return !!(
      hasSessionData ||
      session?.data?.region ||
      session?.action_author ||
      session?.authorId
    )
  }

  /* Check if session is loaded and import saved info from local storage */
  useEffect(() => {
    if (sessionsLoaded && sessionId) {
      const session = getSession(sessionId)

      if (session && session?.data) {
        // Set state with saved values
        setSelectedRegion(session.region || '')
        if (!selectedText) {
          setSelectedText(session.textId || undefined)
        }
        setTextAction(session.action_text || undefined)
        setSessionName(session.name || '')

        // Sync with react-hook-form
        setValue('selectedRegion', session.region || '')
        if (session.action_text) {
          setValue('textAction', session.action_text)
        }
        setValue('sessionName', session.name || '')
        setValue('selectedText', session.textId || undefined)
        trigger() // Trigger validation
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

  /* Handle region change - either show dialog or change directly */
  const handleRegionChange = (value: string) => {
    // If same region selected, do nothing
    if (value === selectedRegion) return

    // If there's existing data, show confirmation dialog
    if (hasRegionDependentData()) {
      setPendingRegion(value)
      setAlertType('region')
      setIsAlertOpen(true)
      return
    }

    // No existing data, change directly
    applyRegionChange(value)
  }

  /* Apply the actual region change */
  const applyRegionChange = (value: string) => {
    // Update region
    setSelectedRegion(value)
    setValue('selectedRegion', value, { shouldValidate: true })

    // Clear dependent fields: text and action
    setSelectedText(undefined)
    setTextAction(undefined)
    setValue('selectedText', undefined, { shouldValidate: true })
    setValue('textAction', undefined, { shouldValidate: true })

    // Update session data
    clearSessionData(sessionId)

    updateSession(sessionId, {
      action_text: undefined,
      textId: undefined,
      authorId: undefined,
      action_author: undefined,
      region: value,
    })

    // Update URL
    navigate({
      search: {
        sessionId,
        textAction: undefined,
        authorAction: undefined,
        textId: undefined,
        authorId: undefined,
      },
      replace: true,
    })
  }

  /* Handle dialog confirmation */
  const handleConfirmRegionChange = () => {
    if (pendingRegion) {
      applyRegionChange(pendingRegion)
    }
    setPendingRegion(null)
    setAlertType(null)
    setIsAlertOpen(false)
  }

  /* Handle text change - either show dialog or change directly */
  const handleTextChange = (id: string) => {
    // If same text selected, do nothing
    if (id === selectedText) return

    // If there's dependent data, show confirmation dialog
    if (hasTextDependentData()) {
      setPendingText(id)
      setAlertType('text')
      setIsAlertOpen(true)
      return
    }

    // No dependent data, change directly
    applyTextChange(id)
  }

  /* Apply the actual text change */
  const applyTextChange = (id: string) => {
    setSelectedText(id)
    setValue('selectedText', id, { shouldValidate: true })

    // Clear dependent fields
    setTextAction(undefined)
    setValue('textAction', undefined, { shouldValidate: true })

    // Update session
    clearSessionData(sessionId)
    updateSession(sessionId, {
      textId: id,
      action_text: undefined,
      authorId: undefined,
      action_author: undefined,
    })

    // Update URL
    navigate({
      search: {
        sessionId,
        textId: id,
        textAction: undefined,
        authorAction: undefined,
        authorId: undefined,
      },
      replace: true,
    })
  }

  /* Handle confirm for text change */
  const handleConfirmTextChange = () => {
    if (pendingText) {
      applyTextChange(pendingText)
    }
    setPendingText(null)
    setAlertType(null)
    setIsAlertOpen(false)
  }

  /* Handle action change - either show dialog or change directly */
  const handleActionChange = (value: string) => {
    const action = value as 'edit' | 'create'

    // If same action selected, do nothing
    if (action === textAction) return

    // If there's dependent data, show confirmation dialog
    if (hasActionDependentData()) {
      setPendingAction(action)
      setAlertType('action')
      setIsAlertOpen(true)
      return
    }

    // No dependent data, change directly
    applyActionChange(action)
  }

  /* Apply the actual action change */
  const applyActionChange = (action: 'edit' | 'create') => {
    setTextAction(action)
    setValue('textAction', action, { shouldValidate: true })

    // Update session
    clearSessionData(sessionId)
    updateSession(sessionId, {
      action_text: action,
      action_author: undefined,
      authorId: undefined,
      textId: action === 'create' ? textId : undefined,
    })

    // Update URL
    navigate({
      search: {
        sessionId,
        textAction: action,
        authorAction: undefined,
        authorId: undefined,
        textId: action === 'edit' ? selectedText : undefined,
      },
      replace: true,
    })
  }

  /* Handle confirm for action change */
  const handleConfirmActionChange = () => {
    if (pendingAction) {
      applyActionChange(pendingAction)
    }
    setPendingAction(null)
    setAlertType(null)
    setIsAlertOpen(false)
  }

  /* Universal cancel handler */
  const handleCancelChange = () => {
    setPendingRegion(null)
    setPendingText(null)
    setPendingAction(null)
    setAlertType(null)
    setIsAlertOpen(false)
  }

  return (
    <div className="form-wrapper">
      {/* Universal Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Form Refresh</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {alertType === 'region' &&
              'Switching regions will discard all changes beyond the Region section.'}
            {alertType === 'text' &&
              'Switching texts will discard all changes beyond the Text section.'}
            {alertType === 'action' &&
              'Switching actions will discard all changes beyond the Desired Action section.'}{' '}
            Consider creating a new Session instead. Do you wish to continue?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelChange}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (alertType === 'region') handleConfirmRegionChange()
                else if (alertType === 'text') handleConfirmTextChange()
                else if (alertType === 'action') handleConfirmActionChange()
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FormNav
        backLink="/sessions"
        backTitle="Sessions"
        nextLink="/text_info"
        nextTitle="Text Info"
        disableNext={!isValid}
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
              setValue('sessionName', newName, { shouldValidate: true })
              updateSession(sessionId, { name: newName })
            }}
            required
            id="session-name"
            placeholder="E.g. Adding Dao De Jing from China, Editing The Tale of Kieu from Vietnam, etc."
          />
          {errors.sessionName && (
            <p className="text-sm text-red-500">{errors.sessionName.message}</p>
          )}
          <FieldDescription>
            Give your session a descriptive name for ease of future access.
          </FieldDescription>
        </Field>

        {/* Region field */}
        <Field className="flex flex-col">
          <FieldLabel>Region</FieldLabel>
          <Select value={selectedRegion} onValueChange={handleRegionChange}>
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
          {errors.selectedRegion && (
            <p className="text-sm text-red-500">
              {errors.selectedRegion.message}
            </p>
          )}
          <FieldDescription>
            Select the region that your text belongs to.
          </FieldDescription>
        </Field>

        {/* Text field */}
        {selectedRegion && (
          <>
            <ItemPicker
              label="Text"
              placeholder={`Search for text from ${selectedRegion}`}
              items={texts.map((text: any) => ({
                id: text.id,
                primary: text.name.english,
                secondary: text.author_id,
              }))}
              selectedId={selectedText || null}
              onSelect={handleTextChange}
            />

            {errors.selectedText && (
              <p className="text-sm text-red-500">
                {errors.selectedText.message}
              </p>
            )}
          </>
        )}

        {/* Form Action field */}
        <Field className="flex flex-col">
          <FieldLabel>Desired action</FieldLabel>
          <Select value={textAction || ''} onValueChange={handleActionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select desired action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled={selectedText === undefined} value="edit">
                View / Edit selected text
              </SelectItem>
              <SelectItem value="create">Create new text</SelectItem>
            </SelectContent>
          </Select>
          {errors.textAction && (
            <p className="text-sm text-red-500">{errors.textAction.message}</p>
          )}
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
        disableNext={!isValid}
      />
    </div>
  )
}

/* Validation Schema */
const selectTextSchema = z.object({
  sessionName: z
    .string()
    .min(3, 'Session name must be at least 3 characters')
    .max(100, 'Session name must be less than 100 characters'),
  selectedRegion: z.string().min(1, 'Please select a region'),
  textAction: z
    .enum(['edit', 'create'])
    .optional()
    .refine((val) => val !== undefined, {
      message: 'Please select an action',
    }),
  selectedText: z.string().optional(),
})
// .refine
// Custom validation: if textAction is 'edit', selectedText is required
// (data) =>
//   data.textAction !== 'edit' ||
//   (data.selectedText && data.selectedText.length > 0),
// {
//   message: 'Please select a text to edit',
//   path: ['selectedText'],
// },
// ()

// Infer TypeScript type from schema
type SelectTextForm = z.infer<typeof selectTextSchema>
