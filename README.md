# Fleetly

Fleetly is a small B2B transport marketplace built as a portfolio project.
Customer organizations publish passenger transport orders, while transport
providers accept them, assign vehicles and manage their execution.

## Main features

- JWT authentication with password hashing
- registration that atomically creates a user, organization and owner membership
- multi-tenant authorization based on the authenticated organization
- separate customer and transport provider organizations
- provider fleet management
- public transport order board with atomic order acceptance
- controlled order status transitions

## Tech stack

- Backend: NestJS, TypeScript, Prisma 7
- Database: PostgreSQL 15 in Docker
- Frontend: React 19, Vite, TypeScript

## Local setup

1. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

2. Copy `backend/.env.example` to `backend/.env` and replace `JWT_SECRET`.

3. Apply migrations and start the backend:

   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   npm run start:dev
   ```

4. Start the frontend in a second terminal:

   ```bash
   cd frontend
   npm run dev
   ```
