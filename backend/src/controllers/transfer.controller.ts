import { Request, Response } from 'express';
import { getTransfers, getTransferById, updateTransferStatus } from '../services/transfer.service';
import { createSuccessResponse } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';
import { NotFoundError } from '../utils/errors';

export const getTransfersController = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const filters: any = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.organizationId) {
    filters.OR = [
      { fromOrganizationId: req.query.organizationId },
      { toOrganizationId: req.query.organizationId }
    ];
  }

  const transfers = await getTransfers(filters, skip, limit);
  res.status(200).json(createSuccessResponse(transfers));
});

export const getTransferController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const transfer = await getTransferById(id);
  if (!transfer) {
    throw new NotFoundError('Transfer not found');
  }
  res.status(200).json(createSuccessResponse(transfer));
});

/**
 * Note: organizationId and userId (if needed) are temporary placeholders until authentication 
 * and authorization middleware are implemented. Future phases will derive actor 
 * context from authenticated request state rather than request payloads.
 */
export const completeTransferController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const transfer = await updateTransferStatus(id, 'COMPLETED');
  res.status(200).json(createSuccessResponse(transfer));
});

export const acceptTransferController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { prisma } = require('../prisma');
  
  const transfer = await prisma.$transaction(async (tx: any) => {
    const t = await tx.transfer.findUnique({ where: { id }, include: { offer: true } });
    if (!t) throw new NotFoundError('Transfer not found');
    
    // Update status
    const updated = await tx.transfer.update({
      where: { id },
      data: { status: 'ACCEPTED' }
    });

    // Reserve inventory
    await tx.resourceLot.update({
      where: { id: t.offer.resourceLotId },
      data: {
        reservedQuantity: { increment: t.quantity },
        availableQuantity: { decrement: t.quantity }
      }
    });

    return updated;
  });

  res.status(200).json(createSuccessResponse(transfer));
});

export const startTransitController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const transfer = await updateTransferStatus(id, 'IN_TRANSIT');
  res.status(200).json(createSuccessResponse(transfer));
});

export const deliverTransferController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { prisma } = require('../prisma');

  const transfer = await prisma.$transaction(async (tx: any) => {
    const t = await tx.transfer.findUnique({ where: { id }, include: { offer: true } });
    if (!t) throw new NotFoundError('Transfer not found');

    const updated = await tx.transfer.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });

    // Decrement total quantity and release reserved quantity
    await tx.resourceLot.update({
      where: { id: t.offer.resourceLotId },
      data: {
        quantity: { decrement: t.quantity },
        reservedQuantity: { decrement: t.quantity }
      }
    });

    // (In a real system, we'd also add the quantity to the receiving org's inventory here)

    return updated;
  });

  res.status(200).json(createSuccessResponse(transfer));
});

export const cancelTransferController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { prisma } = require('../prisma');

  const transfer = await prisma.$transaction(async (tx: any) => {
    const t = await tx.transfer.findUnique({ where: { id }, include: { offer: true } });
    if (!t) throw new NotFoundError('Transfer not found');

    const updated = await tx.transfer.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    // If it was accepted or beyond, release the reservation
    if (['ACCEPTED', 'IN_TRANSIT'].includes(t.status)) {
      await tx.resourceLot.update({
        where: { id: t.offer.resourceLotId },
        data: {
          reservedQuantity: { decrement: t.quantity },
          availableQuantity: { increment: t.quantity }
        }
      });
    }

    return updated;
  });

  res.status(200).json(createSuccessResponse(transfer));
});

export const createDirectTransferController = asyncHandler(
  async (req: Request, res: Response) => {
    // The user explicitly approved this pattern to wrap schema creation for UX simplicity
    const { resourceId, resourceLotId, toOrganizationId, quantity, notes } = req.body;
    
    const fromOrganizationId = req.query.organizationId as string || req.body.fromOrganizationId;

    if (!fromOrganizationId) {
      throw new Error('fromOrganizationId is required');
    }

    // Since transferService doesn't have a direct creation method yet, we'll implement it here
    // In a real production system, this logic would belong in a service layer.
    // We are creating a ResourceNeed, ResourceOffer, and Transfer atomically.
    const { prisma } = require('../prisma');
    const { createAuditLog } = require('../services/audit.service');

    const transfer = await prisma.$transaction(async (tx: any) => {
      // 1. Create ResourceNeed for destination org
      const need = await tx.resourceNeed.create({
        data: {
          organizationId: toOrganizationId,
          resourceId,
          quantity,
          status: 'OPEN',
          createdById: 'system', // placeholder
          notes: 'Direct transfer request',
        }
      });

      // 2. Create ResourceOffer for source org
      const offer = await tx.resourceOffer.create({
        data: {
          needId: need.id,
          offeringOrganizationId: fromOrganizationId,
          resourceLotId,
          offeredQuantity: quantity,
          status: 'ACCEPTED', // immediately accepted since it's direct
          createdById: 'system', // placeholder
          notes: notes || 'Direct transfer offer',
        }
      });

      // 3. Create Transfer
      const newTransfer = await tx.transfer.create({
        data: {
          needId: need.id,
          offerId: offer.id,
          resourceId,
          fromOrganizationId,
          toOrganizationId,
          quantity,
          status: 'PENDING',
        }
      });

      await createAuditLog({
        action: 'TRANSFER_CREATED',
        entityType: 'TRANSFER',
        entityId: newTransfer.id,
        organizationId: fromOrganizationId,
      }, tx);

      return newTransfer;
    });

    res.status(201).json(createSuccessResponse(transfer));
  }
);