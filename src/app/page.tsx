"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { BarChart } from "@/components/charts/line-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertTriangle,
  Euro,
  BarChart3,
  TrendingUp,
  Package,
  ShoppingCart,
  ReceiptText,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import type { ProductPrisma } from '@/types'
import Image from "next/image"

// Données de démonstration
const mockStats = {
  totalProducts: 156,
  totalValue: 45230.50,
  lowStockProducts: 8,
  totalWasteValue: 1250.75,
  monthlyWasteValue: 320.25,
}

const mockChartData = [
  { name: "Jan", stockValue: 42000, wasteValue: 280 },
  { name: "Fév", stockValue: 43500, wasteValue: 320 },
  { name: "Mar", stockValue: 44800, wasteValue: 290 },
  { name: "Avr", stockValue: 45230, wasteValue: 320 },
  { name: "Mai", stockValue: 46800, wasteValue: 350 },
  { name: "Juin", stockValue: 47500, wasteValue: 380 },
]

const mockTopProducts = [
  { name: "Coca-Cola 33cl", sales: 1250, stock: 45 },
  { name: "Heineken 25cl", sales: 980, stock: 32 },
  { name: "Chips Lays", sales: 850, stock: 28 },
  { name: "Pain au Chocolat", sales: 720, stock: 15 },
  { name: "Café Expresso", sales: 680, stock: 22 },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: 39, avatar: "S" },
]

const mockRecentSales = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: 1999, avatar: "O" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: 39, avatar: "J" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: 299, avatar: "I" },
  { name: "William Kim", email: "will@email.com", amount: 99, avatar: "W" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: 39, avatar: "S" },
]

// Types pour les résultats de scan
interface ScannedProduct {
  name: string;
  quantity?: number;
  unitPrice?: number;
  category?: string;
  quantitySold?: number;
  salePrice?: number;
  unit?: string;
}
interface ScanResult {
  success: true;
  products: ScannedProduct[];
}

