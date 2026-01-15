import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
import { CirclePlus, ArrowLeft } from 'lucide-react'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center gap-5">
      <div className="w-full max-w-[40rem]">
        <Button
          variant="ghost"
          // onClick={() => navigate({ to: '/select' })}
          className="hover:bg-zinc-200"
        >
          <ArrowLeft />
          Select Region & Text
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-3xl mb-10">Add New Text</h1>
        {/* <h3>Selected region: </h3> */}
      </div>
      <div className="multipage-form-body">
        <FieldGroup>
          {/* text region */}
          <FieldGroup className="border-1 p-7 rounded-md">
            <FieldLegend>1. Text Region</FieldLegend>
            <FieldDescription>
              The region from which the text originates
            </FieldDescription>
            <Input disabled placeholder="China" />
          </FieldGroup>

          {/* language system */}
          <FieldGroup className="border-1 p-7 rounded-md">
            <FieldLegend>2. Language System</FieldLegend>
            <FieldDescription>
              The language system behind the text
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel>Original language</FieldLabel>
                <Input
                  id="original-language"
                  placeholder="e.g. Vietnamese, Chinese, etc."
                  required
                />
                <FieldDescription>
                  The language in which the text was written.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Writing system</FieldLabel>
                <Input
                  id="writing-system"
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
            <FieldLegend>3. Text Name</FieldLegend>
            <FieldDescription>
              Different names associated with the text
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel>English name</FieldLabel>
                <Input
                  id="english-name"
                  placeholder="e.g. Dao De Jing, Analects, etc."
                  required
                />
                <FieldDescription>
                  Enter the most widely acknowledged name of text in English.
                  This will be the main name to be associated with the text.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Original name</FieldLabel>
                <Input
                  id="original-name"
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
            <FieldLegend>4. Text Information</FieldLegend>
            <FieldDescription>
              Basic information about the text
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  id="description"
                  className="h-auto"
                  placeholder="e.g. The Dao De Jing, attributed to the figure of Laozi, is a foundational text of Daoism, exploring profound philosophical concepts centered on the idea of the 'Dao,'' or 'Way.' Often regarded as a poetic treatise, it consists of eighty-one short chapters that engage with themes of harmony, nature, and the nature of existence. The authorship of the Dao De Jing is debated, with some scholars suggesting it may be a compilation of sayings from various Daoist traditions rather than the work of a single author. The text emerged during the tumultuous Warring States period in ancient China, reflecting a diverse intellectual landscape filled with competing philosophies, including Confucianism and Legalism."
                  required
                />
                <FieldDescription>
                  A brief description of the text in English.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Description Source</FieldLabel>
                <Textarea
                  id="description"
                  className="h-auto"
                  placeholder="e.g. EBSCO"
                  required
                />
                <FieldDescription>
                  The source for the description (name of book / website /
                  author).
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Number of sections</FieldLabel>
                <Input id="num_sections" placeholder="e.g. 2" required />
                <FieldDescription>
                  Total number of sections (biggest unit under the entire text).
                  If the text is not divided into sections, enter 1.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel>Number of chapters</FieldLabel>
                <Input id="num_sections" placeholder="e.g. 81" required />
                <FieldDescription>Total number of chapters.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>

          <Button>Next</Button>
        </FieldGroup>
      </div>
    </div>
  )
}
