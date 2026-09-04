// import { PrismaClient, Role, VisaCategory, PaymentMethodEnum } from '@prisma/client';
// import * as bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('🌍 Seeding database...');

//   // 1. Seed Countries (50+)
//   const countries = [
//     { name: 'United States', code: 'US', continent: 'North America', passportRank: 8, safetyIndex: 68, livingCostIndex: 78, healthcareIndex: 75, educationIndex: 85, taxRate: 37, currency: 'USD', languages: ['English'] },
//     { name: 'Canada', code: 'CA', continent: 'North America', passportRank: 6, safetyIndex: 83, livingCostIndex: 68, healthcareIndex: 82, educationIndex: 80, taxRate: 33, currency: 'CAD', languages: ['English', 'French'] },
//     { name: 'United Kingdom', code: 'GB', continent: 'Europe', passportRank: 5, safetyIndex: 72, livingCostIndex: 80, healthcareIndex: 78, educationIndex: 82, taxRate: 45, currency: 'GBP', languages: ['English'] },
//     { name: 'Australia', code: 'AU', continent: 'Oceania', passportRank: 7, safetyIndex: 80, livingCostIndex: 75, healthcareIndex: 80, educationIndex: 78, taxRate: 45, currency: 'AUD', languages: ['English'] },
//     { name: 'New Zealand', code: 'NZ', continent: 'Oceania', passportRank: 6, safetyIndex: 85, livingCostIndex: 72, healthcareIndex: 80, educationIndex: 77, taxRate: 33, currency: 'NZD', languages: ['English', 'Maori'] },
//     { name: 'Germany', code: 'DE', continent: 'Europe', passportRank: 3, safetyIndex: 78, livingCostIndex: 70, healthcareIndex: 88, educationIndex: 83, taxRate: 45, currency: 'EUR', languages: ['German'] },
//     { name: 'France', code: 'FR', continent: 'Europe', passportRank: 4, safetyIndex: 70, livingCostIndex: 75, healthcareIndex: 85, educationIndex: 80, taxRate: 45, currency: 'EUR', languages: ['French'] },
//     { name: 'Italy', code: 'IT', continent: 'Europe', passportRank: 4, safetyIndex: 68, livingCostIndex: 65, healthcareIndex: 82, educationIndex: 75, taxRate: 43, currency: 'EUR', languages: ['Italian'] },
//     { name: 'Spain', code: 'ES', continent: 'Europe', passportRank: 4, safetyIndex: 73, livingCostIndex: 60, healthcareIndex: 80, educationIndex: 74, taxRate: 45, currency: 'EUR', languages: ['Spanish'] },
//     { name: 'Portugal', code: 'PT', continent: 'Europe', passportRank: 5, safetyIndex: 82, livingCostIndex: 55, healthcareIndex: 78, educationIndex: 72, taxRate: 48, currency: 'EUR', languages: ['Portuguese'] },
//     { name: 'Netherlands', code: 'NL', continent: 'Europe', passportRank: 3, safetyIndex: 80, livingCostIndex: 76, healthcareIndex: 86, educationIndex: 82, taxRate: 49, currency: 'EUR', languages: ['Dutch'] },
//     { name: 'Ireland', code: 'IE', continent: 'Europe', passportRank: 5, safetyIndex: 82, livingCostIndex: 74, healthcareIndex: 75, educationIndex: 78, taxRate: 40, currency: 'EUR', languages: ['English', 'Irish'] },
//     { name: 'Switzerland', code: 'CH', continent: 'Europe', passportRank: 1, safetyIndex: 90, livingCostIndex: 95, healthcareIndex: 92, educationIndex: 86, taxRate: 40, currency: 'CHF', languages: ['German', 'French', 'Italian'] },
//     { name: 'Sweden', code: 'SE', continent: 'Europe', passportRank: 3, safetyIndex: 85, livingCostIndex: 73, healthcareIndex: 88, educationIndex: 84, taxRate: 57, currency: 'SEK', languages: ['Swedish'] },
//     { name: 'Norway', code: 'NO', continent: 'Europe', passportRank: 2, safetyIndex: 90, livingCostIndex: 85, healthcareIndex: 90, educationIndex: 85, taxRate: 38, currency: 'NOK', languages: ['Norwegian'] },
//     { name: 'Denmark', code: 'DK', continent: 'Europe', passportRank: 2, safetyIndex: 88, livingCostIndex: 80, healthcareIndex: 89, educationIndex: 86, taxRate: 55, currency: 'DKK', languages: ['Danish'] },
//     { name: 'Finland', code: 'FI', continent: 'Europe', passportRank: 2, safetyIndex: 88, livingCostIndex: 72, healthcareIndex: 87, educationIndex: 88, taxRate: 56, currency: 'EUR', languages: ['Finnish', 'Swedish'] },
//     { name: 'Belgium', code: 'BE', continent: 'Europe', passportRank: 4, safetyIndex: 75, livingCostIndex: 72, healthcareIndex: 84, educationIndex: 79, taxRate: 50, currency: 'EUR', languages: ['Dutch', 'French', 'German'] },
//     { name: 'Austria', code: 'AT', continent: 'Europe', passportRank: 3, safetyIndex: 85, livingCostIndex: 74, healthcareIndex: 86, educationIndex: 80, taxRate: 55, currency: 'EUR', languages: ['German'] },
//     { name: 'Poland', code: 'PL', continent: 'Europe', passportRank: 10, safetyIndex: 78, livingCostIndex: 48, healthcareIndex: 70, educationIndex: 76, taxRate: 32, currency: 'PLN', languages: ['Polish'] },
//     { name: 'Czech Republic', code: 'CZ', continent: 'Europe', passportRank: 8, safetyIndex: 80, livingCostIndex: 50, healthcareIndex: 74, educationIndex: 77, taxRate: 22, currency: 'CZK', languages: ['Czech'] },
//     { name: 'Singapore', code: 'SG', continent: 'Asia', passportRank: 1, safetyIndex: 92, livingCostIndex: 82, healthcareIndex: 90, educationIndex: 88, taxRate: 22, currency: 'SGD', languages: ['English', 'Malay', 'Mandarin', 'Tamil'] },
//     { name: 'Japan', code: 'JP', continent: 'Asia', passportRank: 2, safetyIndex: 86, livingCostIndex: 70, healthcareIndex: 91, educationIndex: 83, taxRate: 45, currency: 'JPY', languages: ['Japanese'] },
//     { name: 'South Korea', code: 'KR', continent: 'Asia', passportRank: 3, safetyIndex: 80, livingCostIndex: 68, healthcareIndex: 88, educationIndex: 85, taxRate: 42, currency: 'KRW', languages: ['Korean'] },
//     { name: 'UAE', code: 'AE', continent: 'Asia', passportRank: 15, safetyIndex: 84, livingCostIndex: 75, healthcareIndex: 80, educationIndex: 78, taxRate: 0, currency: 'AED', languages: ['Arabic', 'English'] },
//     { name: 'Qatar', code: 'QA', continent: 'Asia', passportRank: 12, safetyIndex: 85, livingCostIndex: 74, healthcareIndex: 82, educationIndex: 75, taxRate: 0, currency: 'QAR', languages: ['Arabic', 'English'] },
//     { name: 'Saudi Arabia', code: 'SA', continent: 'Asia', passportRank: 20, safetyIndex: 70, livingCostIndex: 58, healthcareIndex: 72, educationIndex: 70, taxRate: 0, currency: 'SAR', languages: ['Arabic'] },
//     { name: 'Malaysia', code: 'MY', continent: 'Asia', passportRank: 14, safetyIndex: 72, livingCostIndex: 42, healthcareIndex: 72, educationIndex: 72, taxRate: 28, currency: 'MYR', languages: ['Malay', 'English', 'Chinese', 'Tamil'] },
//     { name: 'Thailand', code: 'TH', continent: 'Asia', passportRank: 18, safetyIndex: 68, livingCostIndex: 38, healthcareIndex: 76, educationIndex: 68, taxRate: 35, currency: 'THB', languages: ['Thai'] },
//     { name: 'Turkey', code: 'TR', continent: 'Asia/Europe', passportRank: 25, safetyIndex: 55, livingCostIndex: 35, healthcareIndex: 68, educationIndex: 65, taxRate: 35, currency: 'TRY', languages: ['Turkish'] },
//     { name: 'Greece', code: 'GR', continent: 'Europe', passportRank: 8, safetyIndex: 74, livingCostIndex: 55, healthcareIndex: 78, educationIndex: 73, taxRate: 44, currency: 'EUR', languages: ['Greek'] },
//     { name: 'Malta', code: 'MT', continent: 'Europe', passportRank: 6, safetyIndex: 83, livingCostIndex: 60, healthcareIndex: 82, educationIndex: 73, taxRate: 35, currency: 'EUR', languages: ['Maltese', 'English'] },
//     { name: 'Cyprus', code: 'CY', continent: 'Europe', passportRank: 10, safetyIndex: 78, livingCostIndex: 55, healthcareIndex: 76, educationIndex: 72, taxRate: 35, currency: 'EUR', languages: ['Greek', 'Turkish'] },
//     { name: 'Luxembourg', code: 'LU', continent: 'Europe', passportRank: 2, safetyIndex: 88, livingCostIndex: 85, healthcareIndex: 90, educationIndex: 80, taxRate: 42, currency: 'EUR', languages: ['Luxembourgish', 'French', 'German'] },
//     { name: 'Brazil', code: 'BR', continent: 'South America', passportRank: 28, safetyIndex: 45, livingCostIndex: 40, healthcareIndex: 68, educationIndex: 65, taxRate: 27.5, currency: 'BRL', languages: ['Portuguese'] },
//     { name: 'Argentina', code: 'AR', continent: 'South America', passportRank: 22, safetyIndex: 55, livingCostIndex: 38, healthcareIndex: 70, educationIndex: 68, taxRate: 35, currency: 'ARS', languages: ['Spanish'] },
//     { name: 'Chile', code: 'CL', continent: 'South America', passportRank: 16, safetyIndex: 68, livingCostIndex: 52, healthcareIndex: 72, educationIndex: 70, taxRate: 35, currency: 'CLP', languages: ['Spanish'] },
//     { name: 'Mexico', code: 'MX', continent: 'North America', passportRank: 24, safetyIndex: 50, livingCostIndex: 45, healthcareIndex: 70, educationIndex: 66, taxRate: 30, currency: 'MXN', languages: ['Spanish'] },
//     { name: 'South Africa', code: 'ZA', continent: 'Africa', passportRank: 30, safetyIndex: 42, livingCostIndex: 48, healthcareIndex: 62, educationIndex: 65, taxRate: 45, currency: 'ZAR', languages: ['Zulu', 'Xhosa', 'Afrikaans', 'English'] },
//     { name: 'Rwanda', code: 'RW', continent: 'Africa', passportRank: 35, safetyIndex: 60, livingCostIndex: 35, healthcareIndex: 60, educationIndex: 60, taxRate: 30, currency: 'RWF', languages: ['Kinyarwanda', 'English', 'French'] },
//     { name: 'Mauritius', code: 'MU', continent: 'Africa', passportRank: 18, safetyIndex: 78, livingCostIndex: 55, healthcareIndex: 74, educationIndex: 72, taxRate: 15, currency: 'MUR', languages: ['English', 'French', 'Mauritian Creole'] },
//     { name: 'Estonia', code: 'EE', continent: 'Europe', passportRank: 5, safetyIndex: 82, livingCostIndex: 50, healthcareIndex: 78, educationIndex: 82, taxRate: 20, currency: 'EUR', languages: ['Estonian'] },
//     { name: 'Latvia', code: 'LV', continent: 'Europe', passportRank: 6, safetyIndex: 78, livingCostIndex: 48, healthcareIndex: 74, educationIndex: 77, taxRate: 23, currency: 'EUR', languages: ['Latvian'] },
//     { name: 'Lithuania', code: 'LT', continent: 'Europe', passportRank: 7, safetyIndex: 80, livingCostIndex: 46, healthcareIndex: 76, educationIndex: 78, taxRate: 15, currency: 'EUR', languages: ['Lithuanian'] },
//     { name: 'Hungary', code: 'HU', continent: 'Europe', passportRank: 9, safetyIndex: 74, livingCostIndex: 42, healthcareIndex: 72, educationIndex: 74, taxRate: 15, currency: 'HUF', languages: ['Hungarian'] },
//     { name: 'Croatia', code: 'HR', continent: 'Europe', passportRank: 11, safetyIndex: 80, livingCostIndex: 48, healthcareIndex: 74, educationIndex: 73, taxRate: 30, currency: 'EUR', languages: ['Croatian'] },
//     { name: 'Slovenia', code: 'SI', continent: 'Europe', passportRank: 7, safetyIndex: 84, livingCostIndex: 52, healthcareIndex: 78, educationIndex: 80, taxRate: 50, currency: 'EUR', languages: ['Slovenian'] },
//     { name: 'Slovakia', code: 'SK', continent: 'Europe', passportRank: 10, safetyIndex: 78, livingCostIndex: 46, healthcareIndex: 72, educationIndex: 74, taxRate: 25, currency: 'EUR', languages: ['Slovak'] },
//     { name: 'Iceland', code: 'IS', continent: 'Europe', passportRank: 2, safetyIndex: 95, livingCostIndex: 85, healthcareIndex: 90, educationIndex: 84, taxRate: 46, currency: 'ISK', languages: ['Icelandic'] },
//   ];

