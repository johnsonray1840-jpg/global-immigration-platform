import { test, expect } from '@playwright/test';

test('full user flow', async ({ page }) => {
  // Register
  await page.goto('/register');
  const email = `user${Date.now()}@example.com`;
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'StrongPass1!');
  await page.fill('input[name="confirmPassword"]', 'StrongPass1!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/verify-email/);

  // Verify email (simulated code entry)
  await page.fill('input[placeholder="••••••"]', '123456');
  await page.click('button:has-text("Verify")');
  await expect(page).toHaveURL(/onboarding/);

  // Complete onboarding
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'Doe');
  await page.fill('input[name="nationality"]', 'Nigeria');
  await page.click('button:has-text("Next")');
  await page.selectOption('select[name="migrationPurpose"]', 'work');
  await page.click('button:has-text("Next")');
  await page.fill('input[name="occupation"]', 'Engineer');
  await page.fill('input[name="annualIncome"]', '50000');
  await page.click('button:has-text("Next")');
  await page.fill('input[name="investmentBudget"]', '10000');
  await page.click('button:has-text("Complete")');
  await expect(page).toHaveURL(/dashboard/);

  // Eligibility check
  await page.goto('/eligibility');
  await page.selectOption('select[name="originCountryCode"]', 'NG');
  await page.selectOption('select[name="destinationCountryCode"]', 'US');
  await page.click('button:has-text("Next")');
  await page.fill('input[name="age"]', '30');
  await page.click('button:has-text("Next")');
  await page.fill('input[name="annualIncome"]', '10000');
  await page.click('button:has-text("Check Eligibility")');
  await expect(page.locator('text=LIKELY ELIGIBLE').first()).toBeVisible();

  // Save as case (requires login, which we already have via token)
  await page.click('button:has-text("Save as Case")');

  // Navigate to cases
  await page.goto('/dashboard/cases');
  await expect(page.locator('text=Nigeria → United States')).toBeVisible();

  // Document upload
  await page.goto('/dashboard/documents');
  // Simulate file upload via input
  await page.setInputFiles('input[type="file"]', {
    name: 'passport.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('fake pdf content'),
  });
  await expect(page.locator('text=Uploading')).toBeVisible();

  // Wallet deposit
  await page.goto('/dashboard/wallet');
  const depositButton = page.locator('button:has-text("Deposit Funds")');
  await depositButton.click();
  page.once('dialog', async (dialog) => {
    await dialog.accept('50');
  });
  await expect(page.locator('text=Choose Payment Method')).toBeVisible();
  // select crypto
  await page.click('text=Crypto');
  await page.click('text=BTC');
  await expect(page.locator('text=Complete Your Payment')).toBeVisible();
  await page.click('button:has-text("I have made the payment")');
  await expect(page.locator('text=Payment Submitted for Review')).toBeVisible();

  // Logout
  // We'll assume done.
});
