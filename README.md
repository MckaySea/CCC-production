# CCC Esports Website

A modern esports club website built with Next.js, NextAuth, Prisma, and Supabase.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

\`\`\`env
# Database - Replace with your Supabase PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# NextAuth - Replace with your production URL and generate a secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
\`\`\`

To generate a secure `NEXTAUTH_SECRET`, run:
\`\`\`bash
openssl rand -base64 32
\`\`\`

### 2. Database Setup

Run Prisma migrations to create the database schema:

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

### 3. Seed Database (Optional)

Seed the database with test users:

\`\`\`bash
npx tsx scripts/seed-users.ts
\`\`\`

This creates:
- Admin user: `admin` / `admin123`
- Test user: `testuser` / `user123`

### 4. Generate Prisma Client

\`\`\`bash
npx prisma generate
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

## Features

- **Authentication**: Username/password authentication with NextAuth
- **User Roles**: USER and ADMIN roles with role-based access control
- **Admin Dashboard**: Manage users, toggle roles, and delete accounts
- **Team Pages**: Individual pages for each esports team
- **Sponsors Page**: Marketing page for potential sponsors
- **Responsive Design**: Mobile-friendly dark theme with green accents

## Tech Stack

- Next.js 15 with App Router
- NextAuth for authentication
- Prisma ORM
- PostgreSQL (Supabase)
- Tailwind CSS
- shadcn/ui components
