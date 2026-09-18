# 🚀 DevSpark - Modern Full Stack Agency Website

![DevSpark](https://img.shields.io/badge/DevSpark-v1.0.0-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![MySQL](https://img.shields.io/badge/MySQL-8+-blue?style=for-the-badge&logo=mysql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-blue?style=for-the-badge&logo=tailwind-css)

A stunning, production-ready full-stack website for a software development agency. Built with modern technologies, featuring a powerful MySQL REST API backend and a beautiful responsive Next.js frontend with direct MySQL image storage.

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful responsive design with Tailwind CSS
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🔐 **Secure Admin Panel** - JWT authentication and role-based access control
- 🗄️ **MySQL Integration** - High-performance relational database with connection pooling and automated schema setup
- 🖼️ **Direct MySQL Image Store** - Binary image storage via `LONGBLOB` with optimized caching and streaming endpoints
- ⚡ **Fast Performance** - Next.js 14 with optimized production builds
- 🎭 **Smooth Animations** - Framer Motion for delightful interactions
- 🔔 **Toast Notifications** - React Hot Toast for user feedback
- 🎯 **SEO Optimized** - Meta tags, robots.txt, sitemap.xml
- 📞 **Contact Management** - Collect and manage client inquiries
- 👥 **Team Showcase** - Display team members with testimonials
- 🏆 **Portfolio** - Showcase projects and services

## 📁 Project Structure

```
DevSpark/
├── 📦 services/                 # Backend API (Node.js + Express + MySQL)
│   ├── models/                  # MySQL models (Admin, Project, Image, etc.)
│   ├── routes/                  # API endpoints (including image store)
│   ├── middleware/              # Authentication & middleware
│   ├── db.js                    # MySQL connection pool & table initializer
│   ├── server.js                # Express server entry point
│   ├── seed.js                  # Database seeding script
│   ├── package.json
│   └── .env                     # Backend environment variables
│
├── 🌐 web/                      # Frontend (Next.js 14)
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

## 🚀 Quick Start

### 🐳 Docker Quickstart (Recommended - 1 Command Setup)

Run the complete application stack (MySQL database, Node.js backend API, and Next.js frontend) with Docker:

1. **Start all containers**:
   ```bash
   docker compose up -d --build
   ```

2. **Seed the database** (creates admin user & sample agency data):
   ```bash
   docker compose exec backend npm run seed
   ```

3. **Access the Application**:
   - 🌐 **Frontend**: http://localhost:3000
   - ⚙️ **Backend API**: http://localhost:5000/api
   - 🔐 **Admin Panel**: http://localhost:3000/admin/login

4. **Stop containers**:
   ```bash
   docker compose down
   ```

---

### 💻 Manual Local Setup (Without Docker)

#### Prerequisites

- **Node.js** 18 or higher
- **MySQL** 5.7+ or 8.0+ / MariaDB (via MySQL Server, XAMPP, or Laragon)
- **npm** or **yarn** package manager

#### Installation & Setup

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
   
   Update `services/.env` with your MySQL connection credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=devspark
   JWT_SECRET=your-super-secret-jwt-key-change-this
   FRONTEND_URL=http://localhost:3000
   ```
   *(The backend will automatically create the `devspark` database and all required tables upon starting if they do not exist)*

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
   - 🌐 **Frontend**: http://localhost:3000
   - ⚙️ **Backend API**: http://localhost:5000/api
   - 🔐 **Admin Panel**: http://localhost:3000/admin/login

### 🔑 Default Admin Credentials

> ⚠️ **Important**: Change these credentials in production!

- **Email**: `devsparkhq@gmail.com`
- **Password**: `Devspark@2009!`

## 📜 Available Scripts

### Backend Scripts (services/)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend with auto-reload (nodemon) |
| `npm start` | Start backend production server |
| `npm run seed` | Populate MySQL database with admin and sample data |

### Frontend Scripts (web/)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 🔧 Environment Variables

### Backend (services/.env)

```env
# Server Configuration
PORT=5000

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=devspark

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

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **Database**: MySQL 8+ with `mysql2` connection pooling
- **Image Storage**: MySQL `LONGBLOB` with `multer` memory storage
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

## 📦 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/verify` - Verify JWT token

### Content Management
- `GET /projects` - Get all projects
- `POST /projects` - Create project (admin only)
- `PUT /projects/:id` - Update project (admin only)
- `DELETE /projects/:id` - Delete project (admin only)
- `GET /services` - Get all services
- `GET /team` - Get team members
- `GET /testimonials` - Get testimonials

### Image Storage (MySQL)
- `POST /images/upload` - Upload image file to MySQL LONGBLOB (admin only)
- `GET /images/:id` - Stream binary image with cache headers
- `DELETE /images/:id` - Delete image from MySQL (admin only)

### Admin Dashboard
- `GET /dashboard/stats` - Get dashboard statistics
- `POST /contact` - Submit contact form
- `GET /contact` - Get all messages (admin only)

## 🎨 Component Overview

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

## 🗄️ Database Tables (MySQL)

- **admins** - Admin user credentials and timestamps
- **projects** - Portfolio projects with JSON tech_stack and image references
- **services** - Services offered with icons
- **team_members** - Team profiles with JSON skills and social links
- **testimonials** - Client reviews and ratings
- **contact_messages** - Contact form inquiries
- **images** - Direct binary image blobs (`data LONGBLOB`, filename, mime_type, size)

## 🔒 Security Best Practices

- ✅ Change default admin credentials immediately
- ✅ Use strong, unique JWT_SECRET in production
- ✅ Enable HTTPS on production servers
- ✅ Use environment variables (never commit .env)
- ✅ Validate and sanitize all user inputs
- ✅ Enable CORS only for trusted domains
- ✅ Regular database backups
- ✅ Keep dependencies updated

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ by DevSpark Team**