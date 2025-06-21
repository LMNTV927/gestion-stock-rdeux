"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  AlertTriangle,
  Euro,
  Package,
  ShoppingCart,
  ReceiptText,
  TrendingUp,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useRef, useState, useEffect, ChangeEvent } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import type { ProductPrisma } from '@/types'
import Image from "next/image"

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

export default function DashboardPage() {
    const bonCmdInputRef = useRef<HTMLInputElement>(null);
    const ticketInputRef = useRef<HTMLInputElement>(null);
    const [inventory, setInventory] = useState<ProductPrisma[]>([]);
    const [editModal, setEditModal] = useState<{
        open: boolean;
        item: ProductPrisma | null;
        imageFile?: File | null;
        imagePreview?: string | null;
    }>({ open: false, item: null, imageFile: null, imagePreview: null });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [iaModalOpen, setIaModalOpen] = useState(false);
    const [iaProducts, setIaProducts] = useState<ScannedProduct[]>([]);
    const [iaScanType, setIaScanType] = useState<'delivery' | 'receipt'>('delivery');

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => setInventory(data));
    }, []);

    const totalProducts = inventory.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const totalValue = inventory.reduce((acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0), 0);
    const lowStockProducts = inventory.filter((item) => (item.quantity || 0) < (item.min || 0)).length;

    const getCategoryColor = (category: string) => {
        switch (category?.toLowerCase()) {
            case 'viandes':
            case 'viandes & poissons':
                return 'bg-red-100 text-red-700';
            case 'légumes':
            case 'fruits & légumes':
                return 'bg-green-100 text-green-700';
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

    const handleDelete = async (id: string) => {
        if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
            await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await fetch('/api/products').then((res) => res.json());
            setInventory(data);
        }
    };

    const handleEdit = (item: ProductPrisma) => {
        setEditModal({ open: true, item: { ...item }, imageFile: null, imagePreview: item.image });
    };

    const handleEditChange = (field: string, value: string | number) => {
        setEditModal((prev) =>
            prev.item ? { ...prev, item: { ...prev.item, [field]: value } } : prev
        );
    };

    const handleEditImage = (file: File | null) => {
        if (!file) {
            setEditModal((prev) =>
                prev.item ? { ...prev, imageFile: null, imagePreview: null } : prev
            );
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setEditModal((prev) =>
                prev.item
                    ? {
                        ...prev,
                        imageFile: file,
                        imagePreview: e.target?.result as string,
                    }
                    : prev
            );
        };
        reader.readAsDataURL(file);
    };

    const handleEditImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleEditImage(e.dataTransfer.files[0]);
        }
    };

    const handleEditImageRemove = () => {
        setEditModal((prev) =>
            prev.item ? { ...prev, imageFile: null, imagePreview: null } : prev
        );
    };

    const handleEditSave = async () => {
        if (!editModal.item) return;
        await fetch('/api/products', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...editModal.item,
                image: editModal.imagePreview || editModal.item.image,
            }),
        });
        const data = await fetch('/api/products').then((res) => res.json());
        setInventory(data);
        setEditModal({ open: false, item: null, imageFile: null, imagePreview: null });
    };

    const handleEditClose = () =>
        setEditModal({ open: false, item: null, imageFile: null, imagePreview: null });

    const handleIaValidate = async (
        products: ScannedProduct[],
        type: 'delivery' | 'receipt'
    ) => {
        const productsToUpsert: Partial<ProductPrisma>[] = [];

        if (type === 'delivery') {
            products.forEach((prod) => {
                const { name, quantity, category, unitPrice, unit } = prod;
                const existingProduct = inventory.find(
                    (item) => item.name.toLowerCase() === name?.toLowerCase()
                );

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
        } else {
            products.forEach((prod) => {
                const { name, quantitySold } = prod;
                const existingProduct = inventory.find(
                    (item) => item.name.toLowerCase() === name?.toLowerCase()
                );
                if (existingProduct) {
                    productsToUpsert.push({
                        id: existingProduct.id,
                        quantity: Math.max(
                            0,
                            (existingProduct.quantity || 0) - (quantitySold || 0)
                        ),
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

        const data = await fetch('/api/products').then((res) => res.json());
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

    const handleFileUploadIA = async (
        e: ChangeEvent<HTMLInputElement>,
        scanType: 'delivery' | 'receipt'
    ) => {
        const file = e.target.files?.[0];
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
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Une erreur inconnue est survenue.";
            alert(message);
        } finally {
            setIsAnalyzing(false);
            if (e.target) e.target.value = ''; 
        }
    };

    return (
        <>
            <MainLayout>
                <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatsCard title="Valeur totale du stock" value={formatCurrency(totalValue)} icon={<Euro className="h-4 w-4 text-muted-foreground" />} />
                        <StatsCard title="Produits en stock" value={String(totalProducts)} icon={<Package className="h-4 w-4 text-muted-foreground" />} />
                        <StatsCard title="Produits en stock faible" value={String(lowStockProducts)} icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />} />
                        <StatsCard title="Moyenne des ventes" value="+573" description="+20.1% depuis le mois dernier" icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Bon de commande</CardTitle>
                                <ReceiptText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground mb-2">Scannez un bon de commande pour ajouter des produits au stock.</p>
                                <ButtonWithLoader
                                    isAnalyzing={isAnalyzing && iaScanType === 'delivery'}
                                    inputId="bon-cmd-input"
                                >
                                    Scanner le bon
                                </ButtonWithLoader>
                                <input id="bon-cmd-input" type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUploadIA(e, 'delivery')} ref={bonCmdInputRef} />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Ticket de caisse</CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground mb-2">Scannez un ticket pour décrémenter les produits vendus.</p>
                                <ButtonWithLoader
                                    isAnalyzing={isAnalyzing && iaScanType === 'receipt'}
                                    inputId="ticket-input"
                                >
                                    Scanner le ticket
                                </ButtonWithLoader>
                                <input id="ticket-input" type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUploadIA(e, 'receipt')} ref={ticketInputRef} />
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Inventaire</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&>tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Produit</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">Catégorie</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right">Prix Unitaire</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right">Quantité</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right">Statut</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&>tr:last-child]:border-0">
                                        {inventory.map(item => (
                                            <tr key={item.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                                                            <Image src={item.image || '/file.svg'} alt={item.name} width={24} height={24} className="w-6 h-6 object-contain" />
                                                        </div>
                                                        <span>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-gray-500">
                                                    <Badge className={`px-2 py-1 text-xs ${getCategoryColor(item.category || "")}`}>
                                                        {item.category}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium text-right text-gray-700">{formatCurrency(item.unitPrice || 0)}</td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-gray-500 text-right">{item.quantity} {item.unit}</td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                                    <Badge className={item.statusColor || ''}>{item.status}</Badge>
                                                </td>
                                                <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                                                    <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 mr-2">Modifier</button>
                                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">Supprimer</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>

            <AnimatePresence>
                {editModal.open && editModal.item && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleEditClose}
                    >
                        <motion.div
                            className="bg-white rounded-xl p-6 w-full max-w-lg mx-4"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div
                                    className="relative w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 overflow-hidden bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                    onDrop={handleEditImageDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    {editModal.imagePreview ? (
                                        <>
                                            <Image src={editModal.imagePreview} alt="Aperçu" layout="fill" objectFit="cover" />
                                            <button onClick={handleEditImageRemove} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center z-10">&times;</button>
                                        </>
                                    ) : (
                                        <div className="text-center"><Package size={32} /><p className="text-xs mt-1">Glisser</p></div>
                                    )}
                                    <input type="file" accept="image/*" onChange={(e) => handleEditImage(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800">{editModal.item?.name}</h3>
                                    <p className="text-sm text-gray-500">Modifier les informations du produit</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Nom du produit</label>
                                    <Input value={editModal.item.name} onChange={(e) => handleEditChange('name', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Quantité</label>
                                    <Input type="number" value={editModal.item.quantity} onChange={(e) => handleEditChange('quantity', Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Prix Unitaire</label>
                                    <Input type="number" step="0.01" value={editModal.item.unitPrice} onChange={(e) => handleEditChange('unitPrice', Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Stock Minimum</label>
                                    <Input type="number" value={editModal.item.min} onChange={(e) => handleEditChange('min', Number(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Unité</label>
                                    <Input value={editModal.item.unit} onChange={(e) => handleEditChange('unit', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Catégorie</label>
                                    <Select value={editModal.item.category || ""} onValueChange={(value) => handleEditChange('category', value)}>
                                        <SelectTrigger><SelectValue placeholder="Choisir..." /></SelectTrigger>
                                        <SelectContent>
                                            {['Viandes', 'Légumes', 'Condiments', 'Poissons', 'Boissons', 'Produits Laitiers', 'Pâtes & Céréales'].map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button onClick={handleEditClose} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Annuler</button>
                                <button onClick={handleEditSave} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Enregistrer</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ModalValidationIA
                open={iaModalOpen}
                setOpen={setIaModalOpen}
                products={iaProducts}
                setProducts={setIaProducts}
                scanType={iaScanType}
                onValidate={handleIaValidate}
                inventory={inventory}
            />
        </>
    );
}

const ButtonWithLoader = ({ isAnalyzing, inputId, children }: { isAnalyzing: boolean, inputId: string, children: React.ReactNode }) => (
    <button
        onClick={() => document.getElementById(inputId)?.click()}
        disabled={isAnalyzing}
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors flex items-center justify-center"
    >
        {isAnalyzing ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyse en cours...
            </>
        ) : children}
    </button>
);


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

        const anyProductToUpdate = productToUpdate as any;
        if (numericFields.includes(field)) {
            anyProductToUpdate[field] = Number(value) || 0;
        } else {
            anyProductToUpdate[field] = String(value);
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
                    onClick={handleClose}
                >
                    <motion.div
                        className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
                        exit={{ y: 50, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Valider les produits scannés</h2>
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <motion.div layout className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                            {products.map((prod, idx) => (
                                <motion.div layout key={idx} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            className="font-semibold text-lg text-gray-900 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 outline-none flex-1 min-w-0"
                                            value={prod.name}
                                            onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
                                        />
                                        {getStatus(prod)}
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3">
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-24">Quantité:</span>
                                            <input
                                                type="number"
                                                className="w-16 px-2 py-0.5 border border-gray-200 rounded focus:border-blue-500 outline-none"
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
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-24">Catégorie:</span>
                                            <select
                                                className="ml-1 px-2 py-0.5 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                value={prod.category ?? ''}
                                                onChange={(e) => handleProductChange(idx, 'category', e.target.value)}
                                            >
                                                <option value="">Choisir</option>
                                                {['Viandes', 'Légumes', 'Condiments', 'Poissons', 'Boissons', 'Produits Laitiers', 'Pâtes & Céréales'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-24">Prix Unitaire:</span>
                                            <input
                                                type="number"
                                                className="w-16 px-2 py-0.5 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                value={prod.unitPrice ?? ''}
                                                min={0}
                                                step={0.01}
                                                onChange={(e) => handleProductChange(idx, 'unitPrice', e.target.value)}
                                            /> €
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                            className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleValidate}
                        >
                            <CheckCircle size={20} />
                            Valider et Mettre à jour le Stock
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
