import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { CreateBusinessRequest, BusinessSearchFilters } from '../types/business.types';
import { businessService } from '../services/business.service';
import { asyncHandler } from '../middleware/error.middleware';

export const createBusiness = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const businessData: CreateBusinessRequest = req.body;
  const files = req.files as Express.Multer.File[];

  const business = await businessService.createBusiness(businessData, req.user!.id, files);

  res.status(201).json({
    success: true,
    message: 'Business created successfully',
    data: business,
  } as ApiResponse);
});

export const getAllBusinesses = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { page = '1', limit = '10', search, ward, category, businessType } = req.query;

  const filters: BusinessSearchFilters = {
    search: search as string,
    ward: ward ? parseInt(ward as string) : undefined,
    categoryId: category as string,
    businessType: businessType as string,
  };

  const result = await businessService.getAllBusinesses(
    parseInt(page as string),
    parseInt(limit as string),
    filters
  );

  res.status(200).json({
    success: true,
    message: 'Businesses retrieved successfully',
    data: result.businesses,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: result.total,
      totalPages: Math.ceil(result.total / parseInt(limit as string)),
    },
  } as ApiResponse);
});

export const getBusinessById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const business = await businessService.getBusinessById(id);

  if (!business) {
    res.status(404).json({
      success: false,
      message: 'Business not found',
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Business retrieved successfully',
    data: business,
  } as ApiResponse);
});

export const updateBusiness = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData: Partial<CreateBusinessRequest> = req.body;
  const files = req.files as Express.Multer.File[];

  const business = await businessService.updateBusiness(id, updateData, files);

  if (!business) {
    res.status(404).json({
      success: false,
      message: 'Business not found',
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Business updated successfully',
    data: business,
  } as ApiResponse);
});

export const deleteBusiness = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const deleted = await businessService.deleteBusiness(id);

  if (!deleted) {
    res.status(404).json({
      success: false,
      message: 'Business not found',
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Business deleted successfully',
  } as ApiResponse);
});

export const searchBusinesses = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { term, location } = req.query;

  const businesses = await businessService.searchBusinesses(
    term as string,
    location as string
  );

  res.status(200).json({
    success: true,
    message: 'Search completed successfully',
    data: businesses,
  } as ApiResponse);
});

export const getBusinessesByWard = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { ward } = req.params;

  const businesses = await businessService.getBusinessesByWard(parseInt(ward));

  res.status(200).json({
    success: true,
    message: 'Ward businesses retrieved successfully',
    data: businesses,
  } as ApiResponse);
});

export const getBusinessStats = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { ward } = req.query;

  const stats = await businessService.getBusinessStats(
    ward ? parseInt(ward as string) : undefined
  );

  res.status(200).json({
    success: true,
    message: 'Business statistics retrieved successfully',
    data: stats,
  } as ApiResponse);
});