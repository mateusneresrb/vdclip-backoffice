import { InfoTooltip } from '@/components/info-tooltip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  subtitle?: string
  iconClassName?: string
  tooltip?: string
}

export function MetricCard({ title, value, icon: Icon, subtitle, iconClassName, tooltip }: MetricCardProps) {
  return (
    <Card role="group" aria-label={`${title}: ${value}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
          {title}
          {tooltip && <InfoTooltip content={tooltip} />}
        </CardTitle>
        <div className={cn('flex size-8 items-center justify-center rounded-lg', iconClassName)}>
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-bold sm:text-2xl">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  )
}
