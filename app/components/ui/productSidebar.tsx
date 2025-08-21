import { useState, useMemo } from 'react'

import { SearchInputWithDebounce } from './searchInputWithDebounce'
import { Skeleton } from './skeleton'

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
import { useProductDetails } from '~/hooks/useProductDetails'
import { type ProductDetails, type ProductVersionDetail } from '~/lib/types'

export interface ProductSidebarProps {
  products: ProductDetails
  selectedProducts: string[]
  toggleProduct: (id: string) => void
  setAllProductDetails: React.Dispatch<React.SetStateAction<ProductDetails>>
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({
  products,
  selectedProducts,
  toggleProduct,
  setAllProductDetails,
}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const { updateProductDetails } = useProductDetails({
    products,
    selectedProducts,
    toggleProduct,
    setAllProductDetails,
  })

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
          selectedProductsSet.has(`${productName}_${v.cycle}`),
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

  const [openedProducts, setOpenedProducts] = useState<string[]>(() => {
    return Array.from(
      new Set(selectedProducts.map((product) => product.split('_')[0])),
    )
  })

  const updateOpenedProducts = async (productName: string) => {
    setOpenedProducts((prev) => {
      if (prev.includes(productName)) {
        return prev.filter((p) => p !== productName)
      } else {
        return [...prev, productName]
      }
    })

    await updateProductDetails(productName)
  }

  return (
    <SidebarProvider>
      <Sidebar data-testid="product-sidebar">
        <SidebarHeader>
          <SearchInputWithDebounce onDebouncedChange={setDebouncedSearchTerm} />
        </SidebarHeader>
        <SidebarContent>
          {/* loadingとerrorの表示はHomeコンポーネントで管理されるため削除 */}
          <SidebarMenu>
            <Accordion type="multiple" value={openedProducts}>
              {Object.entries(sortedAndFilteredProducts).map(
                ([productName, versions]) => (
                  <SidebarMenuItem key={productName}>
                    <AccordionItem value={productName}>
                      <div
                        className="flex items-center justify-between pr-2"
                        data-testid="sidebar-product"
                      >
                        <div className="flex flex-1 items-center space-x-2 p-2">
                          {versions && versions.length !== 0 ? (
                            <Checkbox
                              id={productName}
                              checked={selectedProductsSet.has(productName)}
                              onCheckedChange={async () => {
                                toggleProduct(productName)
                                await updateProductDetails(productName)
                              }}
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
                          onClick={() => updateOpenedProducts(productName)}
                        />
                      </div>
                      <AccordionContent>
                        <SidebarMenuSub>
                          {versions === null ? (
                            <SidebarMenuSubItem
                              key={`${productName}_skeleton`}
                              data-testid="productSidebarSkeleton"
                              className="flex flex-col gap-5"
                            >
                              <Skeleton className="h-3 w-full" />
                              <Skeleton className="h-3 w-full" />
                              <Skeleton className="h-3 w-full" />
                            </SidebarMenuSubItem>
                          ) : versions && versions.length === 0 ? (
                            <SidebarMenuSubItem key={`${productName}_Empty`}>
                              API Error
                            </SidebarMenuSubItem>
                          ) : (
                            versions &&
                            versions.map((version: ProductVersionDetail) => (
                              <SidebarMenuSubItem key={version.cycle}>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${productName}_${version.cycle}`}
                                    checked={selectedProductsSet.has(
                                      `${productName}_${version.cycle}`,
                                    )}
                                    onCheckedChange={() =>
                                      toggleProduct(
                                        `${productName}_${version.cycle}`,
                                      )
                                    }
                                    aria-label={`${productName}_${version.cycle}`}
                                  />
                                  <label
                                    htmlFor={`${productName}_${version.cycle}`}
                                    aria-label={`${productName}_${version.cycle}`}
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
