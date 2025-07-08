import { Response } from 'express';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { categoryService } from '../services/category.service';
import { asyncHandler } from '../middleware/error.middleware';

export const createCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { name, nameEnglish, description } = req.body;

  const category = await categoryService.createCategory({
    name,
    nameEnglish,
    description,
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category,
  } as ApiResponse);
});

export const getAllCategories = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { includeInactive = 'false' } = req.query;

  const categories = await categoryService.getAllCategories(
    includeInactive === 'true'
  );

  res.status(200).json({
    success: true,
    message: 'Categories retrieved successfully',
    data: categories,
  } as ApiResponse);
});

export const getCategoryById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const category = await categoryService.getCategoryById(id);

  if (!category) {
    res.status(404).json({
      success: false,
      message: 'Category not found',
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Category retrieved successfully',
    data: category,
  } as ApiResponse);
});

export const updateCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, nameEnglish, description, isActive } = req.body;

  const category = await categoryService.updateCategory(id, {
    name,
    nameEnglish,
    description,
    isActive,
  });

  if (!category) {
    res.status(404).json({
      success: false,
      message: 'Category not found',
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category,
  } as ApiResponse);
});

export const deleteCategory = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const deleted = await categoryService.deleteCategory(id);

  if (!deleted) {
    res.status(404).json({
      success: false,
      message: 'Category not found',
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  } as ApiResponse);
});

export const getCategoryStats = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const stats = await categoryService.getCategoryStats();

  res.status(200).json({
    success: true,
    message: 'Category statistics retrieved successfully',
    data: stats,
  } as ApiResponse);
});