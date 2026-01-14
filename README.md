# Mon Bridal and Events

A modern e-commerce and event decor hiring platform built with Next.js, Convex, Clerk, and Shadcn UI.

## Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- Node.js (v18+)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   bun install
   ```

2. **Environment Setup**
   - Rename `.env.local` (or create it) and fill in your Clerk and Convex keys.
   - You need a [Clerk](https://clerk.com) account and a [Convex](https://convex.dev) project.

   ```env
   # .env.local
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

3. **Initialize Convex**
   Run the Convex development server to generate types and sync schema:
   ```bash
   npx convex dev
   ```
   *This will prompt you to login and select a project.*

4. **Run the App**
   In a new terminal:
   ```bash
   bun dev
   ```

## Features

- **Store**: Browse and buy Jewelry.
- **Hiring**: Browse and request quotes for Decor.
- **Admin**: Upload products (visit `/admin` while signed in).
- **Search**: Real-time product search.
- **Cart**: Add items to cart/quote list.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Convex
- **Auth**: Clerk
- **Styling**: Tailwind CSS 4 + Shadcn UI
- **Language**: TypeScript
