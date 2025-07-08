import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { dashboardService } from '../services/dashboard.service';
import { asyncHandler } from '../middleware/error.middleware';

export const getDashboardStats = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { ward } = req.query;

  const stats = await dashboardService.getDashboardStats(
    ward ? parseInt(ward as string) : undefined
  );

  res.status(200).json({
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: stats,
  } as ApiResponse);
});

export const getBusinessAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { ward, period = '30' } = req.query;

  const analytics = await dashboardService.getBusinessAnalytics(
    ward ? parseInt(ward as string) : undefined,
    parseInt(period as string)
  );

  res.status(200).json({
    success: true,
    message: 'Business analytics retrieved successfully',
    data: analytics,
  } as ApiResponse);
});

export const getRecentActivities = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { limit = '10' } = req.query;

  const activities = await dashboardService.getRecentActivities(
    parseInt(limit as string)
  );

  res.status(200).json({
    success: true,
    message: 'Recent activities retrieved successfully',
    data: activities,
  } as ApiResponse);
});

export const getWardComparison = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const comparison = await dashboardService.getWardComparison();

  res.status(200).json({
    success: true,
    message: 'Ward comparison data retrieved successfully',
    data: comparison,
  } as ApiResponse);
});

export const getTopBusinesses = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { metric = 'investment', limit = '10' } = req.query;

  const topBusinesses = await dashboardService.getTopBusinesses(
    metric as 'investment' | 'employees' | 'turnover',
    parseInt(limit as string)
  );

  res.status(200).json({
    success: true,
    message: 'Top businesses retrieved successfully',
    data: topBusinesses,
  } as ApiResponse);
});