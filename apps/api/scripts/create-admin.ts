import { PrismaClient, PaymentMethodEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@globalimmigration.com';
  const password = 'Admin@123456'; // change this to your desired password

  // Check if admin exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        passwordHash: hashed,
        role: 'SUPER_ADMIN',
        isEmailVerified: true,
      },
    });
    console.log('✅ Admin user created');
  } else {
    console.log('⚠️ Admin already exists');
  }

  // Create payment methods if missing
  const methods = [
    { type: PaymentMethodEnum.CRYPTO, displayName: 'Cryptocurrency', isActive: true },
    { type: PaymentMethodEnum.BANK_TRANSFER, displayName: 'Wire Transfer', isActive: true },
    { type: PaymentMethodEnum.PAYPAL, displayName: 'PayPal', isActive: true },
    { type: PaymentMethodEnum.CARD, displayName: 'Credit/Debit Card', isActive: false, suspensionMessage: 'Temporarily unavailable due to fraud prevention measures' },
  ];

  for (const method of methods) {
    const existingMethod = await prisma.paymentMethod.findFirst({
      where: { type: method.type },
    });
    if (!existingMethod) {
      await prisma.paymentMethod.create({ data: method });
      console.log(`✅ Payment method ${method.type} created`);
    } else {
      console.log(`⚠️ Payment method ${method.type} already exists`);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });