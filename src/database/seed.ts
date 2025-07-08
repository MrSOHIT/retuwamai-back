import prisma from '../config/database';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default admin user
  const hashedAdminPassword = await bcrypt.hash('password', 12);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@ratuwamai.gov.np',
      password: hashedAdminPassword,
      role: 'ADMIN',
      fullName: 'Admin User',
    },
  });

  // Create default worker user
  const hashedWorkerPassword = await bcrypt.hash('worker', 12);
  const worker = await prisma.user.upsert({
    where: { username: 'worker' },
    update: {},
    create: {
      username: 'worker',
      email: 'worker@ratuwamai.gov.np',
      password: hashedWorkerPassword,
      role: 'WORKER',
      fullName: 'Data Entry Worker',
    },
  });

  // Create default categories
  const categories = [
    { name: 'होटल', nameEnglish: 'Hotel' },
    { name: 'फार्मेसी', nameEnglish: 'Pharmacy' },
    { name: 'कृषि', nameEnglish: 'Agriculture' },
    { name: 'दुग्ध उद्योग', nameEnglish: 'Dairy Industry' },
    { name: 'सेवा', nameEnglish: 'Service' },
    { name: 'कुखुरा फार्म', nameEnglish: 'Poultry Farm' },
    { name: 'मोटरसाइकल मर्मत', nameEnglish: 'Motorcycle Repair' },
    { name: 'रेस्टुरेन्ट', nameEnglish: 'Restaurant' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Create sample business data
  const hotelCategory = await prisma.category.findUnique({
    where: { name: 'होटल' }
  });

  if (hotelCategory) {
    await prisma.business.upsert({
      where: { id: 'sample-business-1' },
      update: {},
      create: {
        id: 'sample-business-1',
        businessName: 'सुनिल होटल',
        contactPerson: 'सुनिल अधिकारी',
        position: 'स्वामी',
        businessAddress: 'भानेपा',
        contactNumber: '9842328403',
        email: 'sunil@hotel.com',
        tole: 'भानेपा',
        wardNumber: 5,
        municipality: 'रतुवामाई नगरपालिका',
        establishmentYear: '२०७०',
        ownershipType: 'एकल स्वामित्व',
        businessType: 'सेवा',
        businessField: 'होटेल/रेस्टुरेन्ट',
        totalInvestment: 1500000,
        locationOwnership: 'स्वामित्वमा',
        annualTurnover: 2000000,
        permanentEmployees: 5,
        femaleEmployees: 2,
        incomeSource: 'स्थानीय',
        avgIncome: 150000,
        avgExpense: 100000,
        categoryId: hotelCategory.id,
        createdById: admin.id,
      },
    });
  }

  console.log('✅ Database seeding completed!');
  console.log(`👤 Admin user: admin / password`);
  console.log(`👤 Worker user: worker / worker`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });