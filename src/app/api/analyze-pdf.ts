import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  try {
    // TODO: Appel réel à OpenAI ici (GPT-4 Vision ou Doc AI)
    // Pour l'instant, mock de parsing :
    await new Promise(r => setTimeout(r, 2000));
    return res.status(200).json({
      products: [
        { name: 'Filet de poulet', quantity: 3, category: 'Viandes & Poissons', unitPrice: 12.5, unit: 'kg' },
        { name: 'Tomates fraîches', quantity: 10, category: 'Fruits & Légumes', unitPrice: 2.1, unit: 'kg' },
        { name: 'Mozzarella di Bufala', quantity: 12, category: 'Produits Laitiers', unitPrice: 1.8, unit: 'pcs' },
        { name: 'Riz basmati', quantity: 4, category: 'Pâtes & Céréales', unitPrice: 1.2, unit: 'kg' },
        { name: 'Coca-Cola', quantity: 72, category: 'Boissons', unitPrice: 0.8, unit: 'pcs' },
      ]
    });
  } catch (e: unknown) {
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Erreur serveur' });
  }
} 
