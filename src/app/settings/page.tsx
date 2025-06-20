"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Save,
  Eye,
  EyeOff,
  Key,
  Mail,
  Smartphone
} from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    companyName: "VDeux",
    email: "admin@vdeux.com",
    phone: "+33 1 23 45 67 89",
    currency: "EUR",
    language: "fr",
    timezone: "Europe/Paris",
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    stockThresholds: {
      lowStock: 20,
      criticalStock: 10,
      wasteThreshold: 5
    },
    aiSettings: {
      enabled: true,
      accuracy: 95,
      autoProcess: true
    }
  })

  const tabs = [
    { id: "general", name: "Général", icon: Settings },
    { id: "profile", name: "Profil", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Sécurité", icon: Shield },
    { id: "ai", name: "IA & OCR", icon: Database },
  ]

  const handleSave = () => {
    // Ici on sauvegarderait les paramètres
    alert("Paramètres sauvegardés avec succès !")
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-2">
            Configurez votre application de gestion de stock
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation des onglets */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenu des onglets */}
          <div className="lg:col-span-3">
            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Paramètres Généraux
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom de l&apos;entreprise</label>
                      <Input
                        value={settings.companyName}
                        onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email de contact</label>
                      <Input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Téléphone</label>
                      <Input
                        value={settings.phone}
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Devise</label>
                      <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Langue</label>
                      <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fuseau horaire</label>
                      <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profil Utilisateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-500" />
                    </div>
                    <div>
                      <Button variant="outline">Changer la photo</Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom complet</label>
                      <Input value="Administrateur" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input type="email" value="admin@vdeux.com" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Rôle</label>
                      <Input value="Administrateur" disabled className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date d&apos;inscription</label>
                      <Input value="15/01/2024" disabled className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Ancien mot de passe</label>
                        <div className="relative mt-1">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                        <Input type="password" placeholder="••••••••" className="mt-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Paramètres des Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Canaux de notification</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900">Notifications par email</p>
                            <p className="text-sm text-gray-500">Recevoir les alertes par email</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.notifications.email}
                          onCheckedChange={(checked: boolean) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, email: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-gray-900">Notifications push</p>
                            <p className="text-sm text-gray-500">Alertes en temps réel dans le navigateur</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.notifications.push}
                          onCheckedChange={(checked: boolean) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, push: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="font-medium text-gray-900">Notifications SMS</p>
                            <p className="text-sm text-gray-500">Alertes critiques par SMS</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.notifications.sms}
                          onCheckedChange={(checked: boolean) => setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, sms: checked }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Seuils d&apos;alerte</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Stock faible (%)</label>
                        <Input
                          type="number"
                          value={settings.stockThresholds.lowStock}
                          onChange={(e) => setSettings({
                            ...settings,
                            stockThresholds: { ...settings.stockThresholds, lowStock: Number(e.target.value) }
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Stock critique (%)</label>
                        <Input
                          type="number"
                          value={settings.stockThresholds.criticalStock}
                          onChange={(e) => setSettings({
                            ...settings,
                            stockThresholds: { ...settings.stockThresholds, criticalStock: Number(e.target.value) }
                          })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Seuil gaspillage (%)</label>
                        <Input
                          type="number"
                          value={settings.stockThresholds.wasteThreshold}
                          onChange={(e) => setSettings({
                            ...settings,
                            stockThresholds: { ...settings.stockThresholds, wasteThreshold: Number(e.target.value) }
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Authentification</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Key className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                            <p className="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
                          </div>
                        </div>
                        <Button variant="outline">Configurer</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-gray-900">Sessions actives</p>
                            <p className="text-sm text-gray-500">2 sessions actives</p>
                          </div>
                        </div>
                        <Button variant="outline">Gérer</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Journal d&apos;activité</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Connexion réussie</p>
                          <p className="text-sm text-gray-500">Il y a 2 heures • 192.168.1.100</p>
                        </div>
                        <Badge variant="success">Succès</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Modification des paramètres</p>
                          <p className="text-sm text-gray-500">Il y a 1 jour • 192.168.1.100</p>
                        </div>
                        <Badge variant="secondary">Info</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "ai" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Configuration IA & OCR
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Paramètres IA</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Database className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-gray-900">Analyse IA activée</p>
                            <p className="text-sm text-gray-500">Utiliser l&apos;IA pour analyser les documents</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.aiSettings.enabled}
                          onCheckedChange={(checked: boolean) => setSettings({
                            ...settings,
                            aiSettings: { ...settings.aiSettings, enabled: checked }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Database className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium text-gray-900">Traitement automatique</p>
                            <p className="text-sm text-gray-500">Traiter automatiquement les documents uploadés</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.aiSettings.autoProcess}
                          onCheckedChange={(checked: boolean) => setSettings({
                            ...settings,
                            aiSettings: { ...settings.aiSettings, autoProcess: checked }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Performance IA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Précision minimale (%)</label>
                        <Input
                          type="number"
                          value={settings.aiSettings.accuracy}
                          onChange={(e) => setSettings({
                            ...settings,
                            aiSettings: { ...settings.aiSettings, accuracy: Number(e.target.value) }
                          })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Seuil de confiance pour l&apos;analyse automatique
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Modèle IA</label>
                        <Select defaultValue="gpt-4-vision">
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpt-4-vision">GPT-4 Vision</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                            <SelectItem value="claude-3">Claude 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques IA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">Documents traités</p>
                        <p className="text-2xl font-bold text-blue-600">1,247</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">Taux de réussite</p>
                        <p className="text-2xl font-bold text-green-600">96.8%</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-900">Temps moyen</p>
                        <p className="text-2xl font-bold text-purple-600">2.3s</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder les paramètres
          </Button>
        </div>
      </div>
    </MainLayout>
  )
} 