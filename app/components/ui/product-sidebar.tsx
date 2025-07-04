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

  const handleAllCheckedChange = (checked: boolean) => {
    if (checked) {
      const allProductNames = Object.keys(products)
      selectAll(allProductNames)
    } else {
      deselectAll()
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all"
              checked={
                !loading &&
                Object.keys(products).length > 0 &&
                selectedProducts.length === Object.keys(products).length
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
              {Object.entries(products).map(([productName, versions]) => (
                <SidebarMenuItem key={productName}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={productName}
                      checked={selectedProducts.includes(productName)}
                      onCheckedChange={() => toggleProduct(productName)}
                    />
                    <label htmlFor={productName}>{productName}</label>
                  </div>
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
                              toggleProduct(`${productName}-${version.cycle}`)
                            }
                          />
                          <label htmlFor={`${productName}-${version.cycle}`}>
                            {version.cycle}
                          </label>
                        </div>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          )}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}
