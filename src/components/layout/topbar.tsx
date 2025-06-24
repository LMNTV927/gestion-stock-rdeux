"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Inventaire Produits Organisé", href: "/" },
  { name: "Données", href: "#" },
  { name: "Analyses", href: "#" },
  { name: "Paramètres", href: "/settings" },
]

export function Topbar() {
  const pathname = usePathname()
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center h-16 px-4">
        {/* Logo */}
        <div className="font-bold text-lg text-gray-900 mr-8">Prince Palace</div>
        {/* Menu */}
        <nav className="flex gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition",
                pathname === item.href
                  ? "bg-gray-100 text-gray-900 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        {/* Spacer */}
        <div className="flex-1" />
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="rounded-full border border-gray-200 px-4 py-1.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-4"
        />
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-lg">👤</span>
        </div>
      </div>
    </header>
  )
} 