import type { DateRange as DayPickerRange } from 'react-day-picker'
import type { MetricsDateRange } from '../types'
import { format, startOfYear, subDays, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

interface RelativePreset {
  key: MetricsDateRange
  label: string
  getRange: () => { from: Date; to: Date }
}

function buildPresets(t: (key: string) => string): RelativePreset[] {
  const now = new Date()
  return [
    { key: '1d', label: t('metrics.dateRange.1d'), getRange: () => ({ from: subDays(now, 1), to: now }) },
    { key: '3d', label: t('metrics.dateRange.3d'), getRange: () => ({ from: subDays(now, 3), to: now }) },
    { key: '7d', label: t('metrics.dateRange.7d'), getRange: () => ({ from: subDays(now, 7), to: now }) },
    { key: '30d', label: t('metrics.dateRange.30d'), getRange: () => ({ from: subDays(now, 30), to: now }) },
    { key: '90d', label: t('metrics.dateRange.90d'), getRange: () => ({ from: subMonths(now, 3), to: now }) },
    { key: 'ytd', label: t('metrics.dateRange.ytd'), getRange: () => ({ from: startOfYear(now), to: now }) },
  ]
}

interface DateRangeFilterProps {
  dateRange: MetricsDateRange
  onDateRangeChange: (range: MetricsDateRange) => void
  onAbsoluteChange?: (from: Date, to: Date) => void
}

export function DateRangeFilter({ dateRange, onDateRangeChange, onAbsoluteChange }: DateRangeFilterProps) {
  const { t } = useTranslation('admin')
  const [open, setOpen] = useState(false)
  const [calendarRange, setCalendarRange] = useState<DayPickerRange | undefined>()

  const presets = buildPresets(t)
  const activePreset = presets.find((p) => p.key === dateRange)

  const handlePresetClick = (preset: RelativePreset) => {
    onDateRangeChange(preset.key)
    setCalendarRange(undefined)
    setOpen(false)
  }

  const handleCalendarSelect = (range: DayPickerRange | undefined) => {
    setCalendarRange(range)
    if (range?.from && range?.to) {
      onDateRangeChange('custom' as MetricsDateRange)
      onAbsoluteChange?.(range.from, range.to)
      setOpen(false)
    }
  }

  const triggerLabel = () => {
    if (dateRange === 'custom' && calendarRange?.from && calendarRange?.to) {
      return `${format(calendarRange.from, 'dd MMM yyyy', { locale: ptBR })} — ${format(calendarRange.to, 'dd MMM yyyy', { locale: ptBR })}`
    }
    return activePreset?.label ?? t('metrics.dateRange.custom')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={t('metrics.dateRange.custom')}
          className="h-9 gap-2 text-sm"
        >
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{triggerLabel()}</span>
          <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto max-w-[min(560px,calc(100vw-1rem))] p-0" align="end">
        <div className="flex flex-col">
          {/* Calendar on top */}
          <div className="overflow-x-auto p-3">
            <Calendar
              mode="range"
              selected={calendarRange}
              onSelect={handleCalendarSelect}
              numberOfMonths={1}
              locale={ptBR}
              disabled={{ after: new Date() }}
            />
          </div>

          <Separator />

          {/* Presets below */}
          <div className="flex flex-wrap gap-1 p-3">
            {presets.map((preset) => (
              <button
                key={preset.key}
                type="button"
                aria-pressed={dateRange === preset.key}
                onClick={() => handlePresetClick(preset)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  dateRange === preset.key
                    ? 'bg-primary font-medium text-primary-foreground'
                    : 'bg-muted text-foreground',
                )}
              >
                <span className="whitespace-nowrap">{preset.label}</span>
                {dateRange === preset.key && (
                  <Check className="h-3.5 w-3.5 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
