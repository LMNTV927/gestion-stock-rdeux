import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
// import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Utilitaire pour parser le form-data
/* function parseForm(req: NextApiRequest): Promise<{ file: formidable.File }> {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      if (!files.file) return reject(new Error('Aucun fichier envoyé'));
      resolve({ file: Array.isArray(files.file) ? files.file[0] : files.file });
    });
  });
} */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  try {
    // const { file } = await parseForm(req);
    // Lecture du buffer du PDF
    // const pdfBuffer = fs.readFileSync(file.filepath); // Gardé pour future utilisation avec l'API OpenAI
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
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur serveur';
    return res.status(500).json({ error: message });
  }
} 