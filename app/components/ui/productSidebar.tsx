import { useState, useMemo, useEffect } from 'react'

import { SearchInputWithDebounce } from './searchInputWithDebounce'

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
  SidebarProvider,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '~/components/ui/sidebar'
import { type ProductDetails, type ProductVersionDetail } from '~/lib/types'

interface ProductSidebarProps {
  products: ProductDetails
  selectedProducts: string[]
  toggleProduct: (id: string) => void
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({
  products,
  selectedProducts,
  toggleProduct,
}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const selectedProductsSet = useMemo(
    () => new Set(selectedProducts),
    [selectedProducts],
  )

  // フィルタリング処理を分離
  const filteredProducts = useMemo(() => {
    let currentProducts = Object.entries(products)

    if (debouncedSearchTerm) {
      const lowerCaseSearchTerm = debouncedSearchTerm.toLowerCase()
      currentProducts = currentProducts.filter(([productName]) =>
        productName.toLowerCase().includes(lowerCaseSearchTerm),
      )
    }
    return Object.fromEntries(currentProducts)
  }, [products, debouncedSearchTerm])

  // ソート処理を最適化
  const sortedAndFilteredProducts = useMemo(() => {
    const productEntries = Object.entries(filteredProducts) as [
      string,
      ProductVersionDetail[],
    ][]

    const selected: [string, ProductVersionDetail[]][] = []
    const unselected: [string, ProductVersionDetail[]][] = []

    productEntries.forEach(([productName, versions]) => {
      const isSelected =
        selectedProductsSet.has(productName) ||
        versions?.some((v) =>
          selectedProductsSet.has(`${productName}-${v.cycle}`),
        )

      if (isSelected) {
        selected.push([productName, versions])
      } else {
        unselected.push([productName, versions])
      }
    })

    // 各グループをアルファベット順にソート
    selected.sort(([productNameA], [productNameB]) =>
      productNameA.localeCompare(productNameB),
    )
    unselected.sort(([productNameA], [productNameB]) =>
      productNameA.localeCompare(productNameB),
    )

    // 選択済みを先頭に結合
    return Object.fromEntries([...selected, ...unselected])
  }, [filteredProducts, selectedProductsSet])

  const openAccordionItems = useMemo(() => {
    return Object.keys(filteredProducts).filter((productName) => {
      return (
        selectedProductsSet.has(productName) ||
        products[productName]?.some((v) =>
          selectedProductsSet.has(`${productName}-${v.cycle}`),
        )
      )
    })
  }, [filteredProducts, selectedProductsSet, products])

  const [accordionValue, setAccordionValue] = useState<string[]>(
    Object.keys(products),
  )

  useEffect(() => {
    setAccordionValue((prev) => {
      const prevSet = new Set(prev)
      const combinedSet = new Set([...prev, ...openAccordionItems])

      // セットが同一であるかを確認
      if (
        prevSet.size === combinedSet.size &&
        Array.from(prevSet).every((item) => combinedSet.has(item))
      ) {
        return prev // 変更がない場合、以前の配列参照を返す
      }

      return Array.from(combinedSet)
    })
  }, [openAccordionItems])

  return (
    <SidebarProvider>
      <Sidebar data-testid="product-sidebar">
        <SidebarHeader>
          <SearchInputWithDebounce onDebouncedChange={setDebouncedSearchTerm} />
        </SidebarHeader>
        <SidebarContent>
          {/* loadingとerrorの表示はHomeコンポーネントで管理されるため削除 */}
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
                      <div
                        className="flex items-center justify-between pr-2"
                        data-testid="sidebar-product"
                      >
                        <div className="flex flex-1 items-center space-x-2 p-2">
                          {versions.length !== 0 ? (
                            <Checkbox
                              id={productName}
                              checked={selectedProductsSet.has(productName)}
                              onCheckedChange={() => toggleProduct(productName)}
                              aria-label={productName}
                            />
                          ) : null}
                          <label
                            htmlFor={productName}
                            className="flex-1 cursor-pointer font-semibold"
                          >
                            {productName}
                          </label>
                        </div>
                        <AccordionTrigger
                          aria-label={`Toggle details for ${productName}`}
                        />
                      </div>
                      <AccordionContent>
                        <SidebarMenuSub>
                          {versions.length === 0 ? (
                            <SidebarMenuSubItem key={`${productName}-Empty`}>
                              No version
                            </SidebarMenuSubItem>
                          ) : (
                            versions.map((version: ProductVersionDetail) => (
                              <SidebarMenuSubItem key={version.cycle}>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${productName}-${version.cycle}`}
                                    checked={selectedProductsSet.has(
                                      `${productName}-${version.cycle}`,
                                    )}
                                    onCheckedChange={() =>
                                      toggleProduct(
                                        `${productName}-${version.cycle}`,
                                      )
                                    }
                                    aria-label={`${productName}-${version.cycle}`}
                                  />
                                  <label
                                    htmlFor={`${productName}-${version.cycle}`}
                                    aria-label={`${productName}-${version.cycle}`}
                                    className="font-normal"
                                  >
                                    {version.cycle}
                                  </label>
                                </div>
                              </SidebarMenuSubItem>
                            ))
                          )}
                        </SidebarMenuSub>
                      </AccordionContent>
                    </AccordionItem>
                  </SidebarMenuItem>
                ),
              )}
            </Accordion>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
