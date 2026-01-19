import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useFormSessions } from '@/hooks/useFormSessions' // Add this line
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  // FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormNav from '@/components/FormNav'
import { supabase } from '@/utils/supabase-client'
import { Button } from '@/components/ui/button'
import { CloudBackup, RotateCcw } from 'lucide-react'

export const Route = createFileRoute('/_form/text_info')({
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
  /* Read /_form context returned from beforeLoad */
  const { sessionId, textAction, authorAction, textId, authorId } =
    useRouteContext({
      from: '/_form/text_info',
    }) as {
      sessionId: string
      textAction: 'edit' | 'create' | undefined
      authorAction: 'edit' | 'create' | undefined
      textId: string | undefined
      authorId: string | undefined
    }

  /* Fetch methods from useFormSessions custom hook */
  const { getSession, updateSessionData, sessionsLoaded } = useFormSessions()

  /* State variables */
  const [originalLanguage, setOriginalLanguage] = useState<string>('')
  const [writingSystem, setWritingSystem] = useState<string>('')
  const [englishName, setEnglishName] = useState<string>('')
  const [originalName, setOriginalName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [descriptionSource, setDescriptionSource] = useState<string>('')
  const [descriptionLink, setDescriptionLink] = useState<string>('')
  const [numSections, setNumSections] = useState<string>('')
  const [numChapters, setNumChapters] = useState<string>('')
  const [creationDate, setCreationDate] = useState<string>('')
  const [textData, setTextData] = useState<any>(null)

  /* CREATE MODE: Load saved data from localStorage, if there's any saved */
  useEffect(() => {
    if (sessionsLoaded && sessionId) {
      const session = getSession(sessionId)
      if (session && session?.data) {
        // Restore saved values
        setOriginalLanguage(session.data.original_language || '')
        setWritingSystem(session.data.writing_system || '')
        setEnglishName(session.data.text_name_english || '')
        setOriginalName(session.data.text_name_original || '')
        setDescription(session.data.description_content || '')
        setDescriptionSource(session.data.description_source || '')
        setDescriptionLink(session.data.description_link || '')
        setNumSections(session.data.num_sections || '')
        setNumChapters(session.data.num_chapters || '')
        setCreationDate(session.data.creation_date || '')
      }
    }
  }, [sessionId, sessionsLoaded])

  /*  EDIT MODE: initialize local state from data fetched from DB */
  useEffect(() => {
    if (textAction === 'edit' && textData) {
      setOriginalLanguage(textData.original_language || '')
      setWritingSystem(textData.writing_system || '')
      setEnglishName(textData.name?.english || '')
      setOriginalName(textData.name?.original || '')
      setDescription(textData.description_content || '')
      setDescriptionSource(textData.description_source || '')
      setDescriptionLink(textData.description_link || '')
      setNumSections(textData.num_sections || '')
      setNumChapters(textData.num_chapters || '')
      setCreationDate(textData.creation_date || '')
    }
  }, [textAction, textData])

  useEffect(() => {
    if (textAction === 'edit' && textId) {
      const fetchText = async (textId: string | undefined) => {
        if (!textId) return

        const { error, data } = await supabase
          .from('texts')
          .select('*')
          .eq('id', textId)

        if (error) {
          console.error('Error fetching texts: ', error.message)
        }

        setTextData(data?.[0] ?? {})
      }
      fetchText(textId)
    }
  }, [textAction, textId])

  useEffect(() => {
    console.log('textData: ', textData)
  }, [textData])

  return (
    <div className="form-wrapper">
      <FormNav
        backLink="/select_text"
        backTitle="Select Text"
        nextLink="/text_info"
        nextTitle="Text Info"
      />
      {/* Page Title */}
      <div className="flex flex-col items-center gap-2">
        <h1 className="form-title">Text Info</h1>
        {textAction && textAction === 'edit' ? (
          <h2>Editing Existing Entry</h2>
        ) : (
          <h2>Adding New Entry</h2>
        )}
      </div>

      {/* Form Body */}
      <div className="form-body">
        <FieldGroup>
          {/* language system */}
          <FieldGroup className="border-1 p-7 rounded-md">
            <FieldLegend>1. Language System</FieldLegend>
            <FieldDescription>
              The language system behind the text
            </FieldDescription>
            <FieldGroup>
              <Field>
                <div className="flex justify-between">
                  <FieldLabel>Original language</FieldLabel>
                  {textAction === 'edit' && (
                    <Button
                      variant="ghost"
                      className="bg-transparent"
                      title="Reset to original"
                      onClick={() => {
                        setOriginalLanguage(textData?.original_language)
                      }}
                    >
                      <RotateCcw />
                    </Button>
                  )}
                </div>
                <Input
                  id="original-language"
                  value={originalLanguage}
                  onChange={(e) => {
                    setOriginalLanguage(e.target.value)
                    updateSessionData(sessionId, {
                      original_language: e.target.value,
                    })
                  }}
                  placeholder="e.g. Vietnamese, Chinese, etc."
                  required
                />
                <FieldDescription>
                  The language in which the text was written.
                </FieldDescription>
              </Field>
              <Field>
                <div className="flex justify-between">
                  <FieldLabel>Writing system</FieldLabel>
                  {textAction === 'edit' && (
                    <Button
                      variant="ghost"
                      className="bg-transparent"
                      title="Reset to original"
                      onClick={() => {
                        setWritingSystem(textData?.writing_system)
                      }}
                    >
                      <RotateCcw />
                    </Button>
                  )}
                </div>
                <Input
                  id="writing-system"
                  value={writingSystem}
                  onChange={(e) => {
                    setWritingSystem(e.target.value)
                    updateSessionData(sessionId, {
                      writing_system: e.target.value,
                    })
                  }}
                  placeholder="e.g. Hanzi, Nomzi, etc."
                  required
                />
                <FieldDescription>
                  The script that was used to produce the original text.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>

          {/* text name */}
          <FieldGroup className="border-1 p-7 rounded-md">
            <FieldLegend>2. Text Name</FieldLegend>
            <FieldDescription>
              Different names associated with the text
            </FieldDescription>
            <FieldGroup>
              <Field>
                <div className="flex justify-between">
                  <FieldLabel>English name</FieldLabel>
                  {textAction === 'edit' && (
                    <Button
                      variant="ghost"
                      className="bg-transparent"
                      title="Reset to original"
                      onClick={() => {
                        setEnglishName(textData?.name?.english)
                      }}
                    >
                      <RotateCcw />
                    </Button>
                  )}
                </div>
                <Input
                  id="english-name"
                  value={englishName}
                  onChange={(e) => {
                    setEnglishName(e.target.value)
                    updateSessionData(sessionId, {
                      text_name_english: e.target.value,
                    })
                  }}
                  placeholder="e.g. Dao De Jing, Analects, etc."
                  required
                />
                <FieldDescription>
                  Enter the most widely acknowledged name of text in English.
                </FieldDescription>
              </Field>
              <Field>
                <div className="flex justify-between">
                  <FieldLabel>Original name</FieldLabel>
                  {textAction === 'edit' && (
                    <Button
                      variant="ghost"
                      className="bg-transparent"
                      title="Reset to original"
                      onClick={() => {
                        setOriginalName(textData?.name?.original)
                      }}
                    >
                      <RotateCcw />
                    </Button>
                  )}
                </div>
                <Input
                  id="original-name"
                  value={originalName}
                  onChange={(e) => {
                    setOriginalName(e.target.value)
                    updateSessionData(sessionId, {
                      text_name_original: e.target.value,
                    })
                  }}
                  placeholder="e.g. 道德經, 論語, etc."
                  required
                />
                <FieldDescription>
                  The text's original name, which should be typed in the same
                  script that was entered under '(2) Language System / Writing
                  system'.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>

          {/* text information */}
          <FieldGroup className="border-1 p-7 rounded-md">
            <FieldLegend>3. Text Information</FieldLegend>
            <FieldDescription>
              Basic information about the text
            </FieldDescription>
            <FieldGroup>
              <Field className="border-1 p-5 rounded-md">
                <FieldLabel>Date of creation</FieldLabel>
                <Textarea
                  id="description-source"
                  className="h-auto"
                  value={creationDate}
                  onChange={(e) => {
                    setCreationDate(e.target.value)
                    updateSessionData(sessionId, {
                      creation_date: e.target.value,
                    })
                  }}
                  placeholder="e.g. circa. 1870"
                  required
                />
                <FieldDescription>
                  Include a time frame (precise or estimated) of when the text
                  was originally written.
                </FieldDescription>
              </Field>
              <Field className="border-1 p-5 rounded-md">
                <FieldLabel>Description</FieldLabel>
                <FieldLabel className="text-sm text-muted-foreground">
                  Content
                </FieldLabel>
                <Textarea
                  id="description"
                  className="h-auto"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    updateSessionData(sessionId, {
                      description_content: e.target.value,
                    })
                  }}
                  placeholder="e.g. The Dao De Jing, attributed to the figure of Laozi..."
                  required
                />
                <FieldLabel className="text-sm text-muted-foreground">
                  Source name
                </FieldLabel>
                <Textarea
                  id="description-source"
                  className="h-auto"
                  value={descriptionSource}
                  onChange={(e) => {
                    setDescriptionSource(e.target.value)
                    updateSessionData(sessionId, {
                      description_source: e.target.value,
                    })
                  }}
                  placeholder="e.g. EBSCO"
                  required
                />
                <FieldDescription>
                  Name of the source used for the description.
                </FieldDescription>
                <FieldLabel className="text-sm text-muted-foreground">
                  Source link
                </FieldLabel>
                <Textarea
                  id="description-link"
                  className="h-auto"
                  value={descriptionLink}
                  onChange={(e) => {
                    setDescriptionLink(e.target.value)
                    updateSessionData(sessionId, {
                      description_link: e.target.value,
                    })
                  }}
                  placeholder="e.g. https://www.ebsco.com/research-starters/social-sciences-and-humanities/dao-de-jing"
                />
                <FieldDescription>
                  Include a link to the source if any.
                </FieldDescription>
              </Field>
              <Field className="border-1 p-5 rounded-md">
                <FieldLabel>Text structure</FieldLabel>

                <FieldLabel className="text-sm text-muted-foreground">
                  Number of sections
                </FieldLabel>
                <Input
                  id="num_sections"
                  value={numSections}
                  onChange={(e) => {
                    setNumSections(e.target.value)
                    updateSessionData(sessionId, {
                      num_sections: e.target.value,
                    })
                  }}
                  placeholder="e.g. 2"
                  required
                />
                <FieldDescription>
                  Total number of sections (biggest unit under the entire text).
                  If the text is not divided into sections, enter 1.
                </FieldDescription>

                <FieldLabel className="text-sm text-muted-foreground">
                  Number of chapters
                </FieldLabel>
                <Input
                  id="num_chapters"
                  value={numChapters}
                  onChange={(e) => {
                    setNumChapters(e.target.value)
                    updateSessionData(sessionId, {
                      num_chapters: e.target.value,
                    })
                  }}
                  placeholder="e.g. 81"
                  required
                />
                <FieldDescription>Total number of chapters.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </FieldGroup>
      </div>
      <FormNav
        backLink="/select_text"
        backTitle="Select Text"
        nextLink="/text_info"
        nextTitle="Text Info"
      />
    </div>
  )
}
