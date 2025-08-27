import React from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import './app.css'

export const links = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'preconnect',
    href: 'https://endoflife.date',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <footer className="py-4 text-center text-sm text-gray-500">
          Data from{' '}
          <a
            href="https://endoflife.date/docs/api"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            endoflife.date
          </a>
        </footer>
        <ScrollRestoration />
        <Scripts />
        {/* <!-- Cloudflare Web Analytics --> */}
        {import.meta.env.PROD && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "81d83771590e42d8ba1b8449ad8ed44e"}'
          ></script>
        )}
        {/* <!-- End Cloudflare Web Analytics --> */}
      </body>
    </html>
  )
}

const App = () => {
  return <Outlet />
}

export default App

export const ErrorBoundary = ({ error }: { error: unknown }) => {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <div className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </div>
  )
}
