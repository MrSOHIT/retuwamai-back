import prisma from '../config/database';

interface CreateCategoryData {
  name: string;
  nameEnglish?: string;
  description?: string;
}

interface UpdateCategoryData {
  name?: string;
  nameEnglish?: string;
  description?: string;
  isActive?: boolean;
}

class CategoryService {
  async createCategory(data: CreateCategoryData) {
    return prisma.category.create({
      data,
    });
  }

  async getAllCategories(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };

    return prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            businesses: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        businesses: {
          where: { isActive: true },
          select: {
            id: true,
            businessName: true,
            contactPerson: true,
            wardNumber: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            businesses: {
              where: { isActive: true },
            },
          },
        },
      },
    });
  }

  async updateCategory(id: string, data: UpdateCategoryData) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return null;
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            businesses: true,
          },
        },
      },
    });

    if (!category) {
      return false;
    }

    // Check if category has associated businesses
    if (category._count.businesses > 0) {
      // Soft delete - mark as inactive instead of deleting
      await prisma.category.update({
        where: { id },
        data: { isActive: false },
      });
    } else {
      // Hard delete if no associated businesses
      await prisma.category.delete({
        where: { id },
      });
    }

    return true;
  }

  async getCategoryStats() {
    const [
      totalCategories,
      activeCategories,
      categoriesWithBusinesses,
      topCategories,
    ] = await Promise.all([
      prisma.category.count(),
      
      prisma.category.count({
        where: { isActive: true },
      }),
      
      prisma.category.count({
        where: {
          isActive: true,
          businesses: {
            some: {
              isActive: true,
            },
          },
        },
      }),
      
      prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              businesses: {
                where: { isActive: true },
              },
            },
          },
        },
        orderBy: {
          businesses: {
            _count: 'desc',
          },
        },
        take: 5,
      }),
    ]);

    return {
      totalCategories,
      activeCategories,
      categoriesWithBusinesses,
      topCategories: topCategories.map(category => ({
        id: category.id,
        name: category.name,
        nameEnglish: category.nameEnglish,
        businessCount: category._count.businesses,
      })),
    };
  }

  async searchCategories(term: string) {
    return prisma.category.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { nameEnglish: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: {
            businesses: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}

export const categoryService = new CategoryService();