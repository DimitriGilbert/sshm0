import type { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
  className?: string
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <main className={`page-wrap px-4 pb-8 pt-14 ${className ?? ''}`}>
      {children}
    </main>
  )
}
