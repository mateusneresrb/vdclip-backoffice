import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

import { resolveChartColor, useChartTheme } from './use-chart-theme'

interface RadialChartProps {
  value: number
  label: string
  color?: string
  height?: number
  formatValue?: (value: number) => string
}

export function RadialChart({
  value,
  label,
  color,
  height = 200,
  formatValue,
}: RadialChartProps) {
  const theme = useChartTheme()
  const resolvedColor = color ? resolveChartColor(color, theme.colors, 0) : theme.colors[0]

  const options = useMemo(
    (): ApexCharts.ApexOptions => ({
      chart: {
        type: 'radialBar',
        background: 'transparent',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        sparkline: { enabled: true },
      },
      colors: [resolvedColor],
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: { size: '65%' },
          track: {
            background: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            strokeWidth: '100%',
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: '12px',
              fontWeight: 500,
              color: theme.foreground,
              offsetY: 20,
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: theme.isDark ? '#f5f5f5' : '#1a1a1a',
              offsetY: -12,
              formatter: (val) => {
                const num = Number(val)
                return formatValue ? formatValue(num) : `${num.toFixed(1)}%`
              },
            },
          },
        },
      },
      stroke: { lineCap: 'round' },
    }),
    [label, resolvedColor, formatValue, theme],
  )

  return (
    <ReactApexChart
      type="radialBar"
      options={{ ...options, labels: [label] }}
      series={[Math.min(value, 100)]}
      height={height}
    />
  )
}
