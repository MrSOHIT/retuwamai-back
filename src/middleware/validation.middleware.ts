import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages,
        });
        return;
      }
      next(error);
    }
  };
};

// Common validation schemas
export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const createBusinessSchema = z.object({
  body: z.object({
    businessName: z.string().min(1, 'Business name is required'),
    contactPerson: z.string().min(1, 'Contact person is required'),
    businessAddress: z.string().min(1, 'Business address is required'),
    contactNumber: z.string().min(1, 'Contact number is required'),
    wardNumber: z.number().int().min(1).max(50, 'Invalid ward number'),
    position: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    tole: z.string().optional(),
    municipality: z.string().optional(),
    establishmentYear: z.string().optional(),
    ownershipType: z.string().optional(),
    businessType: z.string().optional(),
    businessField: z.string().optional(),
    totalInvestment: z.number().positive().optional(),
    locationOwnership: z.string().optional(),
    annualTurnover: z.number().positive().optional(),
    registrationNumber: z.string().optional(),
    vatNumber: z.string().optional(),
    laborPermit: z.string().optional(),
    panNumber: z.string().optional(),
    environmentApproval: z.string().optional(),
    otherPermits: z.string().optional(),
    permanentEmployees: z.number().int().min(0).optional(),
    femaleEmployees: z.number().int().min(0).optional(),
    temporaryContractEmployees: z.number().int().min(0).optional(),
    marginalizedEmployees: z.number().int().min(0).optional(),
    partTimeFreelancers: z.number().int().min(0).optional(),
    avgSalary: z.number().positive().optional(),
    incomeSource: z.string().optional(),
    avgIncome: z.number().positive().optional(),
    avgExpense: z.number().positive().optional(),
    loanProvider: z.string().optional(),
    loanAmount: z.number().positive().optional(),
    loanDuration: z.string().optional(),
    expansionPlans: z.string().optional(),
    mainChallenges: z.string().optional(),
    municipalSupport: z.string().optional(),
    communityContribution: z.string().optional(),
    additionalSupport: z.string().optional(),
    formFilledDate: z.string().optional(),
    finalRemarks: z.string().optional(),
    categoryId: z.string().optional(),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    nameEnglish: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
    ward: z.string().regex(/^\d+$/).optional(),
    category: z.string().optional(),
    businessType: z.string().optional(),
  }),
});