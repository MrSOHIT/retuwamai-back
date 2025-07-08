import prisma from '../config/database';
import { DashboardStats } from '../types/business.types';

class DashboardService {
  async getDashboardStats(wardNumber?: number): Promise<DashboardStats> {
    const where: any = { isActive: true };
    if (wardNumber) {
      where.wardNumber = wardNumber;
    }

    const [
      totalBusinesses,
      activeBusinesses,
      totalCategories,
      businessesPendingRenewal,
      businessesByType,
      businessesByOwnership,
      businessesByWard,
      businessesBySector,
    ] = await Promise.all([
      // Total businesses
      prisma.business.count({ where }),
      
      // Active businesses (same as total for now)
      prisma.business.count({ where }),
      
      // Total categories
      prisma.category.count({ where: { isActive: true } }),
      
      // Businesses pending renewal (placeholder - would need renewal date field)
      Promise.resolve(0),
      
      // Businesses by type
      prisma.business.groupBy({
        by: ['businessType'],
        where: { ...where, businessType: { not: null } },
        _count: true,
      }),
      
      // Businesses by ownership
      prisma.business.groupBy({
        by: ['ownershipType'],
        where: { ...where, ownershipType: { not: null } },
        _count: true,
      }),
      
      // Businesses by ward (only if not filtering by ward)
      wardNumber ? Promise.resolve([]) : prisma.business.groupBy({
        by: ['wardNumber'],
        where,
        _count: true,
        orderBy: {
          wardNumber: 'asc',
        },
      }),
      
      // Businesses by sector
      prisma.business.groupBy({
        by: ['businessField'],
        where: { ...where, businessField: { not: null } },
        _count: true,
      }),
    ]);

    return {
      totalBusinesses,
      activeBusinesses,
      totalCategories,
      businessesPendingRenewal,
      businessesByType: businessesByType.map(item => ({
        type: item.businessType || 'अन्य',
        count: item._count,
      })),
      businessesByOwnership: businessesByOwnership.map(item => ({
        ownership: item.ownershipType || 'अन्य',
        count: item._count,
      })),
      businessesByWard: businessesByWard.map(item => ({
        ward: item.wardNumber,
        count: item._count,
      })),
      businessesBySector: businessesBySector.map(item => ({
        sector: item.businessField || 'अन्य',
        count: item._count,
      })),
    };
  }

  async getBusinessAnalytics(wardNumber?: number, periodDays: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const where: any = {
      isActive: true,
      createdAt: {
        gte: startDate,
      },
    };

    if (wardNumber) {
      where.wardNumber = wardNumber;
    }

    const [
      newBusinesses,
      businessGrowth,
      topInvestments,
      employmentStats,
    ] = await Promise.all([
      // New businesses in period
      prisma.business.count({ where }),
      
      // Business growth by day
      prisma.business.groupBy({
        by: ['createdAt'],
        where,
        _count: true,
        orderBy: {
          createdAt: 'asc',
        },
      }),
      
      // Top investments
      prisma.business.findMany({
        where: {
          isActive: true,
          totalInvestment: { not: null },
          ...(wardNumber && { wardNumber }),
        },
        select: {
          businessName: true,
          totalInvestment: true,
          contactPerson: true,
          wardNumber: true,
        },
        orderBy: {
          totalInvestment: 'desc',
        },
        take: 10,
      }),
      
      // Employment statistics
      prisma.business.aggregate({
        where: {
          isActive: true,
          ...(wardNumber && { wardNumber }),
        },
        _sum: {
          permanentEmployees: true,
          femaleEmployees: true,
          temporaryContractEmployees: true,
        },
        _avg: {
          permanentEmployees: true,
          avgSalary: true,
        },
      }),
    ]);

    return {
      newBusinesses,
      businessGrowth,
      topInvestments,
      employmentStats: {
        totalEmployees: (employmentStats._sum.permanentEmployees || 0) + 
                       (employmentStats._sum.temporaryContractEmployees || 0),
        femaleEmployees: employmentStats._sum.femaleEmployees || 0,
        avgEmployeesPerBusiness: employmentStats._avg.permanentEmployees || 0,
        avgSalary: employmentStats._avg.avgSalary || 0,
      },
    };
  }

  async getRecentActivities(limit: number = 10) {
    const recentBusinesses = await prisma.business.findMany({
      where: { isActive: true },
      select: {
        id: true,
        businessName: true,
        contactPerson: true,
        wardNumber: true,
        createdAt: true,
        createdBy: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return recentBusinesses.map(business => ({
      type: 'business_created',
      description: `New business "${business.businessName}" registered`,
      businessId: business.id,
      businessName: business.businessName,
      contactPerson: business.contactPerson,
      wardNumber: business.wardNumber,
      createdBy: business.createdBy.fullName || business.createdBy.username,
      createdAt: business.createdAt,
    }));
  }

  async getWardComparison() {
    const wardStats = await prisma.business.groupBy({
      by: ['wardNumber'],
      where: { isActive: true },
      _count: true,
      _sum: {
        totalInvestment: true,
        permanentEmployees: true,
      },
      _avg: {
        totalInvestment: true,
      },
      orderBy: {
        wardNumber: 'asc',
      },
    });

    return wardStats.map(ward => ({
      ward: ward.wardNumber,
      totalBusinesses: ward._count,
      totalInvestment: ward._sum.totalInvestment || 0,
      totalEmployees: ward._sum.permanentEmployees || 0,
      avgInvestment: ward._avg.totalInvestment || 0,
    }));
  }

  async getTopBusinesses(
    metric: 'investment' | 'employees' | 'turnover' = 'investment',
    limit: number = 10
  ) {
    let orderBy: any;
    let whereCondition: any = { isActive: true };

    switch (metric) {
      case 'investment':
        orderBy = { totalInvestment: 'desc' };
        whereCondition.totalInvestment = { not: null };
        break;
      case 'employees':
        orderBy = { permanentEmployees: 'desc' };
        whereCondition.permanentEmployees = { not: null };
        break;
      case 'turnover':
        orderBy = { annualTurnover: 'desc' };
        whereCondition.annualTurnover = { not: null };
        break;
    }

    return prisma.business.findMany({
      where: whereCondition,
      select: {
        id: true,
        businessName: true,
        contactPerson: true,
        wardNumber: true,
        totalInvestment: true,
        permanentEmployees: true,
        annualTurnover: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy,
      take: limit,
    });
  }
}

export const dashboardService = new DashboardService();