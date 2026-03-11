# Hooks Compartilhados

Hooks utilitários usados em múltiplas features. Sem dependência de features específicas.

## `usePagination<T>` (`use-pagination.ts`)

Paginação client-side para arrays já carregados.

```ts
const {
  page,           // página atual (1-based)
  totalPages,
  totalItems,
  paginatedItems, // slice da página atual
  setPage,
  canPreviousPage,
  canNextPage,
  nextPage,
  previousPage,
} = usePagination(items, pageSize?)   // pageSize default: 10
```

Usar com `<PaginationControls>` de `@/components/pagination-controls`.

## `useIsMobile` (`use-mobile.ts`)

Detecta se viewport é mobile (<768px). Atualiza em resize via `matchMedia`.

```ts
const isMobile = useIsMobile()  // boolean
```

## `useProductFilter` (`use-product-filter.ts`)

Filtro de produto global persistido. Wrapper do `useProductFilterStore` (Zustand).

```ts
const { currentProduct, setCurrentProduct } = useProductFilter()
// currentProduct: 'all' | 'vdclip' | 'business'
```

Persistido em `localStorage['product-filter']`. Usar para filtrar dados que existem nos dois produtos.

## Regra

Hooks desta pasta são **stateless utilities** ou **thin wrappers** de stores.
Hooks com chamadas de API ficam em `src/features/{name}/hooks/`.
