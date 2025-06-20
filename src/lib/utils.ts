import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function calculateWaste(entries: number, sales: number): number {
  return Math.max(0, entries - sales)
}

export function calculateWasteValue(wasteQuantity: number, unitPrice: number): number {
  return wasteQuantity * unitPrice
}

export function getStockStatus(currentStock: number, minThreshold: number): 'low' | 'normal' | 'high' {
  if (currentStock <= minThreshold) return 'low'
  if (currentStock <= minThreshold * 2) return 'normal'
  return 'high'
}

export function getWasteStatus(wastePercentage: number): 'low' | 'medium' | 'high' {
  if (wastePercentage <= 5) return 'low'
  if (wastePercentage <= 15) return 'medium'
  return 'high'
} 