# NestIQ

NestIQ is a full-stack real estate marketplace built with the MERN stack. It allows buyers to browse and save properties, contact agents, schedule visits, and manage their activity from a buyer dashboard. Sellers and agents can create listings with Cloudinary image uploads, manage their properties, and respond to inquiries and visits. Admin users can monitor platform stats, manage users, and moderate listings.

## Features

- Public homepage with property search
- Property listing page with filters, sorting, grid/list/map views
- Property detail page with image gallery and agent information
- Buyer authentication with JWT
- Buyer dashboard
- Saved properties
- Contact Agent inquiry flow
- Schedule Visit flow
- Seller/agent dashboard
- Add property wizard
- Cloudinary property image upload
- Seller inquiry and visit management
- Admin panel
- Platform stats
- User management
- Listing moderation
- Role-based protected routes
- MongoDB-backed REST API

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- TanStack React Query
- Zustand
- Axios
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- Multer
- Cloudinary
- Streamifier
- Cookie Parser
- Helmet
- Morgan
- Express Rate Limit

## Folder Structure

```txt
NESTIQ/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── AdminPanel/
│   │   │   ├── Dashboard/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Properties/
│   │   │   ├── PropertyDetail/
│   │   │   ├── Register/
│   │   │   └── SellerDashboard/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── utils/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
```

## Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB Community Server or MongoDB Compass
- VS Code
- A Cloudinary account

Recommended versions:

```txt
Node.js: 18+
npm: 9+
MongoDB: 6+
```

## Local Setup Instructions

Open the project folder in VS Code:

```bash
cd C:\Users\yuvra\OneDrive\Desktop\NESTIQ
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

## Environment Variables

Do not commit `.env` files to GitHub. They contain secrets and should stay local.

Create this file:

```txt
server/.env
```

Use this template:

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/nestiq
JWT_ACCESS_SECRET=change_this_access_secret
JWT_REFRESH_SECRET=change_this_refresh_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create this file:

```txt
client/.env
```

Use this template:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## server/.env.example

```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/nestiq
JWT_ACCESS_SECRET=change_this_access_secret
JWT_REFRESH_SECRET=change_this_refresh_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## client/.env.example

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## How To Run Backend

From the `server` folder:

```bash
cd server
npm run dev
```

Or run without nodemon:

```bash
npm start
```

Backend runs at:

```txt
http://localhost:4000
```

Health check:

```txt
http://localhost:4000/api/health
```

## How To Run Frontend

From the `client` folder:

```bash
cd client
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

## How To Seed Database

Make sure MongoDB is running locally.

From the `server` folder:

```bash
cd server
npm run seed
```

This creates demo users and sample property data.

## Demo Accounts

### Admin

```txt
Email: admin@nestiq.com
Password: Demo@1234
```

### Buyer

```txt
Email: buyer@nestiq.com
Password: Demo@1234
```

### Seller

```txt
Email: rohan.seller@nestiq.com
Password: Demo@1234
```

### Agent

```txt
Email: priya.agent@nestiq.com
Password: Demo@1234
```

## API Routes Summary

Base URL:

```txt
http://localhost:4000/api
```

### Auth Routes

```txt
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
GET    /auth/me
```

### User Routes

```txt
GET    /users/profile
GET    /users/saved-properties
GET    /users/me/listings
```

### Property Routes

```txt
GET    /properties
GET    /properties/search
GET    /properties/:id
POST   /properties
PUT    /properties/:id
DELETE /properties/:id
POST   /properties/:id/save
```

### Inquiry Routes

```txt
POST   /inquiries
GET    /inquiries/mine
PATCH  /inquiries/:id/status
```

### Visit Routes

```txt
POST   /visits
GET    /visits
PATCH  /visits/:id/status
```

### Upload Routes

```txt
POST   /uploads/property-images
```

Form field name:

```txt
images
```

### Admin Routes

```txt
GET    /admin/stats
GET    /admin/users
PATCH  /admin/users/:id
DELETE /admin/users/:id
GET    /admin/properties
PATCH  /admin/properties/:id/approve
PATCH  /admin/properties/:id/reject
PATCH  /admin/properties/:id/status
```

## Cloudinary Setup

1. Create a Cloudinary account.
2. Open your Cloudinary dashboard.
3. Copy:
   - Cloud name
   - API key
   - API secret
4. Add them to `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

5. Restart the backend.

Uploaded property images are stored in:

```txt
nestiq/properties
```

Upload limits:

```txt
Max files: 15
Max size per file: 5MB
Allowed types: jpg, jpeg, png, webp
```

## Common Errors And Fixes

### Backend says MongoDB connection error

Make sure MongoDB is running.

Check:

```env
MONGO_URI=mongodb://127.0.0.1:27017/nestiq
```

### Frontend cannot connect to backend

Check `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Restart the Vite dev server after changing `.env`.

### CORS error

Check `server/.env`:

```env
CLIENT_URL=http://localhost:5173
```

Restart backend.

### Cloudinary upload returns 500

Check that these are filled in `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Do not leave them blank.

Restart backend after changing them.

### 401 Unauthorized

You are not logged in, or your token expired. Log in again.

### 403 Forbidden

Your account role does not have permission for that action.

Examples:

- Buyer cannot create listings.
- Buyer cannot access admin routes.
- Non-admin users cannot manage all users.

### Property image upload says unsupported file type

Use only:

```txt
jpg, jpeg, png, webp
```

### Property image upload says file too large

Each image must be 5MB or smaller.

### Port already in use

Backend default:

```txt
4000
```

Frontend default:

```txt
5173
```

Stop the old process or change the port.

## Build Commands

### Frontend Build

From `client`:

```bash
npm run build
```

### Frontend Preview

From `client`:

```bash
npm run preview
```

### Frontend Lint

From `client`:

```bash
npm run lint
```

### Backend Start

From `server`:

```bash
npm start
```

### Backend Dev

From `server`:

```bash
npm run dev
```

## Known Limitations

- No deployment setup yet.
- No payment integration.
- No real-time chat.
- No email notifications.
- No Cloudinary delete cleanup when removing uploaded images before publishing.
- Map behavior depends on available property coordinates.
- Search is basic and not full-text indexed.
- Access tokens are stored in localStorage for this demo project.
- Some admin actions are intentionally simple and can be expanded later.

## Future Improvements

- Production deployment for frontend and backend
- Cloudinary image delete cleanup
- Email notifications for inquiries and visits
- Real-time chat between buyers and agents
- Advanced property analytics
- Full-text search with MongoDB Atlas Search
- Pagination and server-side filtering improvements
- Better map clustering
- Property comparison detail page
- Agent public profile pages
- Review and rating workflow
- Password reset flow
- Email verification
- Production-grade refresh token rotation
- Automated test suite with Jest, Supertest, and Playwright
