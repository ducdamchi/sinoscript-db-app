import FormNav from '@/components/FormNav'
import { createFileRoute } from '@tanstack/react-router'
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
import { useEffect } from 'react'
import axios from 'axios'

export const Route = createFileRoute('/_form/upload')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    const fetchText = async () => {
      const res = await axios
        .get('https://api.ctext.org/gettext?urn=ctp:dao-de-jing')
        .then((response) => response)
        .catch((err) => {
          console.log('Error fetching text from Ctext', err)
        })
      if (res) {
        console.log(res.data)
      }
    }
    fetchText()
  }, [])

  return (
    <div className="form-wrapper">
      {/* Form Navigation */}
      <FormNav
        backLink="/add"
        backTitle="Add New Text"
        nextLink=""
        nextTitle=""
        // noNext={false}
        // noBack={false}
      />
      {/* Page Title */}
      <h1 className="form-title">Upload File</h1>

      {/* Form Body */}
      <div className="form-body">
        <FieldGroup>
          {/* text information */}
          <FieldGroup className="border-1 p-7 rounded-md">
            <FieldLegend>1. Source</FieldLegend>
            <FieldDescription>
              Basic information about the text
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  id="description"
                  className="h-auto"
                  // value={description}
                  // onChange={(e) => {
                  //   setDescription(e.target.value)
                  //   updateSessionData(sessionId, {
                  //     description: e.target.value,
                  //   })
                  // }}
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
                  // value={descriptionSource}
                  // onChange={(e) => {
                  //   setDescriptionSource(e.target.value)
                  //   updateSessionData(sessionId, {
                  //     descriptionSource: e.target.value,
                  //   })
                  // }}
                  placeholder="e.g. EBSCO"
                  required
                />
                <FieldLabel className="text-sm text-muted-foreground">
                  Source Link
                </FieldLabel>
                <Textarea
                  id="description-link"
                  className="h-auto"
                  // value={descriptionLink}
                  // onChange={(e) => {
                  //   setDescriptionLink(e.target.value)
                  //   updateSessionData(sessionId, {
                  //     descriptionLink: e.target.value,
                  //   })
                  // }}
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
                  // value={numSections}
                  // onChange={(e) => {
                  //   setNumSections(e.target.value)
                  //   updateSessionData(sessionId, {
                  //     numSections: e.target.value,
                  //   })
                  // }}
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
                  // value={numChapters}
                  // onChange={(e) => {
                  //   setNumChapters(e.target.value)
                  //   updateSessionData(sessionId, {
                  //     numChapters: e.target.value,
                  //   })
                  // }}
                  placeholder="e.g. 81"
                  required
                />
                <FieldDescription>Total number of chapters.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </FieldGroup>
      </div>
      {/* Form Navigation */}
      <FormNav
        backLink="/add"
        backTitle="Add New Text"
        nextLink=""
        nextTitle=""
        // noNext={false}
        // noBack={false}
      />
    </div>
  )
}
