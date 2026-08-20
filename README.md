# DevSpark - Modern Full Stack Agency Website

![DevSpark](https://img.shields.io/badge/DevSpark-v1.0.0-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7+-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-blue?style=for-the-badge&logo=tailwind-css)

A stunning, production-ready full-stack website for a software development agency. Built with modern technologies, featuring a powerful REST API backend and a beautiful responsive frontend.

## Features

- **Modern UI/UX** - Beautiful responsive design with Tailwind CSS
- **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- **Secure Admin Panel** - JWT authentication and role-based access control
- **MongoDB Integration** - NoSQL database with Mongoose ORM
- **Fast Performance** - Next.js 14 with optimized production builds
- **Smooth Animations** - Framer Motion for delightful interactions
- **Toast Notifications** - React Hot Toast for user feedback
- **SEO Optimized** - Meta tags, robots.txt, sitemap.xml
- **Contact Management** - Collect and manage client inquiries
- **Team Showcase** - Display team members with testimonials
- **Portfolio** - Showcase projects and services

## Project Structure

```
DevSpark/
├── services/                 # Backend API (Node.js + Express)
│   ├── models/                  # Mongoose schemas (Admin, Project, etc.)
│   ├── routes/                  # API endpoints
│   ├── middleware/              # Authentication & middleware
│   ├── server.js                # Express server entry point
│   ├── seed.js                  # Database seeding script
│   ├── package.json
│   └── .env                     # Backend environment variables
│
├── web/                      # Frontend (Next.js 14)
│   ├── app/                     # App Router pages & layouts
│   ├── components/              # Reusable React components
│   │   ├── layout/              # Header, Footer, Navbar
│   │   ├── sections/            # Homepage sections
│   │   └── ui/                  # UI components (Button, Modal, etc.)
│   ├── lib/                     # Utilities & API client
│   ├── styles/                  # Global CSS
│   ├── public/                  # Static assets
│   ├── package.json
│   └── .env.local               # Frontend environment variables
│
└── README.md                    # This file
```

## Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn** package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DevSpark.git
   cd DevSpark
   ```

2. **Install Backend Dependencies**
   ```bash
   cd services
   npm install
   cp .env.example .env
   ```

3. **Configure Backend Environment**
   
   Update `services/.env` with your values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/devspark
   JWT_SECRET=your-super-secret-jwt-key-change-this
   FRONTEND_URL=http://localhost:3000
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../web
   npm install
   cp .env.example .env.local
   ```

5. **Configure Frontend Environment**
   
   Update `web/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

6. **Seed Database** (from services directory)
   ```bash
   cd ../services
   npm run seed
   ```

7. **Start Development Servers**
   
   From the project root, start both services:
   ```bash
   # Terminal 1 - Backend
   cd services
   npm run dev
   
   # Terminal 2 - Frontend
   cd web
   npm run dev
   ```

8. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000/api
   - **Admin Panel**: http://localhost:3000/admin/login

### Default Admin Credentials

> **Important**: Change these credentials in production!

- **Email**: `admin@devspark.com`
- **Password**: `admin123`

## Available Scripts

### Backend Scripts (services/)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend with auto-reload (nodemon) |
| `npm start` | Start backend production server |
| `npm run seed` | Populate database with sample data |

### Frontend Scripts (web/)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Environment Variables

### Backend (services/.env)

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/devspark
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devspark?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-random-secret-key-min-32-chars

# CORS & Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend (web/.env.local)

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **Database**: MongoDB 7+ with Mongoose 8
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **CORS**: cors middleware
- **Dev Tools**: Nodemon for auto-reload

### Frontend
- **Framework**: Next.js 14 (App Router)
- **React**: 18.3+
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11
- **Icons**: Lucide React & Heroicons
- **UI Components**: Headless UI
- **Notifications**: React Hot Toast
- **Utilities**: clsx for className management

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/verify` - Verify JWT token

### Content Management
- `GET /projects` - Get all projects
- `GET /services` - Get all services
- `GET /team` - Get team members
- `GET /testimonials` - Get testimonials

### Admin Dashboard
- `GET /dashboard/stats` - Get dashboard statistics
- `POST /contact/messages` - Submit contact form
- `GET /contact/messages` - Get all messages (admin only)

## Component Overview

### Pages
- `home` - Landing page with hero, features, CTA
- `about` - About the agency
- `services` - Services showcase
- `projects` - Portfolio/projects
- `team` - Team members
- `testimonials` - Client testimonials
- `contact` - Contact form
- `privacy` - Privacy policy
- `terms` - Terms of service
- `admin` - Admin dashboard

### Reusable Components
- **Layout**: Navbar, Footer, MainLayoutWrapper
- **UI**: Button, Card, Badge, Input, Modal, Loading
- **Sections**: HomeSections with reusable content blocks

## 🗄️ Database Models

- **Admin** - Admin user credentials
- **Project** - Portfolio projects
- **Service** - Services offered
- **TeamMember** - Team member profiles
- **Testimonial** - Client testimonials
- **ContactMessage** - Contact form submissions

## Deployment

### Deploy Backend
- **Heroku**: `heroku create && git push heroku main`
- **Railway**: Connect GitHub repo to Railway
- **Render**: Use render.com web services

### Deploy Frontend
- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: Connect GitHub repo to Netlify

### Environment Variables for Production
Update environment variables in your hosting platform dashboard before deploying.

## Security Best Practices

- Change default admin credentials immediately
- Use strong, unique JWT_SECRET in production
- Enable HTTPS on production servers
- Use environment variables (never commit .env)
- Validate and sanitize all user inputs
- Enable CORS only for trusted domains
- Regular database backups
- Keep dependencies updated

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, email support@devspark.com or open an issue on GitHub.

---

**Built with ❤️ by DevSpark Team**
