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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Home({ loaderData }: { loaderData: any[] }) {
  return (
    <div>
      {/* <Welcome /> */}
      <p>{JSON.stringify(loaderData, null, 2)}</p>
    </div>
  )
}
