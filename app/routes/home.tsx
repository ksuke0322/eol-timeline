import { ProductSidebar } from '~/components/ui/product-sidebar'

export function meta() {
  return [
    { title: '<New React Router App>' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clientLoader = async (): Promise<any[]> => {
  const response = await fetch('https://endoflife.date/api/nodejs.json')
  const data = await response.json()

  return data
}

const Home = () => {
  return (
    <div className="flex">
      <ProductSidebar />
      <main className="flex-1">main content</main>
    </div>
  )
}

export default Home
