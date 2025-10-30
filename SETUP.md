# CCC Esports Authentication Setup Guide

This guide will help you set up authentication for the CCC Esports website using Supabase and NextAuth.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js installed on your machine

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `ccc-esports` (or any name you prefer)
   - Database Password: Create a strong password (save this!)
   - Region: Choose the closest region to you
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the sidebar
2. Go to **API** section
3. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **service_role key** (under "Project API keys" - this is a secret key!)

## Step 3: Set Up the Database

1. In your Supabase dashboard, click on the **SQL Editor** in the sidebar
2. Click **New Query**
3. Copy the contents of `scripts/01-create-users-table.sql` and paste it into the editor
4. Click **Run** to create the users table
5. Create another new query
6. Copy the contents of `scripts/02-seed-users.sql` and paste it
7. **IMPORTANT**: Before running, you need to generate bcrypt hashes for the passwords:
   - Go to https://bcrypt-generator.com/
   - Enter `admin123` and generate a hash
   - Replace the first password hash in the SQL with your generated hash
   - Enter `user123` and generate another hash
   - Replace the second password hash with this new hash
8. Click **Run** to seed the test users

## Step 4: Configure Environment Variables

1. In your project root, create a `.env.local` file
2. Copy the contents from `.env.example`
3. Fill in your values:

\`\`\`env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-this-below>

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=<your-project-url-from-step-2>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-from-step-2>
\`\`\`

4. Generate a NEXTAUTH_SECRET by running this command in your terminal:
   \`\`\`bash
   openssl rand -base64 32
   \`\`\`
   Or use an online generator: https://generate-secret.vercel.app/32

## Step 5: Install Dependencies

Run the following command in your project directory:

\`\`\`bash
npm install
# or
pnpm install
# or
yarn install
\`\`\`

## Step 6: Run the Development Server

\`\`\`bash
npm run dev
# or
pnpm dev
# or
yarn dev
\`\`\`

Open http://localhost:3000 in your browser.

## Step 7: Test the Authentication

### Test Login with Existing Users:

1. Click "Sign In" in the navbar
2. Try logging in with:
   - **Admin account**: username: `admin`, password: `admin123`
   - **Regular user**: username: `testuser`, password: `user123`

### Test Registration:

1. Go to the Register page
2. Create a new account with a unique username
3. You'll be automatically signed in after registration

### Test Admin Dashboard:

1. Sign in with the admin account
2. Click "Admin" in the navbar
3. You should see the admin dashboard with all users
4. Try changing a user's role or deleting a user

## Troubleshooting

### "Invalid username or password" error
- Make sure you correctly generated and replaced the bcrypt hashes in step 3
- Verify your Supabase credentials are correct in `.env.local`

### "Unauthorized" when accessing admin dashboard
- Make sure you're logged in with the admin account
- Check that the user's role in the database is set to 'ADMIN'

### Database connection errors
- Verify your `SUPABASE_SERVICE_ROLE_KEY` is correct (not the anon key!)
- Make sure your `NEXT_PUBLIC_SUPABASE_URL` is correct

## Security Notes

- **Never commit `.env.local` to version control**
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security - keep it secret!
- In production, make sure to use strong passwords and enable additional security features
- Consider adding rate limiting to prevent brute force attacks

## Next Steps

- Set up Row Level Security (RLS) policies in Supabase for additional security
- Add email verification for new registrations
- Implement password reset functionality
- Add more user profile fields as needed
