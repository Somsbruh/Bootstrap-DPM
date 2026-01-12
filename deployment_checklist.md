# Supabase + Next.js Backend Deployment Checklist

This checklist outlines the steps to move your database from a local SQLite file to a shared Supabase PostgreSQL instance and deploy your backend logic.

## 1. Database Setup (Supabase)
- [x] **Create Supabase Project**: Done.
- [x] **Get Connection String**: Done.

## 2. Local Code Configuration
- [x] **Update Prisma Schema**: Done.
- [x] **Configure Environment Variables**: Done.

## 3. Database Migration
- [x] **Push Schema to Cloud**: Done.
- [x] **Seed the Database**: Done.
- [x] **Verify in Supabase Dashboard**: Pending verification by user.
    - Open the **Table Editor** on Supabase to confirm tables and data are present.

## 4. Frontend/API Deployment (Vercel)
- [ ] **Initialize Git**: Ensure your code is in a GitHub repository.
- [ ] **Deploy to Vercel**:
    - Import your project into Vercel.
    - **Add Environment Variables**: Copy the `DATABASE_URL` from your local `.env` to the Vercel project settings.
- [ ] **Build Step**:
    - Verify your build command: `prisma generate && next build`.

## 5. Verification
- [ ] **Access via Public URL**: Visit your Vercel deployment URL.
- [ ] **Test Real-time Data**: Add a patient on one machine and verify you see it on another machine.
