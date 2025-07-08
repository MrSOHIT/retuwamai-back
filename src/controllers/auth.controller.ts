import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import config from '../config';
import { LoginRequest, LoginResponse } from '../types/auth.types';
import { AuthenticatedRequest, ApiResponse } from '../types/common.types';
import { asyncHandler } from '../middleware/error.middleware';

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, password }: LoginRequest = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      role: true,
      fullName: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    } as ApiResponse);
    return;
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    } as ApiResponse);
    return;
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    config.JWT_SECRET as string,
    { expiresIn: config.JWT_EXPIRES_IN as any || '7d' }
  );

  const response: LoginResponse = {
    user: {
      id: user.id,
      username: user.username,
      email: user.email || undefined,
      role: user.role,
      fullName: user.fullName || undefined,
    },
    token,
    expiresIn: config.JWT_EXPIRES_IN,
  };

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: response,
  } as ApiResponse<LoginResponse>);
});

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // In a JWT implementation, logout is typically handled client-side
  // by removing the token from storage
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  } as ApiResponse);
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      fullName: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    } as ApiResponse);
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: user,
  } as ApiResponse);
});

export const changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  // Find user with current password
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, password: true },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found',
    } as ApiResponse);
    return;
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isCurrentPasswordValid) {
    res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
    } as ApiResponse);
    return;
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword },
  });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  } as ApiResponse);
});