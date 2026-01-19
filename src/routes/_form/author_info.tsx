import {
  createFileRoute,
  useNavigate,
  useRouteContext,
} from '@tanstack/react-router'
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

export const Route = createFileRoute('/_form/author_info')({
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
  const { sessionId } = useRouteContext({ from: '/_form/author_info' }) as {
    sessionId: string
  }

  // Add these state variables
  const [englishName, setEnglishName] = useState<string>('')
  const [originalName, setOriginalName] = useState<string>('')
  const [originCountry, setOriginCountry] = useState<string>('')
  const [birthDate, setBirthDate] = useState<string>('')
  const [deathDate, setDeathDate] = useState<string>('')

  const { getSession, updateSessionData, sessionsLoaded } = useFormSessions()

  // Add this useEffect to load saved data
  useEffect(() => {
    if (sessionsLoaded && sessionId) {
      const session = getSession(sessionId)
      // console.log('session:', session)
      if (session && session?.data) {
        // Restore saved values
        // setOriginalLanguage(session.data.originalLanguage || '')
        // setWritingSystem(session.data.writingSystem || '')
        setEnglishName(session.data.author_name_english || '')
        setOriginalName(session.data.author_name_original || '')
        setOriginCountry(session.data.author_origin_country || '')
        setBirthDate(session.data.author_birthdate || '')
        setDeathDate(session.data.author_deathdate || '')

        // setDescription(session.data.description || '')
        // setDescriptionSource(session.data.descriptionSource || '')
        // setDescriptionLink(session.data.descriptionLink || '')
        // setNumSections(session.data.numSections || '')
        // setNumChapters(session.data.numChapters || '')
      }
    }
  }, [sessionId, sessionsLoaded])

  /* Fetch all available regions */
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

  return (
    <div className="form-wrapper">
      <FormNav
        backLink="/select_author"
        backTitle="Select Author"
        nextLink=""
        nextTitle=""
        // noNext={false}
        // noBack={false}
      />
      {/* Page Title */}
      <h1 className="form-title">Author Info</h1>

      {/* Form Body */}
      <div className="form-body">
        <FieldGroup>
          {/* author name */}
          <FieldGroup className="border-1 p-7 rounded-md">
            <FieldLegend>1. Author Name</FieldLegend>
            <FieldDescription>
              Different names associated with the author
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel>English/Romanized name</FieldLabel>
                {/* <FieldLabel className="text-sm text-muted-foreground">
                  First name
                </FieldLabel> */}
                <Input
                  id="english-name"
                  value={englishName}
                  onChange={(e) => {
                    setEnglishName(e.target.value)
                    updateSessionData(sessionId, {
                      author_name_english: e.target.value,
                    })
                  }}
                  placeholder=""
                  required
                />
                {/* <FieldLabel className="text-sm text-muted-foreground">
                  Last name
                </FieldLabel>
                <Input
                  id="english-name"
                  value={englishName}
                  onChange={(e) => {
                    setEnglishName(e.target.value)
                    updateSessionData(sessionId, {
                      englishName: e.target.value,
                    })
                  }}
                  placeholder=""
                  required
                /> */}
                <FieldDescription>
                  Enter the most widely acknowledged name of author in English
                  or Romanized form.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Original name</FieldLabel>
                <Input
                  id="original-name"
                  value={originalName}
                  onChange={(e) => {
                    setOriginalName(e.target.value)
                    updateSessionData(sessionId, {
                      author_name_original: e.target.value,
                    })
                  }}
                  placeholder=""
                  required
                />
                <FieldDescription>
                  The author's original name, which should be typed and
                  formatted in its original writing system.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>

          {/* author origin */}
          <FieldGroup className="border-1 p-7 rounded-md">
            <FieldLegend>2. Author Origin</FieldLegend>
            <FieldDescription>The author's origin</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel>Origin country</FieldLabel>
                <Input
                  id="origin_country"
                  value={originCountry}
                  onChange={(e) => {
                    setOriginCountry(e.target.value)
                    updateSessionData(sessionId, {
                      author_origin_country: e.target.value,
                    })
                  }}
                  placeholder="e.g. China, Vietnam"
                  required
                />
                <FieldDescription>
                  The origin country of the author.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Birth date</FieldLabel>
                <Input
                  id="birthdate"
                  value={birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value)
                    updateSessionData(sessionId, {
                      author_birthdate: e.target.value,
                    })
                  }}
                  placeholder=""
                  required
                />
                <FieldLabel>Death date</FieldLabel>
                <Input
                  id="deathdate"
                  value={deathDate}
                  onChange={(e) => {
                    setDeathDate(e.target.value)
                    updateSessionData(sessionId, {
                      author_deathdate: e.target.value,
                    })
                  }}
                  placeholder=""
                  required
                />
              </Field>
            </FieldGroup>
          </FieldGroup>

          {/* text information */}
          {/* <FieldGroup className="border-1 p-7 rounded-md">
            <FieldLegend>3. Text Information</FieldLegend>
            <FieldDescription>
              Basic information about the text
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  id="description"
                  className="h-auto"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    updateSessionData(sessionId, {
                      description: e.target.value,
                    })
                  }}
                  placeholder="e.g. The Dao De Jing, attributed to the figure of Laozi..."
                  required
                />
                <FieldDescription>
                  A brief description of the text in English.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Description Source</FieldLabel>
                <FieldLabel className="text-sm text-muted-foreground">
                  Source Name
                </FieldLabel>
                <Textarea
                  id="description-source"
                  className="h-auto"
                  value={descriptionSource}
                  onChange={(e) => {
                    setDescriptionSource(e.target.value)
                    updateSessionData(sessionId, {
                      descriptionSource: e.target.value,
                    })
                  }}
                  placeholder="e.g. EBSCO"
                  required
                />
                <FieldLabel className="text-sm text-muted-foreground">
                  Source Link
                </FieldLabel>
                <Textarea
                  id="description-link"
                  className="h-auto"
                  value={descriptionLink}
                  onChange={(e) => {
                    setDescriptionLink(e.target.value)
                    updateSessionData(sessionId, {
                      descriptionLink: e.target.value,
                    })
                  }}
                  placeholder="e.g. https://www.ebsco.com/research-starters/social-sciences-and-humanities/dao-de-jing"
                />
                <FieldDescription>
                  The source for the description (name of book / website /
                  author). Include a link if there's any.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Number of sections</FieldLabel>
                <Input
                  id="num_sections"
                  value={numSections}
                  onChange={(e) => {
                    setNumSections(e.target.value)
                    updateSessionData(sessionId, {
                      numSections: e.target.value,
                    })
                  }}
                  placeholder="e.g. 2"
                  required
                />
                <FieldDescription>
                  Total number of sections (biggest unit under the entire text).
                  If the text is not divided into sections, enter 1.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Number of chapters</FieldLabel>
                <Input
                  id="num_chapters"
                  value={numChapters}
                  onChange={(e) => {
                    setNumChapters(e.target.value)
                    updateSessionData(sessionId, {
                      numChapters: e.target.value,
                    })
                  }}
                  placeholder="e.g. 81"
                  required
                />
                <FieldDescription>Total number of chapters.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup> */}
        </FieldGroup>
      </div>
      <FormNav
        backLink="/select_author"
        backTitle="Select Author"
        nextLink=""
        nextTitle=""
        // noNext={false}
        // noBack={false}
      />
    </div>
  )
}
