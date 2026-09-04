# 🚀 Quick Start: Prisma Migration Commands

## For Local Development (Your Computer)

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd apps/api
npm install
```

### 2. Create .env file
```bash
cp .env.example .env
```

Edit `.env` and set:
```
DATABASE_URL="postgresql://immigration:immigration@localhost:5432/immigration_db?schema=public"
```

### 3. Start Database
```bash
# From workspace root
docker compose up -d postgres
```

### 4. Run Migrations
```bash
cd apps/api

# If schema changed, create new migration
npx prisma migrate dev --name describe_your_changes

# Apply all existing migrations
npx prisma migrate deploy

# Check status
npx prisma migrate status
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

### 6. View Database (Optional)
```bash
npx prisma studio
```

---

## For Production Deployment (Server)

### Option A: Manual SSH Deployment

```bash
# SSH to your server
ssh user@your-server.com

# Navigate to project
cd /path/to/api

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Run migrations (IMPORTANT: use deploy, not dev!)
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Restart application
pm2 restart api
# or
docker compose restart api
```

### Option B: Automated GitHub Actions

When you push to `main` branch:
1. GitHub Actions automatically tests migrations
2. If tests pass, it deploys to production
3. Migrations are applied automatically

**Required GitHub Secrets:**
- `PRODUCTION_DATABASE_URL`
- `SERVER_HOST`
- `SERVER_USER`
- `SSH_PRIVATE_KEY`
- `SERVER_PORT` (optional, default 22)
- `DEPLOY_PATH`

---

## Common Scenarios

### Scenario 1: You added new models to schema.prisma

```bash
# Local development
npx prisma migrate dev --name add_investment_models

# Commit and push
git add .
git commit -m "feat: add investment tracking models"
git push origin main

# Production (automatic via GitHub Actions OR manual)
npx prisma migrate deploy
```

### Scenario 2: You pulled code with new migrations from GitHub

```bash
git pull origin main

# Apply the new migrations
npx prisma migrate deploy

# Regenerate client
npx prisma generate
```

### Scenario 3: Database is out of sync

```bash
# Check what's wrong
npx prisma migrate status

# If development only - reset database
npx prisma migrate reset

# If production - create fix migration
npx prisma migrate dev --name fix_schema_issues
git add .
git commit -m "fix: resolve schema drift"
git push origin main
```

---

## ⚠️ Important Rules

| DO ✅ | DON'T ❌ |
|-------|---------|
| Use `migrate dev` locally | Use `migrate dev` in production |
| Use `migrate deploy` in production | Edit committed migration files |
| Review generated SQL | Delete migration history |
| Test migrations locally first | Deploy without testing |
| Keep .env out of Git | Commit sensitive credentials |

---

## 🔧 Troubleshooting Quick Fixes

```bash
# Error: Migration already exists
npx prisma migrate resolve --applied 20250101_migration_name

# Error: Schema drift detected
npx prisma migrate dev --name fix_drift

# Error: Database connection failed
# Check if Docker is running
docker compose ps
# Check DATABASE_URL in .env
cat .env

# Need to see database visually
npx prisma studio
```

---

## 📞 Next Steps

1. Read full guide: `/workspace/PRISMA_MIGRATION_GUIDE.md`
2. Check workflow: `.github/workflows/prisma-migrate.yml`
3. Review schema: `apps/api/prisma/schema.prisma`
4. See existing migrations: `apps/api/prisma/migrations/`
