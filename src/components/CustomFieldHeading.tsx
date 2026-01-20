import { Button } from '@/components/ui/button'
import { FieldLabel, FieldLegend } from '@/components/ui/field'
import { CloudDownload, CloudBackup } from 'lucide-react'

interface FieldLabelWithResetProps {
  heading: string
  textAction: 'edit' | 'create' | undefined
  onReset: () => void
  tooltip?: string
  headingType: 'label' | 'legend'
}

export function CustomFieldHeading({
  heading,
  textAction,
  onReset,
  tooltip = 'Reset to original',
  headingType,
}: FieldLabelWithResetProps) {
  return (
    <div className="flex justify-between">
      {headingType === 'label' ? (
        <FieldLabel>{heading}</FieldLabel>
      ) : (
        <FieldLegend>{heading}</FieldLegend>
      )}
      {textAction === 'edit' && (
        <Button
          variant="ghost"
          className="bg-transparent"
          title={tooltip}
          onClick={onReset}
        >
          <CloudBackup />
        </Button>
      )}
    </div>
  )
}
