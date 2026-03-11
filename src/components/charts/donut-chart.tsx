import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'

import { useChartTheme } from './use-chart-theme'

interface DonutChartProps {
  data: { name: string; value: number }[]
  height?: number
  totalLabel?: string
  formatValue?: (value: number) => string
}

export function DonutChart({
  data,
  height = 300,
  totalLabel = 'Total',
  formatValue,
}: DonutChartProps) {
  const theme = useChartTheme()

  const options = useMemo(
    (): ApexCharts.ApexOptions => ({
      chart: {
        type: 'donut',
        background: 'transparent',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        animations: {
          enabled: true,
          speed: 600,
          animateGradually: { enabled: true, delay: 60 },
        },
      },
      colors: theme.colors,
      labels: data.map((d) => d.name),
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '12px',
                fontWeight: 500,
                color: theme.foreground,
                offsetY: -4,
              },
              value: {
                show: true,
                fontSize: '22px',
                fontWeight: 700,
                color: theme.foreground,
                offsetY: 4,
                formatter: (val) => {
                  const num = Number(val)
                  return formatValue ? formatValue(num) : num.toLocaleString()
                },
              },
              total: {
                show: true,
                label: totalLabel,
                fontSize: '12px',
                fontWeight: 500,
                color: theme.foreground,
                formatter: (w) => {
                  const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)
                  return formatValue ? formatValue(total) : total.toLocaleString()
                },
              },
            },
          },
          expandOnClick: false,
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: [theme.cardBackground],
      },
      legend: {
        position: 'bottom',
        labels: { colors: theme.foreground },
        fontSize: '12px',
        fontWeight: 500,
        markers: { size: 6, shape: 'circle' as const, offsetX: -2 },
        itemMargin: { horizontal: 12, vertical: 4 },
      },
      tooltip: {
        theme: theme.isDark ? 'dark' : 'light',
        style: { fontSize: '12px' },
        y: { formatter: formatValue ?? ((v: number) => v.toLocaleString()) },
      },
      states: {
        hover: { filter: { type: 'darken' } },
        active: { filter: { type: 'none' } },
      },
    }),
    [data, totalLabel, formatValue, theme],
  )

  const series = useMemo(() => data.map((d) => d.value), [data])

  return <ReactApexChart type="donut" options={options} series={series} height={height} />
}