export default function DashboardPage() {
  const bonCmdInputRef = useRef<HTMLInputElement>(null)
  const ticketInputRef = useRef<HTMLInputElement>(null)
  const [bonCmdFile, setBonCmdFile] = useState<File | null>(null)
  const [ticketFile, setTicketFile] = useState<File | null>(null)
  const [inventory, setInventory] = useState<ProductPrisma[]>([])
  const [editModal, setEditModal] = useState<{open: boolean, item: ProductPrisma | null, imageFile?: File | null, imagePreview?: string | null}>({open: false, item: null, imageFile: null, imagePreview: null})
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult | null>(null);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [scanType, setScanType] = useState<'delivery' | 'receipt'>('delivery');
  const [iaModalOpen, setIaModalOpen] = useState(false);
  const [iaProducts, setIaProducts] = useState<ScannedProduct[]>([]);
  const [iaScanType, setIaScanType] = useState<'delivery' | 'receipt'>('delivery');

  // Chargement initial de l'inventaire depuis l'API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setInventory(data));
  }, []);

  // Calculs dynamiques des statistiques à partir de l'inventaire
  const totalProducts = inventory.reduce((acc, item) => acc + (item.quantity ?? 0), 0);
  const totalValue = inventory.reduce((acc, item) => acc + ((item.quantity ?? 0) * (item.unitPrice ?? 0)), 0);
  const lowStockProducts = inventory.filter(item => (item.quantity ?? 0) < (item.min ?? 0)).length;
  const monthlyWasteValue = 0; // À définir selon la logique métier réelle

  // Fonction utilitaire pour la couleur de badge catégorie
  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'viandes':
      case 'viandes & poissons':
        return 'bg-red-100 text-red-700';
      case 'légumes':
      case 'fruits & légumes':
        return 'bg-blue-100 text-blue-700';
      case 'condiments':
        return 'bg-yellow-100 text-yellow-700';
      case 'poissons':
        return 'bg-blue-200 text-blue-800';
      case 'boissons':
        return 'bg-green-100 text-green-700';
      case 'produits laitiers':
        return 'bg-purple-100 text-purple-700';
      case 'pâtes & céréales':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(0, (item.quantity ?? 0) + delta),
              status:
                ((item.quantity ?? 0) + delta) < (item.min ?? 0)
                  ? "Stock faible"
                  : "Stock OK",
              statusColor:
                ((item.quantity ?? 0) + delta) < (item.min ?? 0)
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-700",
            }
          : item
      )
    )
  }

  // Suppression d'un produit via l'API
  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      // Recharge l'inventaire
      const data = await fetch('/api/products').then(res => res.json());
      setInventory(data);
    }
  }

  const handleEdit = (item: ProductPrisma) => {
    setEditModal({open: true, item: {...item}, imageFile: null, imagePreview: item.image})
  }

  const handleEditChange = (field: string, value: string | number) => {
    setEditModal((prev) => prev.item ? {
      ...prev,
      item: { ...prev.item, [field]: value }
    } : prev)
  }

  const handleEditImage = (file: File | null) => {
    if (!file) {
      setEditModal((prev) => prev.item ? { ...prev, imageFile: null, imagePreview: null } : prev)
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      setEditModal((prev) => prev.item ? { ...prev, imageFile: file, imagePreview: e.target?.result as string } : prev)
    }
    reader.readAsDataURL(file)
  }

  const handleEditImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleEditImage(e.dataTransfer.files[0])
    }
  }

  const handleEditImageRemove = () => {
    setEditModal((prev) => prev.item ? { ...prev, imageFile: null, imagePreview: null } : prev)
  }

  // Édition d'un produit via l'API
  const handleEditSave = async () => {
    if (!editModal.item) return;
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editModal.item, image: editModal.imagePreview || editModal.item.image })
    });
    // Recharge l'inventaire
    const data = await fetch('/api/products').then(res => res.json());
    setInventory(data);
    setEditModal({open: false, item: null, imageFile: null, imagePreview: null});
  }

  const handleEditClose = () => setEditModal({open: false, item: null, imageFile: null, imagePreview: null})

  // Fonction d'analyse mock
  const analyzePDF = async (file: File, type: 'delivery' | 'receipt'): Promise<ScanResult> => {
    console.log('🔍 Analyse en cours...', type);
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (type === 'delivery') {
      return {
        success: true as const,
        products: [
          { name: 'Tomates cerises', quantity: 15, unitPrice: 3.20, category: 'légumes' },
          { name: 'Courgettes', quantity: 8, unitPrice: 2.10, category: 'légumes' },
          { name: 'Eau minérale', quantity: 12, unitPrice: 0.85, category: 'boissons' }
        ]
      };
    } else {
      return {
        success: true as const,
        products: [
          { name: 'Tomates', quantitySold: 3, salePrice: 2.50 },
          { name: 'Carottes', quantitySold: 2, salePrice: 1.80 }
        ]
      };
    }
  };

  // Handler d'upload PDF
  const handleFileUpload = async (file: File, scanType: 'delivery' | 'receipt') => {
    console.log('📁 Fichier uploadé:', file.name);
    try {
      setIsAnalyzing(true);
      const result: ScanResult = await analyzePDF(file, scanType);
      if (result && result.success) {
        setScanResults(result);
        setValidationModalOpen(true);
      } else {
        alert('Erreur analyse PDF');
      }
    } catch (error) {
      alert("Impossible d'analyser le fichier");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleIaValidate = async (products: ScannedProduct[], type: 'delivery' | 'receipt') => {
    const productsToUpsert: Partial<ProductPrisma>[] = [];

    if (type === 'delivery') {
      products.forEach((prod) => {
        const { name, quantity, category, unitPrice, unit } = prod;
        const existingProduct = inventory.find(item => item.name.toLowerCase() === name?.toLowerCase());
        
        if (existingProduct) {
          productsToUpsert.push({
            id: existingProduct.id,
            quantity: (existingProduct.quantity || 0) + (quantity || 0),
          });
        } else {
          productsToUpsert.push({
            name: name || "Nouveau Produit",
            quantity: quantity || 0,
            unitPrice: unitPrice || 0,
            category: category || "Non classé",
            min: 10,
            unit: unit || 'pcs',
            status: "Stock OK",
            statusColor: "bg-green-50 text-green-700",
            image: '/file.svg',
          });
        }
      });
    } else { // receipt
      products.forEach(prod => {
        const { name, quantitySold } = prod;
        const existingProduct = inventory.find(item => item.name.toLowerCase() === name?.toLowerCase());
        if (existingProduct) {
          productsToUpsert.push({
            id: existingProduct.id,
            quantity: Math.max(0, (existingProduct.quantity || 0) - (quantitySold || 0)),
          });
        }
      });
    }

    if (productsToUpsert.length > 0) {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: productsToUpsert }),
      });
    }

    const data = await fetch('/api/products').then(res => res.json());
    setInventory(data);
    setIaModalOpen(false);
  };

  const analyzePDFWithOpenAI = async (file: File): Promise<ScannedProduct[]> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/analyze-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur de l'API:", errorText);
      throw new Error(`Erreur de l'API: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.products) {
      throw new Error("La réponse de l'API ne contient pas de produits.");
    }
    return data.products;
  };

  const handleFileUploadIA = async (file: File, scanType: 'delivery' | 'receipt') => {
    if (!file) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }
    try {
      setIsAnalyzing(true);
      setIaScanType(scanType);
      const products = await analyzePDFWithOpenAI(file);
      setIaProducts(products);
      setIaModalOpen(true);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        alert(e.message);
      } else {
        alert("Une erreur inconnue est survenue lors de l'analyse.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Boutons de scan PDF modernes */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
          <div className="flex flex-col items-center">
            <button
              type="button"
              className="flex items-center gap-2 border-2 border-green-500 text-green-700 font-semibold rounded-xl px-6 py-3 bg-white hover:bg-green-50 transition text-lg shadow-sm"
              onClick={() => bonCmdInputRef.current?.click()}
            >
              <ShoppingCart className="h-6 w-6 text-green-600" />
              Scanner bon de commande
            </button>
            <input
              ref={bonCmdInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setBonCmdFile(e.target.files[0]);
                  handleFileUploadIA(e.target.files[0], 'delivery');
                }
              }}
            />
            {bonCmdFile && (
              <span className="mt-2 text-sm text-gray-700">{bonCmdFile.name}</span>
            )}
          </div>
          <div className="flex flex-col items-center">
            <button
              type="button"
              className="flex items-center gap-2 border-2 border-red-500 text-red-700 font-semibold rounded-xl px-6 py-3 bg-white hover:bg-red-50 transition text-lg shadow-sm"
              onClick={() => ticketInputRef.current?.click()}
            >
              <ReceiptText className="h-6 w-6 text-red-600" />
              Scanner un ticket
            </button>
            <input
              ref={ticketInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setTicketFile(e.target.files[0]);
                  handleFileUploadIA(e.target.files[0], 'receipt');
                }
              }}
            />
            {ticketFile && (
              <span className="mt-2 text-sm text-gray-700">{ticketFile.name}</span>
            )}
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Produits"
            value={totalProducts}
            description="En stock actuellement"
            icon={Package}
            variant="default"
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Valeur Totale"
            value={formatCurrency(totalValue)}
            description="Valeur du stock"
            icon={Euro}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Stock Faible"
            value={lowStockProducts}
            description="Produits à réapprovisionner"
            icon={AlertTriangle}
            variant="warning"
            trend={{ value: 12, isPositive: false }}
          />
          <StatsCard
            title="Gaspillage Mensuel"
            value={formatCurrency(monthlyWasteValue)}
            description="Valeur gaspillée ce mois"
            icon={TrendingUp}
            variant="danger"
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        {/* Boutons de téléversement PDF */}
        {/* SUPPRIMÉ : Les boutons modernes en haut remplacent cette section */}

        {/* Graphiques et tableaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventaire Produits Organisé - Tableau moderne et responsive */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Inventaire Produits Organisé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Produit</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Catégorie</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Quantité</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Prix unitaire</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">Statut</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap hidden md:table-cell">Fournisseur</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap hidden md:table-cell">Dernière MAJ</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 flex items-center gap-3 min-w-[180px]">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover border" />
                          <div>
                            <div className="font-semibold text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-400">ID: {item.id}...</div>
                          </div>
                        </td>
                        <td className={`px-4 py-3`}><span className={`${getCategoryColor(item.category)} px-2 py-0.5 rounded-full text-xs font-medium`}>{item.category}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 text-lg" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                            <span className="font-semibold text-gray-900">{item.quantity} {item.unit}</span>
                            <button className="w-6 h-6 flex items-center justify-center rounded bg-green-100 text-green-700 text-lg" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                          </div>
                          <div className="text-xs text-gray-400">Seuil: {item.min} {item.unit}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{item.unitPrice.toFixed(2)}€</div>
                          <div className="text-xs text-gray-400">Total: {(item.unitPrice * item.quantity).toFixed(2)}€</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`${item.statusColor} px-3 py-1 rounded-full text-xs font-semibold`}>{item.status}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">{item.supplier}</td>
                        <td className="px-4 py-3 hidden md:table-cell">{item.lastUpdate}</td>
                        <td className="px-4 py-3 flex gap-2 justify-center">
                          <button className="p-2 rounded hover:bg-gray-100" title="Éditer" onClick={() => handleEdit(item)}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6" /></svg></button>
                          <button className="p-2 rounded hover:bg-gray-100" title="Supprimer" onClick={() => handleDelete(item.id)}><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top produits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Produits Vendeurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.sales} ventes ce mois
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      Stock: {product.stock}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mouvements récents et alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Sales</CardTitle>
              <p className="text-sm text-gray-500 mt-1">You made 265 sales this month.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentSales.map((sale) => (
                  <div key={sale.email} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
                        {sale.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 leading-tight">{sale.name}</p>
                        <p className="text-xs text-gray-500">{sale.email}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900 text-base">+{sale.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertes Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-900">
                      Stock faible - Coca-Cola 33cl
                    </p>
                    <p className="text-sm text-red-600">
                      Seulement 5 unités en stock
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-900">
                      Expiration proche - Pain au Chocolat
                    </p>
                    <p className="text-sm text-yellow-600">
                      Expire dans 2 jours
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-900">
                      Stock optimal - Heineken 25cl
                    </p>
                    <p className="text-sm text-green-600">
                      32 unités en stock
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modale d'édition avancée avec animations */}
      <AnimatePresence>
      {editModal.open && editModal.item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl relative"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-150" onClick={handleEditClose} title="Fermer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-black">Modifier le produit</h2>
            <div className="flex items-center gap-4 mb-4">
              <motion.img
                src={editModal.imagePreview || "/public/file.svg"}
                alt={editModal.item.name}
                className="w-16 h-16 rounded-full object-cover border"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <div>
                <div className="font-semibold text-gray-900 text-sm">ID: {editModal.item.id}...</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-black`}>{editModal.item.category}</span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
              <motion.div
                className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition relative"
                whileHover={{ scale: 1.03, boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)" }}
                onDrop={handleEditImageDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => document.getElementById('edit-image-input')?.click()}
              >
                {editModal.imagePreview ? (
                  <motion.img
                    src={editModal.imagePreview}
                    alt="Aperçu"
                    className="w-16 h-16 rounded-full object-cover mb-2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <motion.svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></motion.svg>
                )}
                <div className="text-xs text-gray-500 text-center">Cliquez ou glissez une image<br />JPG, PNG • Max 5MB</div>
                <input id="edit-image-input" type="file" accept="image/*" className="hidden" onChange={e => e.target.files && handleEditImage(e.target.files[0])} />
                {editModal.imagePreview && (
                  <motion.button className="absolute left-2 bottom-2 text-red-600 text-xs flex items-center gap-1 hover:scale-105 transition-transform" onClick={e => { e.stopPropagation(); handleEditImageRemove(); }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Supprimer l'image
                  </motion.button>
                )}
                {!editModal.imagePreview && (
                  <span className="absolute right-2 bottom-2 text-xs text-gray-400 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Image par défaut</span>
                )}
              </motion.div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                <Input value={editModal.item.name} onChange={e => handleEditChange('name', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <Select value={editModal.item.category} onValueChange={v => handleEditChange('category', v)}>
                  <SelectTrigger className="bg-white text-black border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="Viandes" className="text-black">Viandes</SelectItem>
                    <SelectItem value="Légumes" className="text-black">Légumes</SelectItem>
                    <SelectItem value="Condiments" className="text-black">Condiments</SelectItem>
                    <SelectItem value="Poissons" className="text-black">Poissons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                <Input value={editModal.item.unit} onChange={e => handleEditChange('unit', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                <Input type="number" value={editModal.item.quantity} onChange={e => handleEditChange('quantity', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seuil minimum</label>
                <Input type="number" value={editModal.item.min} onChange={e => handleEditChange('min', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (€)</label>
                <Input type="number" step="0.01" value={editModal.item.unitPrice} onChange={e => handleEditChange('unitPrice', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                <Input value={editModal.item.supplier} onChange={e => handleEditChange('supplier', e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <motion.button className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={handleEditClose} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>Annuler</motion.button>
              <motion.button className="px-4 py-2 rounded bg-black text-white hover:bg-gray-900 font-semibold flex items-center gap-2" onClick={handleEditSave} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Enregistrer
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Indicateur de loading et modal de validation */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2">Analyse du PDF en cours...</p>
          </div>
        </div>
      )}
      <ValidationModal
        validationModalOpen={validationModalOpen}
        scanResults={scanResults}
        setValidationModalOpen={setValidationModalOpen}
        setScanResults={setScanResults}
        scanType={scanType}
        applyToInventory={handleIaValidate}
      />
      <ModalValidationIA
        open={iaModalOpen}
        setOpen={setIaModalOpen}
        products={iaProducts}
        setProducts={setIaProducts}
        scanType={iaScanType}
        onValidate={handleIaValidate}
        inventory={inventory}
      />
    </MainLayout>
  )
}

// Déclare ValidationModal comme composant interne avec props typés
interface ValidationModalProps {
  validationModalOpen: boolean;
  scanResults: ScanResult | null;
  setValidationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setScanResults: React.Dispatch<React.SetStateAction<ScanResult | null>>;
  scanType: 'delivery' | 'receipt';
  applyToInventory: (products: ScannedProduct[], type: 'delivery' | 'receipt') => void;
}
function ValidationModal({ validationModalOpen, scanResults, setValidationModalOpen, setScanResults, scanType, applyToInventory }: ValidationModalProps) {
  if (!validationModalOpen || !scanResults) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Produits détectés - {scanType === 'delivery' ? 'Bon de commande' : 'Ticket de caisse'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Produit</th>
                <th className="border border-gray-300 p-2">Quantité</th>
                <th className="border border-gray-300 p-2">Prix</th>
                <th className="border border-gray-300 p-2">Catégorie</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scanResults.products.map((product: ScannedProduct, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{product.name}</td>
                  <td className="border border-gray-300 p-2">{product.quantity ?? product.quantitySold}</td>
                  <td className="border border-gray-300 p-2">{product.unitPrice ?? product.salePrice}€</td>
                  <td className="border border-gray-300 p-2">{product.category ?? '-'}</td>
                  <td className="border border-gray-300 p-2">
                    <button className="text-red-600 hover:text-red-800" onClick={() => {
                      setScanResults((prev) => prev ? {
                        ...prev,
                        products: prev.products.filter((_, i) => i !== index)
                      } : prev)
                    }}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => {
              setValidationModalOpen(false);
              setScanResults(null);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              applyToInventory(scanResults.products, scanType);
              setValidationModalOpen(false);
              setScanResults(null);
              alert('Stock mis à jour avec succès !');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Valider et appliquer au stock
          </button>
        </div>
      </div>
    </div>
  );
}

// Squelette du composant ModalValidationIA (à la fin du fichier)
interface ModalValidationIAProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  products: ScannedProduct[];
  setProducts: React.Dispatch<React.SetStateAction<ScannedProduct[]>>;
  scanType: 'delivery' | 'receipt';
  onValidate: (products: ScannedProduct[], scanType: 'delivery' | 'receipt') => void;
  inventory: ProductPrisma[];
}
function ModalValidationIA({ open, setOpen, products, setProducts, scanType, onValidate, inventory }: ModalValidationIAProps) {
  const handleProductChange = (index: number, field: keyof ScannedProduct, value: string | number) => {
    const updatedProducts = [...products];
    const productToUpdate = { ...updatedProducts[index] };
    
    const numericFields: (keyof ScannedProduct)[] = ['quantity', 'unitPrice', 'quantitySold', 'salePrice'];

    if (numericFields.includes(field)) {
        (productToUpdate as any)[field] = Number(value) || 0;
    } else {
        (productToUpdate as any)[field] = String(value);
    }
    
    updatedProducts[index] = productToUpdate;
    setProducts(updatedProducts);
  };

  const handleValidate = () => {
    onValidate(products, scanType);
    setOpen(false);
  }

  const getStatus = (prod: ScannedProduct) => {
    return inventory.find(i => i.name.toLowerCase() === prod.name.toLowerCase()) 
      ? <Badge variant="outline" className="text-green-600 border-green-200">✅ En stock</Badge> 
      : <Badge variant="outline" className="text-blue-600 border-blue-200">🆕 Nouveau</Badge>
  }

  const handleClose = () => {
    setOpen(false);
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h2 className="text-xl font-bold mb-4 text-black flex items-center gap-2">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4" /></svg>
              Produits détectés par IA <span className="text-gray-500">({products.length})</span>
              <span className="ml-auto bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded capitalize">{scanType}</span>
            </h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {products.map((prod, idx) => (
                <motion.div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-4 flex flex-col gap-1 relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  layout
                >
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      className="font-semibold text-lg text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 outline-none flex-1 min-w-0"
                      value={prod.name}
                      onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                    />
                    {getStatus(prod)}
                  </div>
                  <div className="flex flex-wrap gap-4 items-center text-sm mb-1">
                    <div>
                      Quantité :
                      <input
                        type="number"
                        className="ml-1 w-16 px-1 py-0.5 border border-gray-200 rounded focus:border-blue-500 outline-none"
                        value={prod.quantity ?? ''}
                        min={0}
                        onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                      />
                      <input
                        type="text"
                        className="ml-1 w-10 px-1 py-0.5 border border-gray-200 rounded focus:border-blue-500 outline-none"
                        value={prod.unit ?? 'pcs'}
                        onChange={(e) => handleProductChange(idx, 'unit', e.target.value)}
                      />
                    </div>
                    <div>
                      Catégorie :
                      <select
                        className="ml-1 px-2 py-0.5 border border-gray-200 rounded focus:border-blue-500 outline-none"
                        value={prod.category ?? ''}
                        onChange={(e) => handleProductChange(idx, 'category', e.target.value)}
                      >
                        <option value="">Choisir</option>
                        {['Viandes', 'Légumes', 'Condiments', 'Poissons'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      Prix unitaire :
                      <input
                        type="number"
                        className="ml-1 w-16 px-1 py-0.5 border border-gray-200 rounded focus:border-blue-500 outline-none"
                        value={prod.unitPrice ?? ''}
                        min={0}
                        step={0.01}
                        onChange={(e) => handleProductChange(idx, 'unitPrice', e.target.value)}
                      /> €
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>📁 Sera classé dans : <span className="font-medium">{prod.category || 'Non défini'}</span></span>
                    <span className="text-blue-500">Image appropriée sera assignée automatiquement</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.button
              className="w-full mt-6 py-3 rounded bg-yellow-700 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-yellow-800"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleValidate}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Ajouter au Stock
            </motion.button>
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={handleClose} title="Fermer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
