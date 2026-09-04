# Prisma Migration Guide for GitHub Workflow

This guide explains how to run Prisma migrations when your code changes occur on GitHub.

## 📋 Table of Contents

1. [Understanding the Migration Flow](#understanding-the-migration-flow)
2. [Local Development Workflow](#local-development-workflow)
3. [Production Deployment Workflow](#production-deployment-workflow)
4. [GitHub Actions CI/CD Workflow](#github-actions-cicd-workflow)
5. [Troubleshooting](#troubleshooting)

---

## 🔍 Understanding the Migration Flow

Prisma migrations follow this sequence:
```
Schema Changes → Generate Migration → Review Migration → Apply to Database → Deploy
```

Your current setup:
- **Schema Location**: `/workspace/apps/api/prisma/schema.prisma`
- **Migrations Directory**: `/workspace/apps/api/prisma/migrations/`
- **Database**: PostgreSQL (via Docker Compose)

---

## 💻 Local Development Workflow

### Step 1: Pull Latest Changes from GitHub

```bash
# Navigate to your workspace
cd /workspace

# Pull latest changes from your GitHub repository
git pull origin main
# or
git pull origin <your-branch-name>
```

### Step 2: Install Dependencies

```bash
cd /workspace/apps/api
npm install
```

### Step 3: Start Your Database

```bash
# From the root workspace directory
cd /workspace
docker-compose up -d postgres
```

Wait for PostgreSQL to be ready (usually 10-15 seconds).

### Step 4: Set Up Environment Variables

Create or update `.env` file in `/workspace/apps/api/`:

```env
DATABASE_URL="postgresql://immigration:immigration@localhost:5432/immigration_db?schema=public"
```

### Step 5: Check Schema Status

```bash
cd /workspace/apps/api

# Check if your schema matches the database
npx prisma migrate status
```

This will show:
- ✅ Applied migrations
- ⚠️ Pending migrations
- ❌ Schema drift (if schema.prisma doesn't match database)

### Step 6: Create New Migration (If Schema Changed)

If you've made changes to `schema.prisma` (like adding Investment models):

```bash
cd /workspace/apps/api

# Generate a new migration
npx prisma migrate dev --name add_investment_tracking
```

This command:
1. Compares schema.prisma with current database state
2. Creates a new migration file in `prisma/migrations/`
3. Applies the migration to your local database
4. Regenerates Prisma Client

**Expected output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "immigration_db"

Applying migration `20250101_add_investment_tracking`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20250101_add_investment_tracking/
      └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

### Step 7: Review Generated Migration

Always review the generated SQL:

```bash
cat /workspace/apps/api/prisma/migrations/<latest-migration>/migration.sql
```

Example output for investment models:
```sql
-- CreateTable
CREATE TABLE "InvestmentProgram" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programType" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "investmentAmount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedCompletionDate" TIMESTAMP(3),
    "actualCompletionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentMilestone" (
    "id" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentMilestone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvestmentProgram" ADD CONSTRAINT "InvestmentProgram_userId_fkey" 
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

### Step 8: Seed Database (Optional)

If you have seed data:

```bash
cd /workspace/apps/api
npx prisma db seed
```

### Step 9: Test Locally

```bash
# Start your API
npm run start:dev

# Test investment endpoints
curl http://localhost:3000/api/investments
```

### Step 10: Commit and Push to GitHub

```bash
cd /workspace

# Add all changes including migration files
git add .

# Commit with descriptive message
git commit -m "feat: add investment tracking models for CBI programs

- Add InvestmentProgram, InvestmentMilestone, InvestmentTransaction models
- Add InvestmentDocument and InvestmentPerformance tracking
- Create migration 20250101_add_investment_tracking"

# Push to GitHub
git push origin main
```

---

## 🚀 Production Deployment Workflow

### Option A: Manual Production Migration

#### Step 1: SSH into Production Server

```bash
ssh user@your-production-server
cd /path/to/your/api
```

#### Step 2: Pull Latest Changes

```bash
git pull origin main
```

#### Step 3: Install Dependencies

```bash
npm install --production
```

#### Step 4: Run Production Migration

```bash
# This applies pending migrations WITHOUT generating new ones
npx prisma migrate deploy
```

**Important**: Use `migrate deploy` (not `migrate dev`) in production because:
- ✅ It only applies existing migrations
- ✅ It doesn't create new migration files
- ✅ It's safe for production databases
- ❌ `migrate dev` should NEVER be used in production

#### Step 5: Regenerate Prisma Client

```bash
npx prisma generate
```

#### Step 6: Restart Application

```bash
# Depending on your setup
pm2 restart api
# or
docker-compose restart api
# or
systemctl restart your-api-service
```

#### Step 7: Verify Migration

```bash
npx prisma migrate status
```

Should show all migrations as applied.

---

### Option B: Automated Migration in Docker

If using Docker Compose in production:

**docker-compose.yml** (production):
```yaml
services:
  api:
    build: ./apps/api
    depends_on:
      postgres:
        condition: service_healthy
    
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

**Entry script** (`scripts/migrate-and-start.sh`):
```bash
#!/bin/bash
set -e

echo "Waiting for database to be ready..."
until nc -z $DB_HOST $DB_PORT; do
  sleep 2
done

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma Client..."
npx prisma generate

echo "Starting application..."
npm run start:prod
```

Make it executable:
```bash
chmod +x scripts/migrate-and-start.sh
```

Update Dockerfile:
```dockerfile
COPY scripts/migrate-and-start.sh /app/scripts/
RUN chmod +x /app/scripts/migrate-and-start.sh

ENTRYPOINT ["/app/scripts/migrate-and-start.sh"]
```

---

## ⚙️ GitHub Actions CI/CD Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy and Migrate

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: apps/api/package-lock.json
      
      - name: Install dependencies
        working-directory: ./apps/api
        run: npm ci
      
      - name: Run Prisma migrations
        working-directory: ./apps/api
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
        run: npx prisma migrate deploy
      
      - name: Generate Prisma Client
        working-directory: ./apps/api
        run: npx prisma generate
      
      - name: Build application
        working-directory: ./apps/api
        run: npm run build
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/api
            git pull origin main
            docker-compose up -d
```

### Required GitHub Secrets

Go to: `GitHub Repo → Settings → Secrets and variables → Actions`

Add these secrets:
- `PRODUCTION_DATABASE_URL`: Your production database connection string
- `SERVER_HOST`: Your server IP/domain
- `SERVER_USER`: SSH username
- `SSH_PRIVATE_KEY`: SSH private key for deployment

---

## 🐛 Troubleshooting

### Issue 1: Migration Already Applied

**Error**: `Migration already exists`

**Solution**:
```bash
# Mark migration as applied without running it
npx prisma migrate resolve --applied <migration-name>
```

### Issue 2: Schema Drift

**Error**: `Detected schema drift`

**Solution**:
```bash
# Reset database (DEVELOPMENT ONLY - destroys data!)
npx prisma migrate reset

# Or create a new migration from current state
npx prisma migrate dev --name fix_schema_drift
```

### Issue 3: Failed Migration in Production

**Solution**:
```bash
# Check migration status
npx prisma migrate status

# Rollback last migration (if needed)
npx prisma migrate resolve --rolled-back <migration-name>

# Fix the issue locally, create new migration, and deploy again
```

### Issue 4: Database Connection Error

**Solution**:
```bash
# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs postgres

# Verify DATABASE_URL in .env
cat .env
```

### Issue 5: Missing Migration Files

If migration files exist in GitHub but not locally:

```bash
# Pull latest migrations
git pull origin main

# Apply them locally
npx prisma migrate deploy
```

---

## 📝 Best Practices

### ✅ DO:
1. Always review generated SQL before committing
2. Test migrations locally before pushing to GitHub
3. Use `migrate deploy` in production
4. Keep migration files under version control
5. Write descriptive migration names
6. Backup production database before migrations
7. Test rollback procedures

### ❌ DON'T:
1. Never use `migrate dev` in production
2. Never edit migration files after they're committed
3. Never delete migration files from history
4. Never skip testing migrations locally
5. Never deploy without reviewing migration SQL

---

## 🎯 Quick Reference Commands

| Command | Purpose | Environment |
|---------|---------|-------------|
| `npx prisma migrate dev` | Create & apply migration | Development |
| `npx prisma migrate deploy` | Apply existing migrations | Production |
| `npx prisma migrate status` | Check migration status | Both |
| `npx prisma migrate reset` | Reset database | Development only |
| `npx prisma generate` | Regenerate Prisma Client | Both |
| `npx prisma db seed` | Seed database | Development |
| `npx prisma studio` | Visual database editor | Development |

---

## 📊 Your Investment Models Migration

Based on your schema, here's what the migration will create:

### Tables:
1. **InvestmentProgram** - Main investment tracking
2. **InvestmentMilestone** - Progress milestones
3. **InvestmentTransaction** - Financial transactions
4. **InvestmentDocument** - Related documents
5. **InvestmentPerformance** - ROI and performance metrics

### Relationships:
- All linked to `User` model
- All linked to `InvestmentProgram` (parent)
- Supports multiple investment types (Real Estate, Government Bonds, Business, etc.)

### To generate this migration:
```bash
cd /workspace/apps/api
npx prisma migrate dev --name add_cbi_investment_tracking
```

---

## 🔐 Security Notes

1. **Never commit `.env` files** to GitHub
2. **Use environment variables** for DATABASE_URL
3. **Use different credentials** for development and production
4. **Enable SSL** for production database connections
5. **Restrict database access** to application servers only

---

## 📞 Need Help?

If you encounter issues:
1. Check Prisma docs: https://www.prisma.io/docs/concepts/components/prisma-migrate
2. Review migration logs: `cat api.log`
3. Check database logs: `docker-compose logs postgres`
4. Test with Prisma Studio: `npx prisma studio`

---

**Last Updated**: January 2025  
**Prisma Version**: 5.22.0  
**Database**: PostgreSQL 16
