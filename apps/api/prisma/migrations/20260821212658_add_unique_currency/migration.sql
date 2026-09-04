/*
  Warnings:

  - A unique constraint covering the columns `[currency]` on the table `CryptoWallet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CryptoWallet_currency_key" ON "CryptoWallet"("currency");
