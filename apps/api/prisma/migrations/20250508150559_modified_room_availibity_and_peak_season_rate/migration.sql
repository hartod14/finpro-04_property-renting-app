/*
  Warnings:

  - You are about to drop the column `property_id` on the `peak_season_dates` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `room_unavailable_dates` table. All the data in the column will be lost.
  - Added the required column `tenant_id` to the `peak_season_dates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `peak_season_dates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `room_unavailable_dates` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RateType" AS ENUM ('INCREASE', 'DECREASE');

-- DropForeignKey
ALTER TABLE "peak_season_dates" DROP CONSTRAINT "peak_season_dates_property_id_fkey";

-- DropForeignKey
ALTER TABLE "room_unavailable_dates" DROP CONSTRAINT "room_unavailable_dates_room_id_fkey";

-- AlterTable
ALTER TABLE "peak_season_dates" DROP COLUMN "property_id",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "tenant_id" INTEGER NOT NULL,
ADD COLUMN     "type" "RateType" NOT NULL;

-- AlterTable
ALTER TABLE "room_unavailable_dates" DROP COLUMN "room_id",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "tenant_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "room_has_unavailable_dates" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "room_unavailable_date_id" INTEGER NOT NULL,

    CONSTRAINT "room_has_unavailable_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_has_peak_season_rates" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "peak_season_rate_id" INTEGER NOT NULL,

    CONSTRAINT "room_has_peak_season_rates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "room_unavailable_dates" ADD CONSTRAINT "room_unavailable_dates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_has_unavailable_dates" ADD CONSTRAINT "room_has_unavailable_dates_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_has_unavailable_dates" ADD CONSTRAINT "room_has_unavailable_dates_room_unavailable_date_id_fkey" FOREIGN KEY ("room_unavailable_date_id") REFERENCES "room_unavailable_dates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peak_season_dates" ADD CONSTRAINT "peak_season_dates_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_has_peak_season_rates" ADD CONSTRAINT "room_has_peak_season_rates_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_has_peak_season_rates" ADD CONSTRAINT "room_has_peak_season_rates_peak_season_rate_id_fkey" FOREIGN KEY ("peak_season_rate_id") REFERENCES "peak_season_dates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
