import { PrismaClient, TransferStatus } from '@prisma/client';
import { IDS } from './utils';

export async function seedTransfers(prisma: PrismaClient) {
  console.log('🚚 Seeding transfers...');

  // 1. Seed Needs
  await prisma.resourceNeed.upsert({
    where: { id: IDS.needs.blanketsNeed },
    update: {},
    create: {
      id: IDS.needs.blanketsNeed,
      organizationId: IDS.organizations.shelterAlliance,
      resourceId: IDS.resources.blankets,
      quantity: 200,
      notes: 'Urgent requirement for winter shelter',
      status: 'OPEN',
      createdById: IDS.users.adi // Dummy creator
    }
  });

  await prisma.resourceNeed.upsert({
    where: { id: IDS.needs.waterNeed },
    update: {},
    create: {
      id: IDS.needs.waterNeed,
      organizationId: IDS.organizations.floodRelief,
      resourceId: IDS.resources.waterBottles,
      quantity: 100,
      notes: 'Need water for flood hit area',
      status: 'OPEN',
      createdById: IDS.users.adi
    }
  });

  // 2. Seed Offers
  await prisma.resourceOffer.upsert({
    where: { id: IDS.offers.medicalKitsOffer },
    update: {},
    create: {
      id: IDS.offers.medicalKitsOffer,
      needId: IDS.needs.blanketsNeed, // Fake connect for now to satisfy schema requirement for needId
      offeringOrganizationId: IDS.organizations.redCross,
      resourceLotId: IDS.resourceLots.redCrossMedicalKits,
      offeredQuantity: 50,
      notes: 'Medical kits available',
      status: 'PENDING',
      createdById: IDS.users.aisha
    }
  });

  // Offer blankets from Flood Relief to Shelter Alliance
  await prisma.resourceOffer.upsert({
    where: { id: IDS.offers.tentsOffer },
    update: {},
    create: {
      id: IDS.offers.tentsOffer,
      needId: IDS.needs.blanketsNeed,
      offeringOrganizationId: IDS.organizations.floodRelief,
      resourceLotId: IDS.resourceLots.floodReliefBlankets,
      offeredQuantity: 200,
      notes: 'We can provide blankets',
      status: 'ACCEPTED',
      createdById: IDS.users.adi
    }
  });

  // Offer water from Shelter Alliance to Flood Relief
  await prisma.resourceOffer.upsert({
    where: { id: IDS.offers.waterOffer },
    update: {},
    create: {
      id: IDS.offers.waterOffer,
      needId: IDS.needs.waterNeed,
      offeringOrganizationId: IDS.organizations.shelterAlliance,
      resourceLotId: IDS.resourceLots.shelterAllianceWater,
      offeredQuantity: 100,
      notes: 'Water cartons available',
      status: 'ACCEPTED',
      createdById: IDS.users.adi
    }
  });

  // 3. Seed Transfers
  await prisma.transfer.upsert({
    where: { id: IDS.transfers.transfer1 },
    update: {},
    create: {
      id: IDS.transfers.transfer1,
      needId: IDS.needs.blanketsNeed,
      offerId: IDS.offers.tentsOffer,
      resourceId: IDS.resources.blankets,
      fromOrganizationId: IDS.organizations.floodRelief,
      toOrganizationId: IDS.organizations.shelterAlliance,
      quantity: 200,
      status: TransferStatus.IN_TRANSIT,
      approvedById: IDS.users.adi
    }
  });

  await prisma.transfer.upsert({
    where: { id: IDS.transfers.transfer2 },
    update: {},
    create: {
      id: IDS.transfers.transfer2,
      needId: IDS.needs.waterNeed,
      offerId: IDS.offers.waterOffer,
      resourceId: IDS.resources.waterBottles,
      fromOrganizationId: IDS.organizations.shelterAlliance,
      toOrganizationId: IDS.organizations.floodRelief,
      quantity: 100,
      status: TransferStatus.COMPLETED,
      approvedById: IDS.users.adi
    }
  });
}
