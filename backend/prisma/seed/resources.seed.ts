import { PrismaClient } from '@prisma/client';
import { IDS } from './utils';

export async function seedResources(prisma: PrismaClient) {
  console.log('📦 Seeding inventory...');

  // 1. Seed Resources
  const resources = [
    { id: IDS.resources.riceBags, name: 'Rice Bags', unit: 'bags' },
    { id: IDS.resources.waterBottles, name: 'Water Bottles', unit: 'cartons' },
    { id: IDS.resources.medicalKits, name: 'Medical Kits', unit: 'kits' },
    { id: IDS.resources.blankets, name: 'Blankets', unit: 'units' },
    { id: IDS.resources.tents, name: 'Tents', unit: 'units' },
    { id: IDS.resources.dieselFuel, name: 'Diesel Fuel', unit: 'liters' },
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { name: resource.name },
      update: {},
      create: resource
    });
  }

  // 2. Seed Resource Lots
  await prisma.resourceLot.upsert({
    where: { id: IDS.resourceLots.redCrossMedicalKits },
    update: {},
    create: {
      id: IDS.resourceLots.redCrossMedicalKits,
      organizationId: IDS.organizations.redCross,
      resourceId: IDS.resources.medicalKits,
      quantity: 400,
      reservedQuantity: 50,
      availableQuantity: 350,
      notes: 'Stored in Delhi main warehouse'
    }
  });

  await prisma.resourceLot.upsert({
    where: { id: IDS.resourceLots.foodNetworkRice },
    update: {},
    create: {
      id: IDS.resourceLots.foodNetworkRice,
      organizationId: IDS.organizations.foodNetwork,
      resourceId: IDS.resources.riceBags,
      quantity: 2000,
      reservedQuantity: 0,
      availableQuantity: 2000,
      notes: 'Stored in Community Food Network central hub'
    }
  });

  await prisma.resourceLot.upsert({
    where: { id: IDS.resourceLots.floodReliefBlankets },
    update: {},
    create: {
      id: IDS.resourceLots.floodReliefBlankets,
      organizationId: IDS.organizations.floodRelief,
      resourceId: IDS.resources.blankets,
      quantity: 1000,
      reservedQuantity: 100,
      availableQuantity: 900,
      notes: 'Winter relief blankets'
    }
  });

  await prisma.resourceLot.upsert({
    where: { id: IDS.resourceLots.shelterAllianceTents },
    update: {},
    create: {
      id: IDS.resourceLots.shelterAllianceTents,
      organizationId: IDS.organizations.shelterAlliance,
      resourceId: IDS.resources.tents,
      quantity: 150,
      reservedQuantity: 0,
      availableQuantity: 150,
      notes: 'Emergency 4-person tents'
    }
  });

  await prisma.resourceLot.upsert({
    where: { id: IDS.resourceLots.shelterAllianceWater },
    update: {},
    create: {
      id: IDS.resourceLots.shelterAllianceWater,
      organizationId: IDS.organizations.shelterAlliance,
      resourceId: IDS.resources.waterBottles,
      quantity: 500,
      reservedQuantity: 0,
      availableQuantity: 500,
      notes: 'Water cartons'
    }
  });
}