//   for (const c of countries) {
//     await prisma.country.upsert({
//       where: { code: c.code },
//       update: {},
//       create: c,
//     });
//   }
//   console.log('✅ Countries seeded');

//   // 2. Seed Visa Types
//   const visaTypes = Object.values(VisaCategory).map((cat) => ({
//     id: cat,
//     category: cat,
//     name: cat.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
//     description: `${cat.replace(/_/g, ' ')} visa pathway`,
//     isGlobal: true,
//   }));

//   for (const vt of visaTypes) {
//     await prisma.visaType.upsert({
//       where: { id: vt.id },
//       update: {},
//       create: vt,
//     });
//   }
//   console.log('✅ Visa types seeded');

//   // 3. Sample CountryVisaRule: US Tourist Visa
//   const nigeria = await prisma.country.findUnique({ where: { code: 'NG' } });
//   if (!nigeria) {
//     await prisma.country.create({
//       data: {
//         name: 'Nigeria',
//         code: 'NG',
//         continent: 'Africa',
//         passportRank: 40,
//         safetyIndex: 40,
//         livingCostIndex: 35,
//         healthcareIndex: 55,
//         educationIndex: 58,
//         taxRate: 24,
//         currency: 'NGN',
//         languages: ['English'],
//       },
//     });
//   }

