import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

import { getBaseChartOptions, resolveChartColor, useChartTheme } from './use-chart-theme'

interface BarSeries {
  key: string
  label: string
  color: string
  stackId?: string
}

interface BarChartProps<T> {
  data: T[]
  xKey: keyof T & string
  series: BarSeries[]
  colorOffset?: number
  height?: number
  formatValue?: (value: number) => string
  horizontal?: boolean
}

export function BarChart<T>({
  data,
  xKey,
  series,
  colorOffset = 0,
  height = 300,
  formatValue,
  horizontal = false,
}: BarChartProps<T>) {
  const theme = useChartTheme()
  const isStacked = series.some((s) => s.stackId)

  const colors = useMemo(
    () => series.map((s, i) => resolveChartColor(s.color, theme.colors, i + colorOffset)),
    [series, colorOffset, theme.colors],
  )

  const options = useMemo(
    (): ApexCharts.ApexOptions => ({
      ...getBaseChartOptions(theme),
      chart: {
        ...getBaseChartOptions(theme).chart,
        type: 'bar',
        stacked: isStacked,
      },
      colors,
      plotOptions: {
        bar: {
          borderRadius: 6,
          borderRadiusApplication: 'end',
          columnWidth: data.length <= 3 ? '40%' : data.length <= 6 ? '55%' : '65%',
          horizontal,
          distributed: false,
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
      },
      tooltip: {
        ...getBaseChartOptions(theme).tooltip,
        y: { formatter: formatValue ?? ((v: number) => v.toLocaleString()) },
      },
    }),
    [data, xKey, colors, isStacked, formatValue, theme, horizontal],
  )

  const apexSeries = useMemo(
    () =>
      series.map((s) => ({
        name: s.label,
        data: data.map((d) => Number((d as Record<string, unknown>)[s.key] ?? 0)),
      })),
    [data, series],
  )

  return <ReactApexChart type="bar" options={options} series={apexSeries} height={height} />
}
