# DevSpark - Full Stack Website

A modern software development agency website with Node.js/Express backend and Next.js frontend.

## Project Structure

```
project/
├── backend/                 # Node.js + Express + MongoDB
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   ├── .env                 # Backend environment variables
│   ├── server.js            # Express server
│   └── seed.js              # Database seeding
│
├── frontend/                # Next.js 14 App
│   ├── app/                 # App Router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities & API client
│   ├── styles/              # Global CSS
│   └── .env                 # Frontend environment variables
│
└── package.json             # Root scripts
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
npm install
```

### Setup

1. MongoDB must be running locally or use MongoDB Atlas connection string

2. Seed the database:
```bash
npm run seed
```

3. Start both servers:
```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Admin Panel

- URL: http://localhost:3000/admin/login
- Email: `admin@devspark.com`
- Password: `admin123`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run build` | Build frontend for production |
| `npm run seed` | Seed database with sample data |

## Environment Variables

**Backend** (`backend/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devspark
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@devspark.com
ADMIN_PASSWORD=admin123
```

**Frontend** (`frontend/.env`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Lucide Icons
