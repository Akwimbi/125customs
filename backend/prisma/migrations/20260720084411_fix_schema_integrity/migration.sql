/*
  Warnings:

  - You are about to drop the column `subtotal` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "paystack_transactions" DROP CONSTRAINT "paystack_transactions_order_id_fkey";

-- DropForeignKey
ALTER TABLE "quote_items" DROP CONSTRAINT "quote_items_quote_id_fkey";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "subtotal",
DROP COLUMN "unit_price",
ALTER COLUMN "quantity" DROP DEFAULT;

-- AlterTable
ALTER TABLE "quotes" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "audit_logs";

-- CreateIndex
CREATE INDEX "cart_item_cart_id_idx" ON "cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "cart_item_product_id_idx" ON "cart_items"("product_id");

-- CreateIndex
CREATE INDEX "cart_session_id_idx" ON "carts"("session_id");

-- CreateIndex
CREATE INDEX "cart_user_id_idx" ON "carts"("user_id");

-- CreateIndex
CREATE INDEX "order_item_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_item_product_id_idx" ON "order_items"("product_id");

-- CreateIndex
CREATE INDEX "order_user_id_idx" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "order_created_at_idx" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "order_user_status_idx" ON "orders"("user_id", "status");

-- CreateIndex
CREATE INDEX "paystack_transaction_order_id_idx" ON "paystack_transactions"("order_id");

-- CreateIndex
CREATE INDEX "product_option_product_id_idx" ON "product_options"("product_id");

-- CreateIndex
CREATE INDEX "product_option_name_idx" ON "product_options"("option_name");

-- CreateIndex
CREATE INDEX "product_audience_type_idx" ON "products"("audience_type");

-- CreateIndex
CREATE INDEX "product_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "product_is_active_idx" ON "products"("is_active");

-- CreateIndex
CREATE INDEX "product_audience_category_active_idx" ON "products"("audience_type", "category", "is_active");

-- CreateIndex
CREATE INDEX "product_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "quote_item_quote_id_idx" ON "quote_items"("quote_id");

-- CreateIndex
CREATE INDEX "quote_item_product_id_idx" ON "quote_items"("product_id");

-- CreateIndex
CREATE INDEX "quote_user_id_idx" ON "quotes"("user_id");

-- CreateIndex
CREATE INDEX "quote_status_idx" ON "quotes"("status");

-- CreateIndex
CREATE INDEX "quote_created_at_idx" ON "quotes"("created_at");

-- CreateIndex
CREATE INDEX "quote_user_status_idx" ON "quotes"("user_id", "status");

-- CreateIndex
CREATE INDEX "user_audience_type_idx" ON "users"("audience_type");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paystack_transactions" ADD CONSTRAINT "paystack_transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
