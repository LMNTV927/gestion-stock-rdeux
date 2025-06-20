"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { BarChart } from "@/components/charts/line-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle,
  Download,
  Filter
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Données de démonstration pour les graphiques
const monthlyData = [
  { name: "Jan", stockValue: 42000, wasteValue: 280, sales: 38500, entries: 45000 },
  { name: "Fév", stockValue: 43500, wasteValue: 320, sales: 39800, entries: 44000 },
  { name: "Mar", stockValue: 44800, wasteValue: 290, sales: 41200, entries: 46000 },
  { name: "Avr", stockValue: 45230, wasteValue: 320, sales: 42500, entries: 47000 },
  { name: "Mai", stockValue: 46800, wasteValue: 350, sales: 43800, entries: 48000 },
  { name: "Juin", stockValue: 47500, wasteValue: 380, sales: 44500, entries: 49000 },
]

const wasteData = [
  { name: "Coca-Cola 33cl", wasteQuantity: 45, wasteValue: 20.25, wastePercentage: 3.2 },
  { name: "Heineken 25cl", wasteQuantity: 32, wasteValue: 27.20, wastePercentage: 4.1 },
  { name: "Chips Lays Nature", wasteQuantity: 28, wasteValue: 9.80, wastePercentage: 2.8 },
  { name: "Pain au Chocolat", wasteQuantity: 15, wasteValue: 12.00, wastePercentage: 5.5 },
  { name: "Café Expresso", wasteQuantity: 8, wasteValue: 9.60, wastePercentage: 1.8 },
]

const topProducts = [
  { name: "Coca-Cola 33cl", sales: 1250, revenue: 1500.00, margin: 0.75 },
  { name: "Heineken 25cl", sales: 980, revenue: 2450.00, margin: 1.65 },
  { name: "Chips Lays Nature", sales: 850, revenue: 1530.00, margin: 1.18 },
  { name: "Pain au Chocolat", sales: 720, revenue: 1080.00, margin: 0.70 },
  { name: "Café Expresso", sales: 680, revenue: 816.00, margin: 0.36 },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("6")

  const totalWasteValue = wasteData.reduce((sum, item) => sum + item.wasteValue, 0)
  const averageWastePercentage = wasteData.reduce((sum, item) => sum + item.wastePercentage, 0) / wasteData.length

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Rapports</h1>
            <p className="text-gray-600 mt-2">
              Analysez vos performances et optimisez votre gestion de stock
            </p>
          </div>
          <div className="flex space-x-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 mois</SelectItem>
                <SelectItem value="6">6 mois</SelectItem>
                <SelectItem value="12">12 mois</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valeur Stock Actuel</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(47500)}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8.5%</span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gaspillage Total</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalWasteValue)}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">+2.1%</span>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Gaspillage</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {averageWastePercentage.toFixed(1)}%
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">-0.3%</span>
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rotation Stock</p>
                  <p className="text-2xl font-bold text-gray-900">4.2x</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+0.3x</span>
                  </div>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart
            data={monthlyData}
            title="Évolution Stock vs Gaspillage"
            dataKeys={[
              { key: "stockValue", name: "Valeur Stock" },
              { key: "wasteValue", name: "Gaspillage" },
            ]}
            height={350}
          />
          
          <BarChart
            data={monthlyData}
            title="Entrées vs Sorties"
            dataKeys={[
              { key: "entries", name: "Entrées" },
              { key: "sales", name: "Ventes" },
            ]}
            height={350}
          />
        </div>

        {/* Analyse du gaspillage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Analyse du Gaspillage par Produit
            </CardTitle>
            <p className="text-sm text-gray-600">
              Produits avec le plus de gaspillage sur les {period} derniers mois
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wasteData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-red-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.wasteQuantity} unités gaspillées
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-medium text-red-600">
                        {formatCurrency(item.wasteValue)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Valeur perdue
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {item.wastePercentage.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Taux gaspillage
                      </p>
                    </div>
                    
                    <Badge 
                      variant={item.wastePercentage > 5 ? "destructive" : "warning"}
                    >
                      {item.wastePercentage > 5 ? "Élevé" : "Modéré"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top produits rentables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Produits les Plus Rentables
            </CardTitle>
            <p className="text-sm text-gray-600">
              Produits avec la meilleure marge sur les {period} derniers mois
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {product.sales} ventes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(product.revenue)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Chiffre d&apos;affaires
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {formatCurrency(product.margin)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Marge unitaire
                      </p>
                    </div>
                    
                    <Badge variant="success">
                      Rentable
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommandations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-500" />
              Recommandations d&apos;Amélioration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Réduire le Gaspillage</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">Pain au Chocolat</p>
                      <p className="text-sm text-yellow-700">
                        Taux de gaspillage élevé (5.5%). Réduire les commandes de 15%.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Heineken 25cl</p>
                      <p className="text-sm text-red-700">
                        Gaspillage en hausse. Vérifier les dates d&apos;expiration.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Optimiser les Commandes</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Coca-Cola 33cl</p>
                      <p className="text-sm text-green-700">
                        Forte demande. Augmenter les commandes de 20%.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Package className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Café Expresso</p>
                      <p className="text-sm text-blue-700">
                        Stock optimal. Maintenir les commandes actuelles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 