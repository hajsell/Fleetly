# Fleetly

Fleetly is a B2B SaaS fleet management system. It allows different companies to
manage their vehicles and drivers while keeping all organization data completely
isolated from each other.

## Tech Stack

- Backend: NestJS, TypeScript, Prisma 7, PostgreSQL (Docker)
- Frontend: React, Vite, TypeScript

## How to run locally

1. Start the PostgreSQL database using Docker:
   ```bash
   docker-compose up -d
   ```
2. Start the backend API:
   ```bash
   cd backend
   npm run start:dev
   ```
3. Start the frontend application:
   ```bash
   cd frontend
   npm run dev
   ```
