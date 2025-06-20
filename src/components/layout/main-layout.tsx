"use client"

import { Topbar } from "./topbar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Topbar />
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-7xl px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
} 