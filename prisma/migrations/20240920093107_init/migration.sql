/*
  Warnings:

  - You are about to drop the column `stripePaymentId` on the `OrderReceipt` table. All the data in the column will be lost.
  - Added the required column `stripePaymentId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "stripePaymentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderReceipt" DROP COLUMN "stripePaymentId";
