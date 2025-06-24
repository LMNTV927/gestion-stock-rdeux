import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Liste tous les produits
  const products = await prisma.product.findMany();
  return NextResponse.json(products, { status: 200 });
}

export async function POST(request: NextRequest) {
  // Ajoute un produit
  const body = await request.json();
  const { name, quantity, unit, min, unitPrice, category, supplier, image, lastUpdate, status, statusColor } = body;
  const product = await prisma.product.create({
    data: { name, quantity, unit, min, unitPrice, category, supplier, image, lastUpdate, status, statusColor }
  });
  return NextResponse.json(product, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  // Supprime un produit par id
  const body = await request.json();
  const { id } = body;
  await prisma.product.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

export async function PUT(request: NextRequest) {
  // Modifie un produit par id
  const body = await request.json();
  const { id, ...data } = body;
  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json(product, { status: 200 });
} 