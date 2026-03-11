# Charts Components

Wrappers de ApexCharts com suporte automático a tema claro/escuro.
**Nunca usar `react-apexcharts` diretamente** — sempre usar esses wrappers.

## Componentes disponíveis

### `AreaChart` — séries temporais, tendências
```tsx
<AreaChart
  data={mrrHistory}    // array de objetos
  xKey="date"          // chave do eixo X
  yKey="mrr"           // modo simples: uma série
  yLabel="MRR"
  colorIndex={0}       // qual --chart-N usar (0-based)
  formatValue={(v) => `$${v.toLocaleString()}`}
/>
// Ou modo multi-série:
<AreaChart data={...} xKey="date" series={[{ key, label, color }]} />
```

### `BarChart` — comparações, composição (empilhada ou agrupada)
```tsx
<BarChart
  data={revenueData}
  xKey="date"
  series={[
    { key: 'newMrr', label: 'New MRR', color: 'var(--chart-4)', stackId: 'positive' },
    { key: 'churn',  label: 'Churn',   color: 'var(--chart-5)', stackId: 'negative' },
  ]}
  formatValue={(v) => `$${v.toLocaleString()}`}
  horizontal={false}
/>
```
Se qualquer série tiver `stackId`, o chart fica empilhado automaticamente.

### `LineChart` — múltiplas métricas ao longo do tempo
```tsx
<LineChart
  data={unitEconomicsData}
  xKey="month"
  series={[
    { key: 'ltv', label: 'LTV', color: 'var(--chart-1)' },
    { key: 'cac', label: 'CAC', color: 'var(--chart-5)' },
  ]}
  formatValue={(v) => `$${v.toLocaleString()}`}
  curved={true}  // default true
/>
```

### `DonutChart` — distribuição entre categorias
```tsx
<DonutChart
  data={[{ name: 'Premium', value: 450 }, { name: 'Lite', value: 200 }]}
  totalLabel="Total"
  formatValue={(v) => v.toLocaleString()}
  height={300}
/>
```

### `RadialChart` — percentual de conclusão, utilização
```tsx
<RadialChart
  value={successRate}     // 0–100
  label="Taxa de Sucesso"
  color="var(--chart-4)"
  height={260}
/>
```

### `WaterfallChart` — movimentação MRR (positivo + negativo + net)
```tsx
<WaterfallChart
  data={[
    { label: 'New MRR', value: 3000 },
    { label: 'Expansion', value: 800 },
    { label: 'Churn', value: -1200 },
  ]}
  formatValue={(v) => `$${v.toLocaleString()}`}
/>
```

### `ChartCard` — wrapper padrão
```tsx
<ChartCard title="MRR Trend" description="..." tooltip="...">
  <AreaChart ... />
</ChartCard>
```

## Cores
Paleta em `src/index.css` via `--chart-1` a `--chart-5`:
- `--chart-1` = Azul (255°) — métrica principal
- `--chart-2` = Esmeralda (160°) — positivo, crescimento
- `--chart-3` = Âmbar (48°) — acento, receita
- `--chart-4` = Violeta (290°) — secundário
- `--chart-5` = Rosa/Vermelho (10°) — churn, negativo, alertas

Passar como `color: 'var(--chart-N)'` — resolvido pelo `resolveChartColor()` via CSS.

## `useChartTheme()`
```ts
// Retorna:
{
  colors: string[],       // hex resolvido de --chart-1..5
  foreground: string,     // --muted-foreground
  border: string,         // --border
  isDark: boolean,
}
```
Observa mudanças de classe `.dark` via `MutationObserver` — atualiza automaticamente.
