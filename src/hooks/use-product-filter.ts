import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProductId = 'vdclip' | 'business'
export type ProductFilter = 'all' | ProductId

interface ProductFilterStore {
  currentProduct: ProductFilter
  setCurrentProduct: (product: ProductFilter) => void
}

export const useProductFilterStore = create<ProductFilterStore>()(
  persist(
    (set) => ({
      currentProduct: 'all',
      setCurrentProduct: (product) => set({ currentProduct: product }),
    }),
    { name: 'product-filter' },
  ),
)

export function useProductFilter() {
  const currentProduct = useProductFilterStore((s) => s.currentProduct)
  const setCurrentProduct = useProductFilterStore((s) => s.setCurrentProduct)
  return { currentProduct, setCurrentProduct }
}