//   const us = await prisma.country.findUnique({ where: { code: 'US' } });
//   await prisma.countryVisaRule.upsert({
//     where: { id: 'sample-us-tourist-ng' },
//     update: {},
//     create: {
//       id: 'sample-us-tourist-ng',
//       countryId: us!.id,
//       visaTypeId: VisaCategory.TOURIST,
//       eligibilityJson: {
//         minAge: 18,
//         maxAge: null,
//         education: [],
//         minIncome: 5000,
//         languageTest: null,
//       },
//       requiredDocs: ['passport', 'photo', 'bank_statement', 'travel_itinerary', 'hotel_booking'],
//       governmentFee: 160,
//       feeCurrency: 'USD',
//       processingTimeMin: 15,
//       processingTimeMax: 30,
//       validityPeriod: 24,
//       renewalAllowed: false,
//     },
//   });
//   console.log('✅ Sample visa rule added');

//   // 4. Super Admin user
//   const salt = await bcrypt.genSalt(10);
//   const hash = await bcrypt.hash('Admin@123', salt);
//   await prisma.user.upsert({
//     where: { email: 'admin@globalimmigration.com' },
//     update: {},
//     create: {
//       email: 'admin@globalimmigration.com',
//       passwordHash: hash,
//       role: Role.SUPER_ADMIN,
//       isEmailVerified: true,
//     },
//   });
//   console.log('✅ Admin user created');

//   // 5. Service Packages
//   const packages = [
//     { id: 'family-relocation', name: 'Family Relocation', category: 'family', serviceFee: 2500, includes: ['Eligibility Assessment', 'Dependent Applications', 'Document Preparation', 'Relocation Guide'] },
//     { id: 'student-success', name: 'Student Success', category: 'student', serviceFee: 1200, includes: ['University Matching', 'Scholarship Search', 'Admission Assistance', 'Visa Guidance'] },
//     { id: 'skilled-worker', name: 'Skilled Worker', category: 'skilled_worker', serviceFee: 3000, includes: ['Job Matching', 'Work Permit Application', 'Document Review', 'Express Processing'] },
//     { id: 'business-investor', name: 'Business & Investor', category: 'investor', serviceFee: 8000, includes: ['Investment Advisory', 'Business Plan Review', 'Golden Visa Application', 'Legal Support'] },
//     { id: 'tourist-holiday', name: 'Tourist & Holiday', category: 'tourist', serviceFee: 300, includes: ['Visa Application', 'Travel Insurance', 'Itinerary Review'] },
//     { id: 'citizenship-pr', name: 'Citizenship & PR', category: 'citizenship', serviceFee: 5000, includes: ['Permanent Residence Application', 'Citizenship by Naturalization', 'Document Collection', 'Interview Preparation'] },
//   ];
//   for (const pkg of packages) {
//     await prisma.servicePackage.upsert({
//       where: { id: pkg.id },
//       update: {},
//       create: { ...pkg, currency: 'USD', imageUrl: null, isActive: true },
//     });
//   }
//   console.log('✅ Service packages seeded');

//   // 6. Seed Payment Methods (new)
//   const paymentMethods = [
//     { id: 'CARD', type: PaymentMethodEnum.CARD, displayName: 'Credit/Debit Card', isActive: false, suspensionMessage: 'This payment method is temporarily unavailable at this time. Please try again later.' },
//     { id: 'PAYPAL', type: PaymentMethodEnum.PAYPAL, displayName: 'PayPal', isActive: true, suspensionMessage: null },
//     { id: 'BANK_TRANSFER', type: PaymentMethodEnum.BANK_TRANSFER, displayName: 'Wire Transfer', isActive: true, suspensionMessage: null },
//     { id: 'CRYPTO', type: PaymentMethodEnum.CRYPTO, displayName: 'Cryptocurrency', isActive: true, suspensionMessage: null },
//   ];
//   for (const pm of paymentMethods) {
//     await prisma.paymentMethod.upsert({
//       where: { id: pm.id },
//       update: {},
//       create: pm,
//     });
//   }
//   console.log('✅ Payment methods seeded');

//   // 7. Seed Wire Bank Account for Nigeria
//   if (nigeria) {
//     await prisma.wireBankAccount.upsert({
//       where: { id: 'wire-ng-1' },
//       update: {},
//       create: {
//         id: 'wire-ng-1',
//         countryId: nigeria.id,
//         bankName: 'Zenith Bank',
//         accountName: 'Global Immigration Services',
//         accountNumber: '1234567890',
//         swiftCode: 'ZENINGLA',
//         routingNumber: '021001088',
//         iban: null,
//         address: 'Plot 84, Ajose Adeogun Street, Victoria Island, Lagos',
//         isActive: true,
//       },
//     });
//     console.log('✅ Wire account seeded for Nigeria');
//   }

//   // 8. Create Wallet for Admin
//   const adminUser = await prisma.user.findUnique({ where: { email: 'admin@globalimmigration.com' } });
//   if (adminUser) {
//     await prisma.wallet.upsert({
//       where: { userId: adminUser.id },
//       update: {},
//       create: { userId: adminUser.id, balance: 0, currency: 'USD' },
//     });
//     console.log('✅ Admin wallet created');
//   }

