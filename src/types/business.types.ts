export interface CreateBusinessRequest {
  // Step 1 - Basic Information
  businessName: string;
  contactPerson: string;
  position?: string;
  businessAddress: string;
  contactNumber: string;
  email?: string;
  tole?: string;
  wardNumber: number;
  municipality?: string;
  establishmentYear?: string;
  ownershipType?: string;

  // Step 2 - Business Type
  businessType?: string;
  businessField?: string;

  // Step 3 - Operation Details
  totalInvestment?: number;
  locationOwnership?: string;
  annualTurnover?: number;
  registrationNumber?: string;
  vatNumber?: string;
  laborPermit?: string;
  panNumber?: string;
  environmentApproval?: string;
  otherPermits?: string;

  // Step 4 - Employment Details
  permanentEmployees?: number;
  femaleEmployees?: number;
  temporaryContractEmployees?: number;
  marginalizedEmployees?: number;
  partTimeFreelancers?: number;
  avgSalary?: number;

  // Step 5 - Financial Details
  incomeSource?: string;
  avgIncome?: number;
  avgExpense?: number;
  loanProvider?: string;
  loanAmount?: number;
  loanDuration?: string;

  // Step 6 - Future Plans
  expansionPlans?: string;
  mainChallenges?: string;
  municipalSupport?: string;

  // Step 7 - Social Responsibility
  communityContribution?: string;

  // Step 8 - Additional Information
  additionalSupport?: string;
  formFilledDate?: string;
  finalRemarks?: string;

  // Relations
  categoryId?: string;
}

export interface UpdateBusinessRequest extends Partial<CreateBusinessRequest> {
  id: string;
}

export interface BusinessSearchFilters {
  search?: string;
  ward?: number;
  categoryId?: string;
  businessType?: string;
  ownershipType?: string;
  isActive?: boolean;
}

export interface DashboardStats {
  totalBusinesses: number;
  activeBusinesses: number;
  totalCategories: number;
  businessesPendingRenewal: number;
  businessesByType: Array<{
    type: string;
    count: number;
  }>;
  businessesByOwnership: Array<{
    ownership: string;
    count: number;
  }>;
  businessesByWard: Array<{
    ward: number;
    count: number;
  }>;
  businessesBySector: Array<{
    sector: string;
    count: number;
  }>;
}