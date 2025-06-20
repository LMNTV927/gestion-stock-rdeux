-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "supplier" TEXT,
    "image" TEXT,
    "lastUpdate" TEXT,
    "status" TEXT,
    "statusColor" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
