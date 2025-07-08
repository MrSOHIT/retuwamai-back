import prisma from '../config/database';
import { CreateBusinessRequest, BusinessSearchFilters } from '../types/business.types';
import path from 'path';

class BusinessService {
  async createBusiness(
    data: CreateBusinessRequest,
    createdById: string,
    files?: Express.Multer.File[]
  ) {
    const business = await prisma.business.create({
      data: {
        ...data,
        createdById,
      },
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    });

    // Handle file uploads
    if (files && files.length > 0) {
      const documentData = files.map(file => ({
        businessId: business.id,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
      }));

      await prisma.businessDocument.createMany({
        data: documentData,
      });
    }

    return this.getBusinessById(business.id);
  }

  async getAllBusinesses(
    page: number = 1,
    limit: number = 10,
    filters: BusinessSearchFilters = {}
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {
      isActive: filters.isActive !== false,
    };

    // Search filter
    if (filters.search) {
      where.OR = [
        { businessName: { contains: filters.search, mode: 'insensitive' } },
        { contactPerson: { contains: filters.search, mode: 'insensitive' } },
        { businessAddress: { contains: filters.search, mode: 'insensitive' } },
        { contactNumber: { contains: filters.search } },
      ];
    }

    // Ward filter
    if (filters.ward) {
      where.wardNumber = filters.ward;
    }

    // Category filter
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    // Business type filter
    if (filters.businessType) {
      where.businessType = filters.businessType;
    }

    // Ownership type filter
    if (filters.ownershipType) {
      where.ownershipType = filters.ownershipType;
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          createdBy: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
          documents: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.business.count({ where }),
    ]);

    return {
      businesses,
      total,
    };
  }

  async getBusinessById(id: string) {
    return prisma.business.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        documents: true,
      },
    });
  }

  async updateBusiness(
    id: string,
    data: Partial<CreateBusinessRequest>,
    files?: Express.Multer.File[]
  ) {
    const business = await prisma.business.update({
      where: { id },
      data,
      include: {
        category: true,
        createdBy: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        documents: true,
      },
    });

    // Handle new file uploads
    if (files && files.length > 0) {
      const documentData = files.map(file => ({
        businessId: id,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
      }));

      await prisma.businessDocument.createMany({
        data: documentData,
      });
    }

    return business;
  }

  async deleteBusiness(id: string) {
    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      return false;
    }

    await prisma.business.delete({
      where: { id },
    });

    return true;
  }

  async searchBusinesses(term: string, location?: string) {
    const where: any = {
      isActive: true,
      OR: [
        { businessName: { contains: term, mode: 'insensitive' } },
        { contactPerson: { contains: term, mode: 'insensitive' } },
        { businessAddress: { contains: term, mode: 'insensitive' } },
      ],
    };

    if (location) {
      // Parse ward number from location string
      const wardMatch = location.match(/Ward (\d+)/i);
      if (wardMatch) {
        where.wardNumber = parseInt(wardMatch[1]);
      } else {
        where.OR.push(
          { businessAddress: { contains: location, mode: 'insensitive' } },
          { tole: { contains: location, mode: 'insensitive' } }
        );
      }
    }

    return prisma.business.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        businessName: 'asc',
      },
    });
  }

  async getBusinessesByWard(wardNumber: number) {
    return prisma.business.findMany({
      where: {
        wardNumber,
        isActive: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        businessName: 'asc',
      },
    });
  }

  async getBusinessStats(wardNumber?: number) {
    const where: any = { isActive: true };
    if (wardNumber) {
      where.wardNumber = wardNumber;
    }

    const [
      totalBusinesses,
      businessesByType,
      businessesByOwnership,
      businessesBySector,
    ] = await Promise.all([
      prisma.business.count({ where }),
      
      prisma.business.groupBy({
        by: ['businessType'],
        where: { ...where, businessType: { not: null } },
        _count: true,
      }),
      
      prisma.business.groupBy({
        by: ['ownershipType'],
        where: { ...where, ownershipType: { not: null } },
        _count: true,
      }),
      
      prisma.business.groupBy({
        by: ['businessField'],
        where: { ...where, businessField: { not: null } },
        _count: true,
      }),
    ]);

    return {
      totalBusinesses,
      businessesByType: businessesByType.map(item => ({
        type: item.businessType || 'अन्य',
        count: item._count,
      })),
      businessesByOwnership: businessesByOwnership.map(item => ({
        ownership: item.ownershipType || 'अन्य',
        count: item._count,
      })),
      businessesBySector: businessesBySector.map(item => ({
        sector: item.businessField || 'अन्य',
        count: item._count,
      })),
    };
  }
}

export const businessService = new BusinessService();