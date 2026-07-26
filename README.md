# LeadDesk Mini

## Status
This project is live and fully deployed:
- **Public Landing Page**: [https://leaddesk-mini.vercel.app](https://leaddesk-mini.vercel.app)
- **Admin Dashboard**: [https://leaddesk-mini.vercel.app/admin](https://leaddesk-mini.vercel.app/admin)
- **Backend API**: [https://leaddesk-mini.onrender.com](https://leaddesk-mini.onrender.com)
- **Database**: MongoDB Atlas Cloud Cluster

> [!NOTE]
> **Render Free-Tier Cold Starts**: The backend is hosted on Render's free tier. If the service has spun down due to inactivity, initial requests (such as submitting a lead or logging into the admin portal) may experience a cold-start delay of ~50 seconds while the web service container spins up. Subsequent requests respond instantly.

## Project Overview
LeadDesk Mini is a full-stack lead capture and management web application built for the Digital Heroes Full Stack Development task. It provides a public-facing landing page where prospective clients can submit inquiry leads, alongside a protected admin portal to view, search, and update lead statuses in real time.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas (via Mongoose ORM)
- **Authentication**: bcrypt.js, JSON Web Tokens (JWT)

## Data Model

### Lead Schema (`server/src/models/Lead.js`)
```javascript
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    budgetRange: {
      type: String,
      required: true,
      enum: ['<5k', '5-10k', '10k+']
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ['New', 'Contacted', 'Closed'],
      default: 'New'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

leadSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Lead', leadSchema);
```

### AdminUser Schema (`server/src/models/AdminUser.js`)
```javascript
const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('AdminUser', adminUserSchema);
```

## Why MongoDB
MongoDB was selected because lead submissions are self-contained document payloads with varying message lengths and enumerated attributes that do not require complex relational joins. MongoDB Atlas enables schema validation via Mongoose while allowing seamless document writes without SQL migration overhead.

## Auth Approach
- **Password Hashing**: Admin passwords are hashed using `bcryptjs` with 10 salt rounds before database persistence.
- **JWT Issuance**: Authenticated logins return a JSON Web Token signed with `JWT_SECRET` expiring in 1 hour (`expiresIn: "1h"`).
- **In-Memory Token Storage (XSS Protection)**: On the frontend, the JWT is held strictly in React memory state (`const [token, setToken] = useState<string | null>(null);`) rather than `localStorage` or `sessionStorage`. Storing tokens in `localStorage` leaves them vulnerable to Cross-Site Scripting (XSS) attacks where third-party scripts can read the token. Storing the token in memory scope prevents script access. The security tradeoff is that hard browser refreshes clear the token, intentionally requiring re-authentication.

## API Endpoints

| Method | Route | Auth Required | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | No | Authenticates admin credentials and issues 1-hour JWT token |
| `GET` | `/api/auth/me` | Yes | Verifies current JWT token and returns admin profile |
| `POST` | `/api/leads` | No | Validates and saves public lead submission (rate-limited) |
| `GET` | `/api/leads` | Yes | Retrieves all submitted leads with optional `?search=` filter |
| `PATCH` | `/api/leads/:id/status` | Yes | Updates lead status (`New`, `Contacted`, `Closed`) |

## Assumptions Made
- **Budget Ranges**: Standardized into three bands (`<5k`, `5-10k`, `10k+`) to normalize incoming lead valuations.
- **Message Length Limits**: Enforced strictly between 10 and 1,000 characters to block spam or payload buffer abuse.
- **Name Length**: Enforced between 2 and 80 characters.
- **Rate Limiting**: Applied an IP rate limiter on lead submissions (`POST /api/leads`) allowing a maximum of 5 submissions per 10-minute window per IP.
- **Email Normalization**: Emails are automatically trimmed and lowercased prior to storage.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas database cluster URI

### Environment Variables

1. **Backend (`server/.env`)**:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_jwt_key
   PORT=5000
   ```

2. **Frontend (`client/.env`)**:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

### Install Commands
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Run Commands
```bash
# Start backend server (from server directory)
cd server
npm run dev

# Start frontend dev server (from client directory)
cd client
npm run dev
```

### Admin Seeding
To seed the initial admin account, run:
```bash
node server/scripts/seedAdmin.js
```
*(Optionally pass custom credentials: `node server/scripts/seedAdmin.js <username> <password>`)*

## Test Credentials
- **Username**: `admin`
- **Password**: `AdminPass123!`
