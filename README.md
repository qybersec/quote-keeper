# Quote Keeper - MERN Stack Project

A full-stack application for managing and displaying quotes, built with the MERN stack.

## Features

- User Authentication (Email & Password)
- Public Quote Viewing
- Protected Quote Management (CRUD operations)
- Responsive Material-UI Design
- JWT Token Authentication
- MongoDB Database
- Dark/Light Theme Toggle
- Profile Management
- Quote Favorites System

## Tech Stack

- MongoDB: Database
- Express: Backend Framework
- React: Frontend Library
- Node.js: Runtime Environment
- Material-UI: UI Components
- JWT: Authentication
- Framer Motion: Animations

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```
3. Create `.env` file in backend directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Set up MongoDB:
   - Create free account on MongoDB Atlas
   - Create new cluster
   - Get connection string and add to .env
   - Add IP address to whitelist
5. Start the servers:
   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- PUT `/api/auth/profile` - Update user profile
- PUT `/api/auth/password` - Update password

### Quotes
- GET `/api/quotes` - Get all quotes (public)
- GET `/api/quotes/my-quotes` - Get user's quotes (protected)
- POST `/api/quotes` - Add new quote (protected)
- PUT `/api/quotes/:id` - Update quote (protected)
- DELETE `/api/quotes/:id` - Delete quote (protected)
- PATCH `/api/quotes/:id/favorite` - Toggle favorite (protected)

## Project Structure 

## Deployment

### Backend
- Ensure environment variables are set
- Configure MongoDB Atlas network access
- Deploy to platform of choice (Heroku, Railway, etc.)

### Frontend
- Update API base URL for production
- Build the project: `npm run build`
- Deploy to static hosting (Vercel, Netlify, etc.)

## Screenshots

[Add screenshots of key features here] 