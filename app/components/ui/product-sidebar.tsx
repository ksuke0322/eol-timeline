import { useState, useMemo, useEffect } from 'react'

import { SearchInputWithDebounce } from './search-input-with-debounce'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar'
import { useProducts } from '~/hooks/use-products'
import { useSelectedProducts } from '~/hooks/use-selected-products'

export const ProductSidebar = () => {
  const { products, loading, error } = useProducts()
  const { selectedProducts, toggleProduct, selectAll, deselectAll } =
    useSelectedProducts(products)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const sortedAndFilteredProducts = useMemo(() => {
    let currentProducts = Object.entries(products)

    // 検索によるフィルタリング
    if (debouncedSearchTerm) {
      const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase()
      currentProducts = currentProducts.filter(([productName]) =>
        productName.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }

    // 選択状態によるソート
    currentProducts.sort(([productNameA], [productNameB]) => {
      const isSelectedA =
        selectedProducts.includes(productNameA) ||
        products[productNameA]?.some((v) =>
          selectedProducts.includes(`${productNameA}-${v.cycle}`),
        )
      const isSelectedB =
        selectedProducts.includes(productNameB) ||
        products[productNameB]?.some((v) =>
          selectedProducts.includes(`${productNameB}-${v.cycle}`),
        )

      if (isSelectedA && !isSelectedB) return -1
      if (!isSelectedA && isSelectedB) return 1

      // 選択状態が同じ場合はアルファベット順
      return productNameA.localeCompare(productNameB)
    })

    return Object.fromEntries(currentProducts)
  }, [products, debouncedSearchTerm, selectedProducts])

  const openAccordionItems = useMemo(() => {
    return Object.keys(sortedAndFilteredProducts).filter((productName) => {
      return (
        selectedProducts.includes(productName) ||
        products[productName]?.some((v) =>
          selectedProducts.includes(`${productName}-${v.cycle}`),
        )
      )
    })
  }, [sortedAndFilteredProducts, selectedProducts, products])

  const [accordionValue, setAccordionValue] = useState<string[]>([])

  useEffect(() => {
    setAccordionValue((prev) => {
      const newValues = new Set([...prev, ...openAccordionItems])
      return Array.from(newValues)
    })
  }, [openAccordionItems])

  const handleAllCheckedChange = (checked: boolean) => {
    if (checked) {
      const allProductNames = Object.keys(sortedAndFilteredProducts)
      selectAll(allProductNames)
    } else {
      deselectAll()
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SearchInputWithDebounce onDebouncedChange={setDebouncedSearchTerm} />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all"
              checked={
                !loading &&
                Object.keys(sortedAndFilteredProducts).length > 0 &&
                selectedProducts.length ===
                  Object.keys(sortedAndFilteredProducts).length
              }
              onCheckedChange={handleAllCheckedChange}
            />
            <label htmlFor="all">All</label>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {loading ? (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            </SidebarMenu>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            <SidebarMenu>
              <Accordion
                type="multiple"
                value={accordionValue}
                onValueChange={setAccordionValue}
              >
                {Object.entries(sortedAndFilteredProducts).map(
                  ([productName, versions]) => (
                    <SidebarMenuItem key={productName}>
                      <AccordionItem value={productName}>
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={productName}
                              checked={selectedProducts.includes(productName)}
                              onCheckedChange={() => toggleProduct(productName)}
                            />
                            <label htmlFor={productName}>{productName}</label>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <SidebarMenuSub>
                            {versions.map((version) => (
                              <SidebarMenuSubItem key={version.cycle}>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${productName}-${version.cycle}`}
                                    checked={selectedProducts.includes(
                                      `${productName}-${version.cycle}`,
                                    )}
                                    onCheckedChange={() =>
                                      toggleProduct(
                                        `${productName}-${version.cycle}`,
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${productName}-${version.cycle}`}
                                  >
                                    {version.cycle}
                                  </label>
                                </div>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </AccordionContent>
                      </AccordionItem>
                    </SidebarMenuItem>
                  ),
                )}
              </Accordion>
            </SidebarMenu>
          )}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
