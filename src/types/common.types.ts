import { Request } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: 'ADMIN' | 'WORKER';
    email?: string;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  ward?: string;
  category?: string;
  businessType?: string;
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}