//   // Seed Universities and Scholarships (for public pages)
//   const university = await prisma.university.upsert({
//     where: { id: 'uni-1' },
//     update: {},
//     create: {
//       id: 'uni-1',
//       countryId: (await prisma.country.findUnique({ where: { code: 'US' } }))!.id,
//       name: 'Stanford University',
//       ranking: 3,
//       tuitionRange: '$50,000 - $60,000',
//       website: 'https://stanford.edu',
//     },
//   });

//   await prisma.scholarship.upsert({
//     where: { id: 'scholarship-1' },
//     update: {},
//     create: {
//       id: 'scholarship-1',
//       universityId: university.id,
//       countryId: (await prisma.country.findUnique({ where: { code: 'US' } }))!.id,
//       name: 'Stanford International Student Scholarship',
//       description: 'Full tuition scholarship for outstanding international students.',
//       fundingAmount: 50000,
//       deadline: new Date('2027-01-15'),
//     },
//   });

//     // 9. Seed Offices
//     const officesData = [
//       { id: 'office-us', countryId: (await prisma.country.findUnique({ where: { code: 'US' } }))!.id, address: '350 Fifth Avenue, New York, NY 10118', phone: '+1 (212) 555-0100', email: 'us@globalimmigration.com', lat: 40.7128, lng: -74.0060 },
//       { id: 'office-ca', countryId: (await prisma.country.findUnique({ where: { code: 'CA' } }))!.id, address: '250 Front Street West, Toronto, ON M5V 3G5', phone: '+1 (416) 555-0100', email: 'ca@globalimmigration.com', lat: 43.6532, lng: -79.3832 },
//       { id: 'office-gb', countryId: (await prisma.country.findUnique({ where: { code: 'GB' } }))!.id, address: '1 Canada Square, London E14 5AB', phone: '+44 20 7555 0100', email: 'uk@globalimmigration.com', lat: 51.5049, lng: -0.0195 },
//       { id: 'office-au', countryId: (await prisma.country.findUnique({ where: { code: 'AU' } }))!.id, address: '120 Collins Street, Melbourne VIC 3000', phone: '+61 3 9555 0100', email: 'au@globalimmigration.com', lat: -37.8136, lng: 144.9631 },
//       { id: 'office-ng', countryId: (await prisma.country.findUnique({ where: { code: 'NG' } }))!.id, address: 'Plot 84, Ajose Adeogun Street, Victoria Island, Lagos', phone: '+234 1 555 0100', email: 'ng@globalimmigration.com', lat: 6.4281, lng: 3.4219 },
//     ];
  
//     for (const office of officesData) {
//       await prisma.office.upsert({
//         where: { id: office.id },
//         update: {},
//         create: office,
//       });
//     }
//     console.log('✅ Offices seeded');
  
//     // 10. Seed Partners
//     const partnersData = [
//       { id: 'partner-1', name: 'Worldwide Visas', logoUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=200&auto=format&fit=crop', website: 'https://example.com' },
//       { id: 'partner-2', name: 'Global Mobility Alliance', logoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200&auto=format&fit=crop', website: 'https://example.com' },
//       { id: 'partner-3', name: 'Immigration Law Partners', logoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=200&auto=format&fit=crop', website: 'https://example.com' },
//       { id: 'partner-4', name: 'Study Abroad Network', logoUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=200&auto=format&fit=crop', website: 'https://example.com' },
//       { id: 'partner-5', name: 'International Relocation Experts', logoUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=200&auto=format&fit=crop', website: 'https://example.com' },
//     ];
  
//     for (const partner of partnersData) {
//       await prisma.partner.upsert({
//         where: { id: partner.id },
//         update: {},
//         create: partner,
//       });
//     }
//     console.log('✅ Partners seeded');

//     // 11. Seed Wire Bank Account for Fallback (Bank of America)
//     await prisma.wireBankAccount.upsert({
//       where: { id: 'wire-fallback-boa' },
//       update: {},
//       create: {
//         id: 'wire-fallback-boa',
//         countryId: (await prisma.country.findUnique({ where: { code: 'US' } }))!.id,
//         bankName: 'Bank of America',
//         accountName: 'Global Immigration Services',
//         accountNumber: '00987654321',
//         swiftCode: 'BOFAUS3N',
//         routingNumber: '026009593',
//         iban: null,
//         address: '100 North Tryon Street, Charlotte, NC 28255',
//         isActive: true,
//         isFallback: true,
//       },
//     });

//     // inside seed function
// const canada = await prisma.country.upsert({
//   where: { code: 'CA' },
//   update: {},
//   create: {
//     name: 'Canada',
//     code: 'CA',
//     continent: 'North America',
//     passportRank: 7,
//     safetyIndex: 85,
//     livingCostIndex: 70,
//     healthcareIndex: 90,
//     educationIndex: 95,
//     currency: 'CAD',
//     languages: ['English', 'French'],
//   },
// });

// const touristVisa = await prisma.visaType.upsert({
//   where: { id: 'tourist-ca' },
//   update: {},
//   create: {
//     id: 'tourist-ca',
//     category: 'TOURIST',
//     name: 'Tourist Visa',
//     description: 'Visitor visa for tourism',
//     isGlobal: false,
//   },
// });

// await prisma.countryVisaRule.create({
//   data: {
//     countryId: canada.id,
//     visaTypeId: touristVisa.id,
//     eligibilityJson: { minAge: 18, minIncome: 10000 },
//     requiredDocs: ['Passport', 'Proof of Funds', 'Travel Itinerary'],
//     governmentFee: 100,
//     feeCurrency: 'CAD',
//     processingTimeMin: 15,
//     processingTimeMax: 30,
//     validityPeriod: 6,
//     renewalAllowed: false,
//   },
// });


// // Add this at the end of your seed function or as separate function

// async function seedVisaRules(prisma: any) {
//   const countries = [
//     { code: 'US', name: 'United States' },
//     { code: 'CA', name: 'Canada' },
//     { code: 'GB', name: 'United Kingdom' },
//     { code: 'AU', name: 'Australia' },
//     { code: 'DE', name: 'Germany' },
//     { code: 'SG', name: 'Singapore' },
//     { code: 'AE', name: 'United Arab Emirates' },
//   ];

//   // Upsert visa types
//   const touristVisa = await prisma.visaType.upsert({
//     where: { id: 'global-tourist' },
//     update: {},
//     create: {
//       id: 'global-tourist',
//       category: 'TOURIST',
//       name: 'Tourist Visa',
//       description: 'Visitor visa for tourism and short stays',
//       isGlobal: true,
//     },
//   });

//   const workVisa = await prisma.visaType.upsert({
//     where: { id: 'global-work' },
//     update: {},
//     create: {
//       id: 'global-work',
//       category: 'WORK_PERMIT',
//       name: 'Work Permit',
//       description: 'Employment visa for skilled workers',
//       isGlobal: true,
//     },
//   });

