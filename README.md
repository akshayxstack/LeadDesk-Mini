# LeadDesk Mini

## Data Model
- **Lead**: `_id` (ObjectId), `name` (String, 2-80 chars), `email` (String, lowercased), `budgetRange` (String: `<5k` | `5-10k` | `10k+`), `message` (String, 10-1000 chars), `status` (String: `New` | `Contacted` | `Closed`), `createdAt` (Date), `updatedAt` (Date).
- **AdminUser**: `_id` (ObjectId), `username` (String), `passwordHash` (String, bcrypt 10 salt rounds), `createdAt` (Date).

## Why MongoDB Was Used
MongoDB was chosen for its flexible document schema that naturally models lead objects without complex relational overhead. It enables high-performance read/write operations and seamless integration with Mongoose validation.

## Auth Approach
Passwords are hashed using bcrypt (10 salt rounds), and login issues a JWT signed with `JWT_SECRET` expiring in 1 hour (`expiresIn: "1h"`). The token is stored strictly in client memory (React state) to prevent XSS token theft, accepting the deliberate tradeoff that hard page refreshes require re-login.

## Stated Assumptions
1. **Budget Ranges**: Standardized exclusively to `<5k`, `5-10k`, and `10k+` bands.
2. **Message Limits**: Constrained strictly to 10–1000 characters with 10KB payload body size limits on the server.

## Setup Instructions
1. **Environment Variables**:
   - Backend (`server/.env`): `MONGODB_URI`, `JWT_SECRET`, `PORT=5000`
   - Frontend (`client/.env`): `VITE_API_BASE_URL`
2. **Install Command**: `cd server && npm install && cd ../client && npm install`
3. **Run Command**: Seed admin via `node server/scripts/seedAdmin.js`, start server via `cd server && npm run dev`, and start frontend via `cd client && npm run dev`.
