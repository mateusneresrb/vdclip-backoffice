import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

import { getBaseChartOptions, useChartTheme } from './use-chart-theme'

interface HeatmapSeries {
  name: string
  data: { x: string; y: number }[]
}

interface HeatmapChartProps {
  series: HeatmapSeries[]
  height?: number
  colorIndex?: number
  formatValue?: (value: number) => string
}

export function HeatmapChart({
  series,
  height = 300,
  colorIndex = 0,
  formatValue,
}: HeatmapChartProps) {
  const theme = useChartTheme()
  const baseColor = theme.colors[colorIndex % theme.colors.length]

  const options = useMemo(
    (): ApexCharts.ApexOptions => ({
      ...getBaseChartOptions(theme),
      chart: {
        ...getBaseChartOptions(theme).chart,
        type: 'heatmap',
      },
      colors: [baseColor],
      plotOptions: {
        heatmap: {
          radius: 4,
          enableShades: true,
          shadeIntensity: 0.5,
          colorScale: {
            ranges: [
              { from: 0, to: 0, color: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', name: '0%' },
            ],
          },
        },
      },
      xaxis: {
        ...getBaseChartOptions(theme).xaxis,
      },
      yaxis: {
        labels: {
          style: { colors: theme.foreground, fontSize: '11px', fontWeight: 400 },
        },
      },
      tooltip: {
        ...getBaseChartOptions(theme).tooltip,
        y: {
          formatter: formatValue ?? ((v: number) => `${v.toFixed(1)}%`),
        },
      },
      legend: { show: false },
    }),
    [baseColor, formatValue, theme],
  )

  return <ReactApexChart type="heatmap" options={options} series={series} height={height} />
}
