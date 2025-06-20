export interface Product {
  id: string
  name: string
  category: string
  currentStock: number
  minThreshold: number
  unitPrice: number
  supplier?: string
  barcode?: string
  expiryDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface StockMovement {
  id: string
  productId: string
  type: 'IN' | 'OUT'
  quantity: number
  price: number
  date: Date
  source: 'PURCHASE_ORDER' | 'SALE_TICKET' | 'MANUAL_ADJUSTMENT'
  documentUrl?: string
  userId: string
  createdAt: Date
  product?: Product
  user?: User
}

export interface WasteCalculation {
  id: string
  productId: string
  period: string // YYYY-MM
  entriesTotal: number
  salesTotal: number
  wasteQuantity: number
  wasteValue: number
  createdAt: Date
  product?: Product
}

export interface Alert {
  id: string
  productId: string
  type: 'LOW_STOCK' | 'EXPIRY_WARNING' | 'HIGH_WASTE' | 'SYSTEM_ALERT'
  message: string
  isRead: boolean
  createdAt: Date
  product?: Product
}

export interface User {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'MANAGER' | 'USER'
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  type: 'PURCHASE_ORDER' | 'SALE_TICKET'
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  extractedData?: unknown
  createdAt: Date
  processedAt?: Date
}

export interface DashboardStats {
  totalProducts: number
  totalValue: number
  lowStockProducts: number
  totalWasteValue: number
  monthlyWasteValue: number
  topSellingProducts: Array<{
    product: Product
    totalSales: number
  }>
  recentMovements: StockMovement[]
}

export interface ExtractedData {
  products: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  supplier?: string
  date?: Date
  totalAmount?: number
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }>
}

export interface StockStatus {
  low: number
  normal: number
  high: number
}

export interface WasteStatus {
  low: number
  medium: number
  high: number
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

export interface UploadProgress {
  fileId: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  message?: string
}

export interface ProductPrisma {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  min: number;
  unitPrice: number;
  category: string;
  supplier?: string;
  image?: string;
  lastUpdate?: string;
  status?: string;
  statusColor?: string;
} 