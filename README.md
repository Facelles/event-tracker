# EventFlow 📅

EventFlow is a modern, full-stack event management application built with **Next.js 15+ (App Router)**. It provides a beautiful interface to schedule, view, and organize your events through both an interactive calendar and a list view.

## ✨ Features
- **Secure Authentication**: NextAuth.js v5 with Google OAuth and Credentials providers.
- **Database**: PostgreSQL (Neon Serverless) and Prisma ORM for seamless data management.
- **Data Validation**: Strict payload validation using Zod.
- **Modern UI**: Built with Material-UI (MUI v6) with a customized dark theme, glassmorphism elements, and smooth micro-animations.
- **Interactive Calendar**: Custom-built calendar view to easily spot and manage events.
- **Server Actions**: Leveraging Next.js Server Actions for robust server-side mutations.

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have Node.js 18+ installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgres://user:password@endpoint/dbname"

# NextAuth Secret
AUTH_SECRET="your-secret-key-here"

# Google OAuth (Optional)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 4. Database Setup & Seeding
Push the Prisma schema to your database and seed it with demo data:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```
The seed script will create a demo user account with multiple events.
**Demo Login:**
- Email: `demo@example.com`
- Password: `password123`

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router, Server Actions)
- **Styling & Components**: Material-UI (MUI), Emotion
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Authentication**: NextAuth v5
- **Validation**: Zod
