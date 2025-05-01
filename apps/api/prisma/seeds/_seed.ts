import { PrismaClient } from '@prisma/client';
import { userSeed } from './user.seed';
import { roomFacilitySeed } from './room-facility.seed';
import { propertyImageSeed } from './property-image.seed';
import { roomImageSeed } from './room-image.seed';
import { facilitySeed } from './facility.seed';
import { roomSeed } from './room.seed';
import { propertySeed } from './property.seed';
import { propertyFacilitySeed } from './property-facility.seed';
import { citySeed } from './city.seed';
import { categorySeed } from './category.seed';
const prisma = new PrismaClient();

async function main() {
  await prisma.city.createMany({ data: citySeed });
  await prisma.user.createMany({ data: userSeed });
  await prisma.category.createMany({ data: categorySeed });
  await prisma.property.createMany({ data: propertySeed });
  await prisma.room.createMany({ data: roomSeed });
  await prisma.facility.createMany({ data: facilitySeed });
  await prisma.propertyImage.createMany({ data: propertyImageSeed });
  await prisma.roomImage.createMany({ data: roomImageSeed });
  await prisma.roomHasFacility.createMany({ data: roomFacilitySeed });
  await prisma.propertyHasFacility.createMany({ data: propertyFacilitySeed });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
