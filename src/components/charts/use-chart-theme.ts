import { useEffect, useState } from 'react'

function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function cssColorToHex(color: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (!ctx) 
return '#888888'
  ctx.fillStyle = color.startsWith('oklch(') ? color : `oklch(${color})`
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function hexToRgba(hex: string, alpha: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export interface ChartTheme {
  colors: string[]
  foreground: string
  border: string
  background: string
  cardBackground: string
  isDark: boolean
}

export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(() => resolve())

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(resolve()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  return theme
}

export function resolveChartColor(
  colorValue: string,
  themeColors: string[],
  fallbackIndex: number,
): string {
  const varMatch = colorValue.match(/^var\(--chart-(\d+)\)$/)
  if (varMatch) {
    const idx = Number(varMatch[1]) - 1
    if (idx >= 0 && idx < themeColors.length) 
return themeColors[idx]
  }
  if (colorValue.startsWith('#') || colorValue.startsWith('rgb')) 
return colorValue
  return themeColors[fallbackIndex % themeColors.length]
}

export function getBaseChartOptions(theme: ChartTheme): ApexCharts.ApexOptions {
  return {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      animations: {
        enabled: true,
        speed: 600,
        animateGradually: { enabled: true, delay: 80 },
        dynamicAnimation: { enabled: true, speed: 300 },
      },
    },
    grid: {
      borderColor: hexToRgba(theme.border, theme.isDark ? 0.4 : 0.6),
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: -8, bottom: -4, left: 4, right: 4 },
    },
    xaxis: {
      labels: {
        style: {
          colors: theme.foreground,
          fontSize: '11px',
          fontWeight: 400,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.foreground,
          fontSize: '11px',
          fontWeight: 400,
        },
      },
    },
    tooltip: {
      theme: theme.isDark ? 'dark' : 'light',
      style: { fontSize: '12px' },
      x: { show: true },
    },
    legend: {
      labels: { colors: theme.foreground },
      fontSize: '12px',
      fontWeight: 500,
      markers: { size: 6, shape: 'circle' as const, offsetX: -2 },
      itemMargin: { horizontal: 12, vertical: 4 },
    },
    states: {
      hover: { filter: { type: 'darken' } },
      active: { filter: { type: 'darken' } },
    },
    dataLabels: { enabled: false },
  }
}

export { hexToRgba }

function resolve(): ChartTheme {
  const isDark = document.documentElement.classList.contains('dark')
  return {
    colors: [
      cssColorToHex(getCssVar('--chart-1')),
      cssColorToHex(getCssVar('--chart-2')),
      cssColorToHex(getCssVar('--chart-3')),
      cssColorToHex(getCssVar('--chart-4')),
      cssColorToHex(getCssVar('--chart-5')),
    ],
    foreground: cssColorToHex(getCssVar('--muted-foreground')),
    border: cssColorToHex(getCssVar('--border')),
    background: cssColorToHex(getCssVar('--popover')),
    cardBackground: cssColorToHex(getCssVar('--card')),
    isDark,
  }
}
