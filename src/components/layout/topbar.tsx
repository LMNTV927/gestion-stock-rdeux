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
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center h-16 px-4">
        <div className="font-bold text-lg text-gray-900">
          Gestion de Stock
        </div>
      </div>
    </header>
  )
} 