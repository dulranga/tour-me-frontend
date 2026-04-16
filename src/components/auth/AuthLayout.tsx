import * as React from 'react'

import { Card, CardContent } from '#/components/ui/card'

type AuthLayoutProps = {
  title: string
  description?: string
  kicker?: string
  children: React.ReactNode
}

export default function AuthLayout({
  title,
  description,
  kicker,
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-base px-4 py-12">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-6 text-center">
          {kicker ? (
            <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
              {kicker}
            </p>
          ) : null}
          <h1 className="mt-2 text-3xl font-semibold text-text-primary">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
        <Card>
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </div>
    </main>
  )
}
