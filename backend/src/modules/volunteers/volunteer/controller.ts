import { Request, Response } from 'express';
import { createVolunteerSchema, updateVolunteerSchema } from './validators';
import { volunteerService } from './service';
import { sendSuccess, sendError } from '../shared/responses';

export async function createVolunteer(req: any, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
    
    // Inject trusted userId into payload before parse
    req.body.userId = userId;
    
    // Validate request body
    const data = createVolunteerSchema.parse(req.body);
    
    const result = await volunteerService.register(data);
    return sendSuccess(res, result, 201);
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    return sendError(res, error.message || 'Validation Error', statusCode, error.code || 'VALIDATION_ERROR');
  }
}

export async function getVolunteer(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await volunteerService.getById(id);
    return sendSuccess(res, result);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return sendError(res, error.message, statusCode, 'VOLUNTEER_NOT_FOUND');
  }
}

export async function getVolunteers(req: Request, res: Response) {
  try {
    const result = await volunteerService.getAll();
    return sendSuccess(res, result);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return sendError(res, error.message, statusCode);
  }
}

export async function updateVolunteer(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const data = updateVolunteerSchema.parse(req.body);
    const result = await volunteerService.update(id, data);
    return sendSuccess(res, result);
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    return sendError(res, error.message, statusCode, 'VALIDATION_ERROR');
  }
}

export async function deleteVolunteer(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await volunteerService.deactivate(id);
    return sendSuccess(res, result);
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    return sendError(res, error.message, statusCode);
  }
}

export async function getMe(req: any, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
    const result = await volunteerService.getByUserId(userId);
    return sendSuccess(res, result);
  } catch (error: any) {
    const statusCode = error.statusCode || 404;
    return sendError(res, error.message, statusCode, 'VOLUNTEER_NOT_FOUND');
  }
}

export async function updateMe(req: any, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
    const data = updateVolunteerSchema.parse(req.body);
    
    const existing = await volunteerService.getByUserId(userId);
    const result = await volunteerService.update(existing.id, data);
    
    return sendSuccess(res, result);
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    return sendError(res, error.message, statusCode, 'VALIDATION_ERROR');
  }
}