//   const studyVisa = await prisma.visaType.upsert({
//     where: { id: 'global-study' },
//     update: {},
//     create: {
//       id: 'global-study',
//       category: 'STUDENT',
//       name: 'Student Visa',
//       description: 'Visa for international students',
//       isGlobal: true,
//     },
//   });

//   const prVisa = await prisma.visaType.upsert({
//     where: { id: 'global-pr' },
//     update: {},
//     create: {
//       id: 'global-pr',
//       category: 'PERMANENT_RESIDENCE',
//       name: 'Permanent Residence',
//       description: 'Pathway to permanent residency',
//       isGlobal: true,
//     },
//   });

//   for (const country of countries) {
//     const existingCountry = await prisma.country.findUnique({
//       where: { code: country.code },
//     });
//     if (!existingCountry) continue; // skip if not found

//     const rules = [
//       {
//         visaTypeId: touristVisa.id,
//         eligibilityJson: { minAge: 18, minIncome: 5000 },
//         requiredDocs: ['Passport', 'Proof of Funds', 'Travel Itinerary'],
//         governmentFee: 160,
//         feeCurrency: 'USD',
//         processingTimeMin: 15,
//         processingTimeMax: 30,
//         validityPeriod: 6,
//       },
//       {
//         visaTypeId: workVisa.id,
//         eligibilityJson: { minAge: 22, minIncome: 30000, education: ['bachelor', 'master'] },
//         requiredDocs: ['Passport', 'Job Offer', 'Degree Certificate'],
//         governmentFee: 250,
//         feeCurrency: 'USD',
//         processingTimeMin: 30,
//         processingTimeMax: 90,
//         validityPeriod: 24,
//       },
//       {
//         visaTypeId: studyVisa.id,
//         eligibilityJson: { minAge: 17, education: ['high_school'] },
//         requiredDocs: ['Passport', 'University Acceptance', 'Proof of Funds'],
//         governmentFee: 120,
//         feeCurrency: 'USD',
//         processingTimeMin: 20,
//         processingTimeMax: 60,
//         validityPeriod: 12,
//       },
//       {
//         visaTypeId: prVisa.id,
//         eligibilityJson: { minAge: 18, minIncome: 40000, education: ['bachelor', 'master'] },
//         requiredDocs: ['Passport', 'Employment Reference', 'Police Clearance'],
//         governmentFee: 500,
//         feeCurrency: 'USD',
//         processingTimeMin: 90,
//         processingTimeMax: 180,
//         validityPeriod: 60,
//       },
//     ];

//     for (const rule of rules) {
//       await prisma.countryVisaRule.create({
//         data: {
//           countryId: existingCountry.id,
//           visaTypeId: rule.visaTypeId,
//           eligibilityJson: rule.eligibilityJson,
//           requiredDocs: rule.requiredDocs,
//           governmentFee: rule.governmentFee,
//           feeCurrency: rule.feeCurrency,
//           processingTimeMin: rule.processingTimeMin,
//           processingTimeMax: rule.processingTimeMax,
//           validityPeriod: rule.validityPeriod,
//         },
//       });
//     }
//   }
// }


// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


