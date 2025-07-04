import { useState, useMemo } from 'react'

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
  SidebarInput,
} from '~/components/ui/sidebar'
import { useProducts } from '~/hooks/use-products'
import { useSelectedProducts } from '~/hooks/use-selected-products'

export const ProductSidebar = () => {
  const { products, loading, error } = useProducts()
  const { selectedProducts, toggleProduct, selectAll, deselectAll } =
    useSelectedProducts(products)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return Object.fromEntries(
      Object.entries(products).filter(([productName]) =>
        productName.toLowerCase().includes(lowerCaseSearchTerm),
      ),
    )
  }, [products, searchTerm])

  const handleAllCheckedChange = (checked: boolean) => {
    if (checked) {
      const allProductNames = Object.keys(filteredProducts)
      selectAll(allProductNames)
    } else {
      deselectAll()
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarInput
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all"
              checked={
                !loading &&
                Object.keys(filteredProducts).length > 0 &&
                selectedProducts.length === Object.keys(filteredProducts).length
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
              {Object.entries(filteredProducts).map(
                ([productName, versions]) => (
                  <SidebarMenuItem key={productName}>
                    <Accordion type="single" collapsible>
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
                    </Accordion>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          )}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
