/*
  Warnings:

  - A unique constraint covering the columns `[invoice_id]` on the table `Factures` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Factures_invoice_id_key" ON "Factures"("invoice_id");
