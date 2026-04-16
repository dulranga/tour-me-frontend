import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/Footer'
import Header from '../components/Header'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const isAuthRoute = pathname.startsWith('/auth')
  const isDashboardRoute = pathname.startsWith('/dashboard')
//   const hidePublicShell = isAuthRoute || isDashboardRoute
  const hidePublicShell = isAuthRoute 

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        {hidePublicShell ? null : <Header />}
        {children}
        {hidePublicShell ? null : <Footer />}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <main className="page-wrap flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-text-primary">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-text-secondary">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-md border border-border-default bg-bg-elevated px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-hover"
      >
        Back to home
      </Link>
    </main>
  )
}
