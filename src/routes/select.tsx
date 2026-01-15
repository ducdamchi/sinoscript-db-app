import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase-client'

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
import { useFormSessions } from '../hooks/useFormSessions'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/select')({
  component: RouteComponent,

  //validate the search params
  validateSearch: (search: Record<string, unknown>) => ({
    sessionId: search.sessionId as string,
  }),
})

function RouteComponent() {
  type UUID = string
  const [regions, setRegions] = useState<any>([])
  const [texts, setTexts] = useState<any>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [selectedText, setSelectedText] = useState<UUID | null>(null)
  const [formAction, setFormAction] = useState<'edit' | 'create' | null>(null)
  const [sessionName, setSessionName] = useState<string | null>(null)
  const { getSession, updateSession, updateSessionData, sessionsLoaded } =
    useFormSessions()
  const navigate = useNavigate()

  const { sessionId } = useSearch({ from: '/select' })

  useEffect(() => {
    if (sessionsLoaded && sessionId) {
      const session = getSession(sessionId)
      console.log('session:', session)
      if (session && session?.data) {
        // Set state with saved values
        setSelectedRegion(session.data.region || '')
        setFormAction(session.action || null)
        setSessionName(session.name || '')
      }
      console.log('Received sessionId:', sessionId)
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
      const { error, data } = await supabase
        .from('texts')
        .select('*')
        .eq('name', region)

      if (error) {
        console.error('Error fetching regions: ', error.message)
      }

      setTexts(data)
    }
    fetchTexts(selectedRegion)
  }, [selectedRegion])

  return (
    <div className="min-h-screen flex flex-col items-center gap-5">
      <div className="w-full max-w-[40rem]">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/sessions' })}
          className="hover:bg-zinc-200"
        >
          <ArrowLeft />
          Sessions
        </Button>
      </div>
      <h1 className="font-bold text-3xl mb-10">Select Region & Text</h1>
      <div className="multipage-form-body">
        {/* Session info field */}
        <Field className="flex flex-col">
          <FieldLabel>Session Name</FieldLabel>
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
            Give your session a descriptive name for ease of future access.
            E.g., "Adding Dao De Jing from China", "Editing The Tale of Kieu
            from Vietnam", etc.
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
          <div className="flex flex-col items-center gap-5 w-full">
            <Field className="flex flex-col">
              <FieldLabel>Text</FieldLabel>
              <Command>
                <CommandInput
                  placeholder={`Search for text from ${selectedRegion}`}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  {texts.length > 0 && (
                    <CommandGroup heading="All texts">
                      {texts.map((text: any) => (
                        <CommandItem
                          key={text.id}
                          onSelect={() => {
                            setSelectedText(text.id)
                            updateSessionData(sessionId, {
                              textId: text.id,
                            })
                          }}
                        >
                          <span>text.name</span>
                          <CommandShortcut>text.author</CommandShortcut>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
              <FieldDescription>
                {`Selected text: ${selectedText ? selectedText : 'none.'}`}
              </FieldDescription>
            </Field>
          </div>
        )}

        {/* Form Action field */}
        <Field className="flex flex-col">
          <FieldLabel>Desired Action</FieldLabel>
          <Select
            value={formAction || undefined}
            onValueChange={(value) => {
              const action = value as 'edit' | 'create'
              setFormAction(action)
              updateSession(sessionId, { action: action })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select desired action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem disabled={selectedText === null} value="edit">
                Edit Selected Text (A text must be selected)
              </SelectItem>
              <SelectItem value="create">Create New Text</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            Choose to edit an existing text or create a new text. Note that a
            text must be selected from the previous field to enable Edit option.
          </FieldDescription>
        </Field>
        <div className="flex justify-between">
          <Button
            className=""
            onClick={() => {
              navigate({ to: '/sessions' })
            }}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button
            className=""
            onClick={() => {
              navigate({ to: '/add', search: { sessionId: sessionId } })
            }}
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
