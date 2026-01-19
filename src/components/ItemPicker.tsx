import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'

type Item = { id: string; primary: string; secondary?: string }

interface ItemPickerProps {
  label: string
  placeholder: string
  items: Item[]
  selectedId: string | null
  onSelect: (id: string) => void
  emptyText?: string
}

export function ItemPicker({
  label,
  placeholder,
  items,
  selectedId,
  onSelect,
  emptyText = 'No results found.',
}: ItemPickerProps) {
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <Field className="flex flex-col">
        <FieldLabel>{label}</FieldLabel>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {items.length > 0 && (
              <CommandGroup heading={`All ${label.toLowerCase()}s`}>
                {items.map((item) => (
                  <CommandItem key={item.id} onSelect={() => onSelect(item.id)}>
                    <span>{item.primary}</span>
                    {item.secondary && (
                      <CommandShortcut>{item.secondary}</CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        <FieldDescription>
          Selected {label.toLowerCase()}:{' '}
          {items.find((item) => item.id === selectedId)?.primary || 'none.'}
        </FieldDescription>
      </Field>
    </div>
  )
}
