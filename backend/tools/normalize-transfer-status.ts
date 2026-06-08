import { PrismaClient, TransferStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Transfer Status Normalization...');

  const transfers = await prisma.transfer.findMany();

  const validStatuses = Object.values(TransferStatus);

  for (const transfer of transfers) {
    const originalStatus = transfer.status;

    const normalizedStatus = originalStatus.toUpperCase();

    if (originalStatus === normalizedStatus) {
      continue;
    }

    if (!validStatuses.includes(normalizedStatus as TransferStatus)) {
      console.warn(
        `Skipping Transfer ${transfer.id}: Invalid normalized status "${normalizedStatus}"`
      );
      continue;
    }

    console.log(
      `Updating Transfer ${transfer.id}: ${originalStatus} -> ${normalizedStatus}`
    );

    await prisma.transfer.update({
      where: { id: transfer.id },
      data: {
        status: normalizedStatus as TransferStatus,
      },
    });
  }

  console.log('Transfer Status Normalization complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
