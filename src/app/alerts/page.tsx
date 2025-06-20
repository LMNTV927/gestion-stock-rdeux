"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  AlertTriangle, 
  Clock, 
  Package, 
  Bell, 
  CheckCircle, 
  X,
  Filter,
  Settings
} from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Alert {
  id: string
  type: 'low_stock' | 'expiry_warning' | 'high_waste' | 'system_alert'
  title: string
  message: string
  product?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  isRead: boolean
  createdAt: string
  actionRequired?: boolean
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "low_stock",
    title: "Stock Faible - Coca-Cola 33cl",
    message: "Seulement 5 unités en stock. Seuil minimum: 20 unités.",
    product: "Coca-Cola 33cl",
    severity: "high",
    isRead: false,
    createdAt: "2024-01-15T14:30:00Z",
    actionRequired: true
  },
  {
    id: "2",
    type: "expiry_warning",
    title: "Expiration Proche - Pain au Chocolat",
    message: "Expire dans 2 jours. 15 unités concernées.",
    product: "Pain au Chocolat",
    severity: "medium",
    isRead: false,
    createdAt: "2024-01-15T13:15:00Z",
    actionRequired: true
  },
  {
    id: "3",
    type: "high_waste",
    title: "Gaspillage Élevé - Heineken 25cl",
    message: "Taux de gaspillage de 4.1% ce mois. Au-dessus de la moyenne.",
    product: "Heineken 25cl",
    severity: "medium",
    isRead: true,
    createdAt: "2024-01-15T12:00:00Z",
    actionRequired: false
  },
  {
    id: "4",
    type: "low_stock",
    title: "Stock Faible - Croissant",
    message: "Seulement 3 unités en stock. Seuil minimum: 12 unités.",
    product: "Croissant",
    severity: "critical",
    isRead: false,
    createdAt: "2024-01-15T11:45:00Z",
    actionRequired: true
  },
  {
    id: "5",
    type: "system_alert",
    title: "Sauvegarde Automatique",
    message: "Sauvegarde quotidienne effectuée avec succès.",
    severity: "low",
    isRead: true,
    createdAt: "2024-01-15T06:00:00Z",
    actionRequired: false
  },
  {
    id: "6",
    type: "expiry_warning",
    title: "Expiration Proche - Chips Lays",
    message: "Expire dans 5 jours. 28 unités concernées.",
    product: "Chips Lays Nature",
    severity: "low",
    isRead: true,
    createdAt: "2024-01-15T10:30:00Z",
    actionRequired: false
  }
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [filterType, setFilterType] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("")
  const [showRead, setShowRead] = useState(true)

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = !filterType || alert.type === filterType
    const matchesSeverity = !filterSeverity || alert.severity === filterSeverity
    const matchesRead = showRead || !alert.isRead
    
    return matchesType && matchesSeverity && matchesRead
  })

  const unreadCount = alerts.filter(alert => !alert.isRead).length
  const criticalCount = alerts.filter(alert => alert.severity === 'critical' && !alert.isRead).length
  const highCount = alerts.filter(alert => alert.severity === 'high' && !alert.isRead).length

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ))
  }

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))
  }

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critique</Badge>
      case 'high':
        return <Badge variant="destructive">Élevée</Badge>
      case 'medium':
        return <Badge variant="warning">Moyenne</Badge>
      case 'low':
        return <Badge variant="secondary">Faible</Badge>
      default:
        return <Badge variant="secondary">Faible</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <Package className="h-5 w-5 text-red-500" />
      case 'expiry_warning':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'high_waste':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'system_alert':
        return <Bell className="h-5 w-5 text-blue-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alertes & Notifications</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos alertes de stock et notifications système
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Statistiques des alertes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertes Non Lues</p>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                </div>
                <Bell className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critiques</p>
                  <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Élevées</p>
                  <p className="text-2xl font-bold text-orange-600">{highCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actions Requises</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {alerts.filter(a => a.actionRequired && !a.isRead).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les types</SelectItem>
                  <SelectItem value="low_stock">Stock Faible</SelectItem>
                  <SelectItem value="expiry_warning">Expiration</SelectItem>
                  <SelectItem value="high_waste">Gaspillage</SelectItem>
                  <SelectItem value="system_alert">Système</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les sévérités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les sévérités</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={showRead ? "all" : "unread"} onValueChange={(value) => setShowRead(value === "all")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les alertes</SelectItem>
                  <SelectItem value="unread">Non lues seulement</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => {
                  setFilterType("")
                  setFilterSeverity("")
                  setShowRead(true)
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des alertes */}
        <Card>
          <CardHeader>
            <CardTitle>Alertes ({filteredAlerts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    alert.isRead 
                      ? 'bg-gray-50 border-gray-200' 
                      : getSeverityColor(alert.severity)
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium ${alert.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                            {alert.title}
                          </h3>
                          {getSeverityBadge(alert.severity)}
                          {alert.actionRequired && !alert.isRead && (
                            <Badge variant="destructive">Action Requise</Badge>
                          )}
                        </div>
                        <p className={`text-sm ${alert.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(alert.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!alert.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredAlerts.length === 0 && (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune alerte trouvée</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Paramètres des alertes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres des Alertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Seuils de Stock</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Stock faible</span>
                    <span className="text-sm text-gray-500">≤ 20% du stock moyen</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Stock critique</span>
                    <span className="text-sm text-gray-500">≤ 10% du stock moyen</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <Badge variant="success">Activé</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Push</span>
                    <Badge variant="success">Activé</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">SMS</span>
                    <Badge variant="secondary">Désactivé</Badge>
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