import { InfoTooltip } from '@/components/info-tooltip'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartCardProps {
  title: string
  description?: string
  tooltip?: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function ChartCard({ title, description, tooltip, action, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
            {title}
            {tooltip && <InfoTooltip content={tooltip} />}
          </CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  )
}
