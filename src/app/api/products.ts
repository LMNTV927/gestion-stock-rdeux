import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Liste tous les produits
    const products = await prisma.product.findMany();
    return res.status(200).json(products);
  }
  if (req.method === 'POST') {
    // Ajoute un produit
    const { name, quantity, unit, min, unitPrice, category, supplier, image, lastUpdate, status, statusColor } = req.body;
    const product = await prisma.product.create({
      data: { name, quantity, unit, min, unitPrice, category, supplier, image, lastUpdate, status, statusColor }
    });
    return res.status(201).json(product);
  }
  if (req.method === 'DELETE') {
    // Supprime un produit par id
    const { id } = req.body;
    await prisma.product.delete({ where: { id } });
    return res.status(204).end();
  }
  if (req.method === 'PUT') {
    // Modifie un produit par id
    const { id, ...data } = req.body;
    const product = await prisma.product.update({ where: { id }, data });
    return res.status(200).json(product);
  }
  return res.status(405).json({ error: 'Méthode non autorisée' });
} 