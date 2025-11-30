# TerrassaMarket (Wallaplus)

A local marketplace for Terrassa, built with React, Vite, Convex, and Clerk.

## Features

- **Real-time Chat**: Chat with buyers and sellers instantly.
- **User Verification**: Clerk authentication and profile management.
- **Listings**: Create and browse listings with categories and filters.
- **Reviews**: Rate and review sellers.
- **Geolocation**: Filter by neighborhood (simulated).

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Convex (Real-time database & functions)
- **Auth**: Clerk

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create `.env.local` with:
   ```
   VITE_CONVEX_URL=...
   VITE_CLERK_PUBLISHABLE_KEY=...
   ```

3. **Start Backend**:
   ```bash
   npx convex dev
   ```

4. **Start Frontend**:
   ```bash
   npm run dev
   ```

## Project Structure

- `convex/`: Backend schema and functions.
- `src/views/`: Page components.
- `src/components/`: Reusable UI components.
- `src/types.ts`: TypeScript definitions.