// File: apps/api/prisma/seed.ts
import { PrismaClient, VisaCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Seeding countries and visa rules...');

  // 1. Upsert visa types
  const visaTypes = [
    { id: 'global-tourist', category: 'TOURIST', name: 'Tourist Visa', description: 'Short stay for tourism and leisure', isGlobal: true },
    { id: 'global-work', category: 'WORK_PERMIT', name: 'Work Permit', description: 'Employment visa for skilled and semi-skilled workers', isGlobal: true },
    { id: 'global-study', category: 'STUDENT', name: 'Student Visa', description: 'Visa for international students enrolled in accredited institutions', isGlobal: true },
    { id: 'global-pr', category: 'PERMANENT_RESIDENCE', name: 'Permanent Residence', description: 'Pathway to permanent residency and eventual citizenship', isGlobal: true },
    { id: 'global-family', category: 'FAMILY_SPONSORSHIP', name: 'Family Sponsorship', description: 'Reunite with family members who are citizens or permanent residents', isGlobal: true },
    { id: 'global-investor', category: 'INVESTOR', name: 'Investor Visa', description: 'For individuals making significant financial investment', isGlobal: true },
    { id: 'global-business', category: 'BUSINESS', name: 'Business Visa', description: 'For entrepreneurs and business visitors', isGlobal: true },
    { id: 'global-retirement', category: 'RETIREMENT', name: 'Retirement Visa', description: 'For retirees seeking to live abroad', isGlobal: true },
    { id: 'global-digital-nomad', category: 'DIGITAL_NOMAD', name: 'Digital Nomad Visa', description: 'For remote workers and freelancers', isGlobal: true },
    { id: 'global-citizenship', category: 'CITIZENSHIP_INVESTMENT', name: 'Citizenship by Investment', description: 'Direct citizenship through qualifying investment', isGlobal: true },
  ];

  for (const vt of visaTypes) {
    await prisma.visaType.upsert({
      where: { id: vt.id },
      update: { name: vt.name, category: vt.category as VisaCategory, description: vt.description, isGlobal: vt.isGlobal },
      create: { ...vt, category: vt.category as VisaCategory },
    });
  }

  // 2. Upsert countries with essential data
  const countries = [
    { code: 'US', name: 'United States', continent: 'North America', passportRank: 8, safetyIndex: 75, livingCostIndex: 70, healthcareIndex: 85, educationIndex: 95, taxRate: 37, currency: 'USD', languages: ['English'] },
    { code: 'CA', name: 'Canada', continent: 'North America', passportRank: 7, safetyIndex: 90, livingCostIndex: 65, healthcareIndex: 92, educationIndex: 90, taxRate: 33, currency: 'CAD', languages: ['English', 'French'] },
    { code: 'GB', name: 'United Kingdom', continent: 'Europe', passportRank: 6, safetyIndex: 80, livingCostIndex: 75, healthcareIndex: 88, educationIndex: 88, taxRate: 45, currency: 'GBP', languages: ['English'] },
    { code: 'AU', name: 'Australia', continent: 'Oceania', passportRank: 9, safetyIndex: 95, livingCostIndex: 72, healthcareIndex: 91, educationIndex: 89, taxRate: 45, currency: 'AUD', languages: ['English'] },
    { code: 'DE', name: 'Germany', continent: 'Europe', passportRank: 4, safetyIndex: 85, livingCostIndex: 68, healthcareIndex: 93, educationIndex: 92, taxRate: 45, currency: 'EUR', languages: ['German'] },
    { code: 'FR', name: 'France', continent: 'Europe', passportRank: 5, safetyIndex: 82, livingCostIndex: 70, healthcareIndex: 91, educationIndex: 87, taxRate: 45, currency: 'EUR', languages: ['French'] },
    { code: 'SG', name: 'Singapore', continent: 'Asia', passportRank: 1, safetyIndex: 98, livingCostIndex: 80, healthcareIndex: 90, educationIndex: 90, taxRate: 22, currency: 'SGD', languages: ['English', 'Mandarin', 'Malay', 'Tamil'] },
    { code: 'AE', name: 'United Arab Emirates', continent: 'Asia', passportRank: 15, safetyIndex: 95, livingCostIndex: 75, healthcareIndex: 80, educationIndex: 75, taxRate: 0, currency: 'AED', languages: ['Arabic', 'English'] },
    { code: 'CH', name: 'Switzerland', continent: 'Europe', passportRank: 3, safetyIndex: 99, livingCostIndex: 85, healthcareIndex: 95, educationIndex: 93, taxRate: 40, currency: 'CHF', languages: ['German', 'French', 'Italian'] },
    { code: 'NZ', name: 'New Zealand', continent: 'Oceania', passportRank: 8, safetyIndex: 96, livingCostIndex: 68, healthcareIndex: 90, educationIndex: 88, taxRate: 33, currency: 'NZD', languages: ['English', 'Maori'] },
    { code: 'IE', name: 'Ireland', continent: 'Europe', passportRank: 6, safetyIndex: 90, livingCostIndex: 70, healthcareIndex: 85, educationIndex: 85, taxRate: 40, currency: 'EUR', languages: ['English', 'Irish'] },
    { code: 'JP', name: 'Japan', continent: 'Asia', passportRank: 2, safetyIndex: 97, livingCostIndex: 72, healthcareIndex: 92, educationIndex: 91, taxRate: 55, currency: 'JPY', languages: ['Japanese'] },
    { code: 'KR', name: 'South Korea', continent: 'Asia', passportRank: 3, safetyIndex: 96, livingCostIndex: 65, healthcareIndex: 89, educationIndex: 90, taxRate: 45, currency: 'KRW', languages: ['Korean'] },
    { code: 'NL', name: 'Netherlands', continent: 'Europe', passportRank: 5, safetyIndex: 90, livingCostIndex: 72, healthcareIndex: 90, educationIndex: 88, taxRate: 49.5, currency: 'EUR', languages: ['Dutch'] },
    { code: 'SE', name: 'Sweden', continent: 'Europe', passportRank: 5, safetyIndex: 93, livingCostIndex: 70, healthcareIndex: 94, educationIndex: 91, taxRate: 57, currency: 'SEK', languages: ['Swedish'] },
    { code: 'NO', name: 'Norway', continent: 'Europe', passportRank: 5, safetyIndex: 96, livingCostIndex: 75, healthcareIndex: 94, educationIndex: 90, taxRate: 38, currency: 'NOK', languages: ['Norwegian'] },
    { code: 'DK', name: 'Denmark', continent: 'Europe', passportRank: 4, safetyIndex: 95, livingCostIndex: 75, healthcareIndex: 92, educationIndex: 89, taxRate: 42, currency: 'DKK', languages: ['Danish'] },
    { code: 'FI', name: 'Finland', continent: 'Europe', passportRank: 4, safetyIndex: 96, livingCostIndex: 70, healthcareIndex: 93, educationIndex: 92, taxRate: 56, currency: 'EUR', languages: ['Finnish', 'Swedish'] },
    { code: 'AT', name: 'Austria', continent: 'Europe', passportRank: 5, safetyIndex: 93, livingCostIndex: 72, healthcareIndex: 91, educationIndex: 88, taxRate: 55, currency: 'EUR', languages: ['German'] },
    { code: 'BE', name: 'Belgium', continent: 'Europe', passportRank: 6, safetyIndex: 89, livingCostIndex: 70, healthcareIndex: 90, educationIndex: 87, taxRate: 50, currency: 'EUR', languages: ['Dutch', 'French', 'German'] },
    { code: 'PT', name: 'Portugal', continent: 'Europe', passportRank: 5, safetyIndex: 92, livingCostIndex: 60, healthcareIndex: 86, educationIndex: 83, taxRate: 48, currency: 'EUR', languages: ['Portuguese'] },
    { code: 'ES', name: 'Spain', continent: 'Europe', passportRank: 4, safetyIndex: 90, livingCostIndex: 62, healthcareIndex: 89, educationIndex: 84, taxRate: 45, currency: 'EUR', languages: ['Spanish'] },
    { code: 'IT', name: 'Italy', continent: 'Europe', passportRank: 4, safetyIndex: 88, livingCostIndex: 68, healthcareIndex: 87, educationIndex: 82, taxRate: 43, currency: 'EUR', languages: ['Italian'] },
    { code: 'GR', name: 'Greece', continent: 'Europe', passportRank: 8, safetyIndex: 85, livingCostIndex: 60, healthcareIndex: 84, educationIndex: 80, taxRate: 44, currency: 'EUR', languages: ['Greek'] },
    { code: 'CZ', name: 'Czech Republic', continent: 'Europe', passportRank: 7, safetyIndex: 90, livingCostIndex: 58, healthcareIndex: 85, educationIndex: 85, taxRate: 23, currency: 'CZK', languages: ['Czech'] },
    { code: 'PL', name: 'Poland', continent: 'Europe', passportRank: 10, safetyIndex: 89, livingCostIndex: 55, healthcareIndex: 80, educationIndex: 82, taxRate: 32, currency: 'PLN', languages: ['Polish'] },
    { code: 'HU', name: 'Hungary', continent: 'Europe', passportRank: 9, safetyIndex: 88, livingCostIndex: 55, healthcareIndex: 78, educationIndex: 80, taxRate: 15, currency: 'HUF', languages: ['Hungarian'] },
    { code: 'RO', name: 'Romania', continent: 'Europe', passportRank: 16, safetyIndex: 84, livingCostIndex: 50, healthcareIndex: 75, educationIndex: 78, taxRate: 10, currency: 'RON', languages: ['Romanian'] },
    { code: 'BG', name: 'Bulgaria', continent: 'Europe', passportRank: 18, safetyIndex: 82, livingCostIndex: 48, healthcareIndex: 72, educationIndex: 75, taxRate: 10, currency: 'BGN', languages: ['Bulgarian'] },
    { code: 'HR', name: 'Croatia', continent: 'Europe', passportRank: 17, safetyIndex: 86, livingCostIndex: 55, healthcareIndex: 79, educationIndex: 79, taxRate: 30, currency: 'EUR', languages: ['Croatian'] },
    { code: 'SK', name: 'Slovakia', continent: 'Europe', passportRank: 11, safetyIndex: 87, livingCostIndex: 55, healthcareIndex: 78, educationIndex: 80, taxRate: 25, currency: 'EUR', languages: ['Slovak'] },
    { code: 'SI', name: 'Slovenia', continent: 'Europe', passportRank: 10, safetyIndex: 91, livingCostIndex: 60, healthcareIndex: 84, educationIndex: 85, taxRate: 50, currency: 'EUR', languages: ['Slovenian'] },
    { code: 'LT', name: 'Lithuania', continent: 'Europe', passportRank: 12, safetyIndex: 88, livingCostIndex: 52, healthcareIndex: 78, educationIndex: 81, taxRate: 20, currency: 'EUR', languages: ['Lithuanian'] },
    { code: 'LV', name: 'Latvia', continent: 'Europe', passportRank: 13, safetyIndex: 86, livingCostIndex: 52, healthcareIndex: 76, educationIndex: 79, taxRate: 20, currency: 'EUR', languages: ['Latvian'] },
    { code: 'EE', name: 'Estonia', continent: 'Europe', passportRank: 9, safetyIndex: 90, livingCostIndex: 55, healthcareIndex: 80, educationIndex: 84, taxRate: 20, currency: 'EUR', languages: ['Estonian'] },
    { code: 'CY', name: 'Cyprus', continent: 'Europe', passportRank: 14, safetyIndex: 92, livingCostIndex: 60, healthcareIndex: 80, educationIndex: 78, taxRate: 12.5, currency: 'EUR', languages: ['Greek', 'Turkish'] },
    { code: 'MT', name: 'Malta', continent: 'Europe', passportRank: 7, safetyIndex: 95, livingCostIndex: 65, healthcareIndex: 85, educationIndex: 82, taxRate: 35, currency: 'EUR', languages: ['Maltese', 'English'] },
    { code: 'LU', name: 'Luxembourg', continent: 'Europe', passportRank: 3, safetyIndex: 97, livingCostIndex: 85, healthcareIndex: 91, educationIndex: 86, taxRate: 42, currency: 'EUR', languages: ['Luxembourgish', 'French', 'German'] },
    { code: 'IS', name: 'Iceland', continent: 'Europe', passportRank: 9, safetyIndex: 98, livingCostIndex: 80, healthcareIndex: 93, educationIndex: 90, taxRate: 46, currency: 'ISK', languages: ['Icelandic'] },
    { code: 'MX', name: 'Mexico', continent: 'North America', passportRank: 22, safetyIndex: 75, livingCostIndex: 45, healthcareIndex: 70, educationIndex: 72, taxRate: 35, currency: 'MXN', languages: ['Spanish'] },
    { code: 'BR', name: 'Brazil', continent: 'South America', passportRank: 19, safetyIndex: 70, livingCostIndex: 48, healthcareIndex: 75, educationIndex: 74, taxRate: 27.5, currency: 'BRL', languages: ['Portuguese'] },
    { code: 'AR', name: 'Argentina', continent: 'South America', passportRank: 20, safetyIndex: 72, livingCostIndex: 42, healthcareIndex: 76, educationIndex: 76, taxRate: 35, currency: 'ARS', languages: ['Spanish'] },
    { code: 'CL', name: 'Chile', continent: 'South America', passportRank: 16, safetyIndex: 85, livingCostIndex: 50, healthcareIndex: 80, educationIndex: 82, taxRate: 27, currency: 'CLP', languages: ['Spanish'] },
    { code: 'CO', name: 'Colombia', continent: 'South America', passportRank: 35, safetyIndex: 68, livingCostIndex: 42, healthcareIndex: 72, educationIndex: 75, taxRate: 35, currency: 'COP', languages: ['Spanish'] },
    { code: 'PE', name: 'Peru', continent: 'South America', passportRank: 28, safetyIndex: 70, livingCostIndex: 45, healthcareIndex: 68, educationIndex: 73, taxRate: 29.5, currency: 'PEN', languages: ['Spanish'] },
    { code: 'ZA', name: 'South Africa', continent: 'Africa', passportRank: 43, safetyIndex: 60, livingCostIndex: 40, healthcareIndex: 65, educationIndex: 70, taxRate: 45, currency: 'ZAR', languages: ['Afrikaans', 'English', 'Zulu'] },
    { code: 'NG', name: 'Nigeria', continent: 'Africa', passportRank: 80, safetyIndex: 55, livingCostIndex: 35, healthcareIndex: 60, educationIndex: 65, taxRate: 30, currency: 'NGN', languages: ['English'] },
    { code: 'EG', name: 'Egypt', continent: 'Africa', passportRank: 65, safetyIndex: 60, livingCostIndex: 30, healthcareIndex: 65, educationIndex: 70, taxRate: 22.5, currency: 'EGP', languages: ['Arabic'] },
    { code: 'KE', name: 'Kenya', continent: 'Africa', passportRank: 70, safetyIndex: 55, livingCostIndex: 32, healthcareIndex: 60, educationIndex: 68, taxRate: 30, currency: 'KES', languages: ['Swahili', 'English'] },
    { code: 'MA', name: 'Morocco', continent: 'Africa', passportRank: 67, safetyIndex: 65, livingCostIndex: 35, healthcareIndex: 62, educationIndex: 65, taxRate: 38, currency: 'MAD', languages: ['Arabic', 'French'] },
    { code: 'TH', name: 'Thailand', continent: 'Asia', passportRank: 60, safetyIndex: 70, livingCostIndex: 35, healthcareIndex: 75, educationIndex: 70, taxRate: 35, currency: 'THB', languages: ['Thai'] },
    { code: 'VN', name: 'Vietnam', continent: 'Asia', passportRank: 78, safetyIndex: 68, livingCostIndex: 30, healthcareIndex: 65, educationIndex: 72, taxRate: 35, currency: 'VND', languages: ['Vietnamese'] },
    { code: 'ID', name: 'Indonesia', continent: 'Asia', passportRank: 72, safetyIndex: 65, livingCostIndex: 28, healthcareIndex: 60, educationIndex: 65, taxRate: 35, currency: 'IDR', languages: ['Indonesian'] },
    { code: 'MY', name: 'Malaysia', continent: 'Asia', passportRank: 14, safetyIndex: 80, livingCostIndex: 35, healthcareIndex: 75, educationIndex: 78, taxRate: 30, currency: 'MYR', languages: ['Malay'] },
    { code: 'PH', name: 'Philippines', continent: 'Asia', passportRank: 68, safetyIndex: 65, livingCostIndex: 30, healthcareIndex: 62, educationIndex: 70, taxRate: 35, currency: 'PHP', languages: ['Filipino', 'English'] },
    { code: 'IN', name: 'India', continent: 'Asia', passportRank: 76, safetyIndex: 60, livingCostIndex: 25, healthcareIndex: 65, educationIndex: 75, taxRate: 42, currency: 'INR', languages: ['Hindi', 'English'] },
    { code: 'PK', name: 'Pakistan', continent: 'Asia', passportRank: 88, safetyIndex: 55, livingCostIndex: 25, healthcareIndex: 60, educationIndex: 65, taxRate: 35, currency: 'PKR', languages: ['Urdu', 'English'] },
    { code: 'BD', name: 'Bangladesh', continent: 'Asia', passportRank: 82, safetyIndex: 58, livingCostIndex: 22, healthcareIndex: 55, educationIndex: 62, taxRate: 30, currency: 'BDT', languages: ['Bengali'] },
    { code: 'TR', name: 'Turkey', continent: 'Europe/Asia', passportRank: 40, safetyIndex: 65, livingCostIndex: 32, healthcareIndex: 75, educationIndex: 78, taxRate: 40, currency: 'TRY', languages: ['Turkish'] },
    { code: 'RU', name: 'Russia', continent: 'Europe/Asia', passportRank: 45, safetyIndex: 60, livingCostIndex: 30, healthcareIndex: 65, educationIndex: 80, taxRate: 30, currency: 'RUB', languages: ['Russian'] },
    { code: 'UA', name: 'Ukraine', continent: 'Europe', passportRank: 35, safetyIndex: 55, livingCostIndex: 28, healthcareIndex: 60, educationIndex: 75, taxRate: 18, currency: 'UAH', languages: ['Ukrainian'] },
    { code: 'SA', name: 'Saudi Arabia', continent: 'Asia', passportRank: 55, safetyIndex: 75, livingCostIndex: 40, healthcareIndex: 70, educationIndex: 72, taxRate: 20, currency: 'SAR', languages: ['Arabic'] },
    { code: 'QA', name: 'Qatar', continent: 'Asia', passportRank: 52, safetyIndex: 95, livingCostIndex: 70, healthcareIndex: 85, educationIndex: 80, taxRate: 0, currency: 'QAR', languages: ['Arabic', 'English'] },
    { code: 'KW', name: 'Kuwait', continent: 'Asia', passportRank: 48, safetyIndex: 90, livingCostIndex: 65, healthcareIndex: 80, educationIndex: 75, taxRate: 0, currency: 'KWD', languages: ['Arabic'] },
  ];

  for (const c of countries) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  // 3. Clear existing visa rules
  await prisma.countryVisaRule.deleteMany();

  // 4. Create visa rules for each country
  for (const country of countries) {
    const countryRecord = await prisma.country.findUnique({ where: { code: country.code } });
    if (!countryRecord) continue;

    const rules = [
      {
        visaTypeId: 'global-tourist',
        eligibilityJson: { minAge: 18, minIncome: 3000 },
        requiredDocs: ['Passport', 'Proof of Funds', 'Travel Itinerary'],
        governmentFee: 100,
        feeCurrency: country.currency,
        processingTimeMin: 15,
        processingTimeMax: 30,
        validityPeriod: 3,
        renewalAllowed: false,
      },
      {
        visaTypeId: 'global-work',
        eligibilityJson: { minAge: 22, minIncome: 20000, education: ['bachelor', 'master'] },
        requiredDocs: ['Passport', 'Job Offer Letter', 'Degree Certificate', 'Police Clearance'],
        governmentFee: 250,
        feeCurrency: country.currency,
        processingTimeMin: 30,
        processingTimeMax: 90,
        validityPeriod: 24,
        renewalAllowed: true,
      },
      {
        visaTypeId: 'global-study',
        eligibilityJson: { minAge: 17, education: ['high_school'] },
        requiredDocs: ['Passport', 'University Acceptance', 'Proof of Funds'],
        governmentFee: 120,
        feeCurrency: country.currency,
        processingTimeMin: 20,
        processingTimeMax: 60,
        validityPeriod: 12,
        renewalAllowed: true,
      },
      {
        visaTypeId: 'global-pr',
        eligibilityJson: { minAge: 18, minIncome: 30000, education: ['bachelor', 'master'] },
        requiredDocs: ['Passport', 'Employment Reference', 'Police Clearance', 'Medical Report'],
        governmentFee: 500,
        feeCurrency: country.currency,
        processingTimeMin: 90,
        processingTimeMax: 180,
        validityPeriod: 60,
        renewalAllowed: true,
      },
      {
        visaTypeId: 'global-family',
        eligibilityJson: { minAge: 18 },
        requiredDocs: ['Passport', 'Proof of Relationship', 'Sponsor Documents'],
        governmentFee: 150,
        feeCurrency: country.currency,
        processingTimeMin: 60,
        processingTimeMax: 120,
        validityPeriod: 24,
        renewalAllowed: true,
      },
      {
        visaTypeId: 'global-investor',
        eligibilityJson: { minAge: 21, minInvestment: 100000 },
        requiredDocs: ['Passport', 'Proof of Investment Funds', 'Business Plan'],
        governmentFee: 800,
        feeCurrency: country.currency,
        processingTimeMin: 45,
        processingTimeMax: 120,
        validityPeriod: 36,
        renewalAllowed: true,
      },
      {
        visaTypeId: 'global-business',
        eligibilityJson: { minAge: 21, minIncome: 25000 },
        requiredDocs: ['Passport', 'Business Registration', 'Financial Statements'],
        governmentFee: 200,
        feeCurrency: country.currency,
        processingTimeMin: 30,
        processingTimeMax: 90,
        validityPeriod: 12,
        renewalAllowed: true,
      },
      {
        visaTypeId: 'global-retirement',
        eligibilityJson: { minAge: 55, minIncome: 1500 },
        requiredDocs: ['Passport', 'Pension Statement', 'Proof of Funds'],
        governmentFee: 100,
        feeCurrency: country.currency,
        processingTimeMin: 30,
        processingTimeMax: 60,
        validityPeriod: 24,
        renewalAllowed: true,
      },
      {
        visaTypeId: 'global-digital-nomad',
        eligibilityJson: { minAge: 18, minIncome: 2500 },
        requiredDocs: ['Passport', 'Proof of Remote Work', 'Health Insurance'],
        governmentFee: 150,
        feeCurrency: country.currency,
        processingTimeMin: 15,
        processingTimeMax: 45,
        validityPeriod: 12,
        renewalAllowed: true,
      },
    ];

    for (const rule of rules) {
      await prisma.countryVisaRule.create({
        data: {
          countryId: countryRecord.id,
          visaTypeId: rule.visaTypeId,
          eligibilityJson: rule.eligibilityJson,
          requiredDocs: rule.requiredDocs,
          governmentFee: rule.governmentFee,
          feeCurrency: rule.feeCurrency,
          processingTimeMin: rule.processingTimeMin,
          processingTimeMax: rule.processingTimeMax,
          validityPeriod: rule.validityPeriod,
          renewalAllowed: rule.renewalAllowed,
        },
      });
    }
  }

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  