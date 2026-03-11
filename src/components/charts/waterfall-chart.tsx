import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

import { getBaseChartOptions, useChartTheme } from './use-chart-theme'

interface WaterfallItem {
  label: string
  value: number
}

interface WaterfallChartProps {
  data: WaterfallItem[]
  height?: number
  formatValue?: (value: number) => string
  positiveColor?: string
  negativeColor?: string
  totalColor?: string
}

export function WaterfallChart({
  data,
  height = 300,
  formatValue,
  positiveColor,
  negativeColor,
  totalColor,
}: WaterfallChartProps) {
  const theme = useChartTheme()

  const posColor = positiveColor ?? theme.colors[3]
  const negColor = negativeColor ?? theme.colors[4]
  const totColor = totalColor ?? theme.colors[0]

  const { categories, seriesData, colors } = useMemo(() => {
    const cats: string[] = []
    const sData: { x: string; y: [number, number] }[] = []
    const cols: string[] = []
    let running = 0

    for (const item of data) {
      cats.push(item.label)
      const prev = running
      running += item.value
      sData.push({ x: item.label, y: [prev, running] })
      cols.push(item.value >= 0 ? posColor : negColor)
    }

    cats.push('Net')
    sData.push({ x: 'Net', y: [0, running] })
    cols.push(totColor)

    return { categories: cats, seriesData: sData, colors: cols }
  }, [data, posColor, negColor, totColor])

  const options = useMemo(
    (): ApexCharts.ApexOptions => ({
      ...getBaseChartOptions(theme),
      chart: {
        ...getBaseChartOptions(theme).chart,
        type: 'rangeBar',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '50%',
          colors: {
            ranges: colors.map((c, i) => ({
              from: i,
              to: i,
              color: c,
            })),
          },
        },
      },
      colors,
      xaxis: {
        ...getBaseChartOptions(theme).xaxis,
        categories,
      },
      yaxis: {
        labels: {
          style: { colors: theme.foreground, fontSize: '11px', fontWeight: 400 },
          formatter: formatValue ?? ((v: number) => v.toLocaleString()),
        },
      },
      tooltip: {
        ...getBaseChartOptions(theme).tooltip,
        custom: ({ dataPointIndex }) => {
          const item = dataPointIndex < data.length ? data[dataPointIndex] : null
          const val = item ? item.value : seriesData[dataPointIndex].y[1]
          const label = categories[dataPointIndex]
          const formatted = formatValue ? formatValue(val) : val.toLocaleString()
          const color = colors[dataPointIndex]
          return `<div style="padding: 8px 12px; font-size: 12px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></span>
              <span style="font-weight: 500;">${label}</span>
            </div>
            <div style="margin-top: 4px; font-weight: 600;">${val >= 0 ? '+' : ''}${formatted}</div>
          </div>`
        },
      },
    }),
    [categories, colors, data, formatValue, seriesData, theme],
  )

  const series = useMemo(
    () => [{ name: 'MRR', data: seriesData }],
    [seriesData],
  )

  return <ReactApexChart type="rangeBar" options={options} series={series} height={height} />
}
