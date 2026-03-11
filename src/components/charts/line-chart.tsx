import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

import { getBaseChartOptions, resolveChartColor, useChartTheme } from './use-chart-theme'

interface LineSeries {
  key: string
  label: string
  color: string
}

interface LineChartProps<T> {
  data: T[]
  xKey: keyof T & string
  series: LineSeries[]
  colorOffset?: number
  height?: number
  formatValue?: (value: number) => string
  curved?: boolean
}

export function LineChart<T>({
  data,
  xKey,
  series,
  colorOffset = 0,
  height = 300,
  formatValue,
  curved = true,
}: LineChartProps<T>) {
  const theme = useChartTheme()

  const colors = useMemo(
    () => series.map((s, i) => resolveChartColor(s.color, theme.colors, i + colorOffset)),
    [series, colorOffset, theme.colors],
  )

  const options = useMemo(
    (): ApexCharts.ApexOptions => ({
      ...getBaseChartOptions(theme),
      chart: {
        ...getBaseChartOptions(theme).chart,
        type: 'line',
        dropShadow: {
          enabled: true,
          top: 3,
          left: 0,
          blur: 6,
          opacity: theme.isDark ? 0.2 : 0.12,
          color: colors[0],
        },
      },
      colors,
      stroke: {
        curve: curved ? 'smooth' : 'straight',
        width: 2.5,
        lineCap: 'round',
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: theme.isDark ? 'dark' : 'light',
          type: 'vertical',
          opacityFrom: 0.15,
          opacityTo: 0.01,
          stops: [0, 100],
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
      markers: {
        size: 0,
        strokeWidth: 2,
        strokeColors: colors,
        fillOpacity: 1,
        hover: { size: 5, sizeOffset: 2 },
      },
    }),
    [data, xKey, colors, formatValue, theme, curved],
  )

  const apexSeries = useMemo(
    () =>
      series.map((s) => ({
        name: s.label,
        data: data.map((d) => Number((d as Record<string, unknown>)[s.key] ?? 0)),
      })),
    [data, series],
  )

  return <ReactApexChart type="line" options={options} series={apexSeries} height={height} />
}
