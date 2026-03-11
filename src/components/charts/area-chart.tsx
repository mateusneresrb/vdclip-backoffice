import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

import { getBaseChartOptions, resolveChartColor, useChartTheme } from './use-chart-theme'

interface AreaSeries {
  key: string
  label: string
  color: string
}

interface AreaChartProps<T> {
  data: T[]
  xKey: keyof T & string
  yKey?: keyof T & string
  yLabel?: string
  series?: AreaSeries[]
  colorIndex?: number
  colorOffset?: number
  height?: number
  formatValue?: (value: number) => string
}

export function AreaChart<T>({
  data,
  xKey,
  yKey,
  yLabel,
  series: seriesProp,
  colorIndex = 0,
  colorOffset = 0,
  height = 300,
  formatValue,
}: AreaChartProps<T>) {
  const theme = useChartTheme()

  const resolvedSeries = useMemo(() => {
    if (seriesProp) 
return seriesProp
    if (yKey) 
return [{ key: String(yKey), label: yLabel ?? String(yKey), color: `var(--chart-${colorIndex + 1})` }]
    return []
  }, [seriesProp, yKey, yLabel, colorIndex])

  const colors = useMemo(
    () => resolvedSeries.map((s, i) => resolveChartColor(s.color, theme.colors, i + colorOffset)),
    [resolvedSeries, colorOffset, theme.colors],
  )

  const options = useMemo(
    (): ApexCharts.ApexOptions => ({
      ...getBaseChartOptions(theme),
      chart: {
        ...getBaseChartOptions(theme).chart,
        type: 'area',
      },
      colors,
      stroke: {
        curve: 'smooth',
        width: 2.5,
        lineCap: 'round',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: theme.isDark ? 'dark' : 'light',
          type: 'vertical',
          shadeIntensity: 0.3,
          opacityFrom: theme.isDark ? 0.25 : 0.35,
          opacityTo: 0.02,
          stops: [0, 95, 100],
        },
      },
      xaxis: {
        ...getBaseChartOptions(theme).xaxis,
        categories: data.map((d) => String(d[xKey])),
      },
      yaxis: {
        labels: {
          style: { colors: theme.foreground, fontSize: '11px', fontWeight: 400 },
          formatter: formatValue ?? ((v: number) => v.toLocaleString()),
        },
        title: yLabel && !seriesProp
          ? { text: yLabel, style: { color: theme.foreground, fontSize: '12px', fontWeight: 400 } }
          : undefined,
      },
      tooltip: {
        ...getBaseChartOptions(theme).tooltip,
        y: { formatter: formatValue ?? ((v: number) => v.toLocaleString()) },
      },
      legend: {
        ...getBaseChartOptions(theme).legend,
        show: resolvedSeries.length > 1,
      },
    }),
    [data, xKey, yLabel, colors, formatValue, theme, resolvedSeries, seriesProp],
  )

  const apexSeries = useMemo(
    () =>
      resolvedSeries.map((s) => ({
        name: s.label,
        data: data.map((d) => Number((d as Record<string, unknown>)[s.key] ?? 0)),
      })),
    [data, resolvedSeries],
  )

  return <ReactApexChart type="area" options={options} series={apexSeries} height={height} />
}
