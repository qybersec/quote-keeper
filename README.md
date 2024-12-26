# Quote Keeper - MERN Stack Project

A full-stack application for managing and displaying quotes, built with the MERN stack.

## Features

- User Authentication (Email & Password)
- Public Quote Viewing
- Protected Quote Management (CRUD operations)
- Responsive Material-UI Design
- JWT Token Authentication
- MongoDB Database

## Tech Stack

- MongoDB: Database
- Express: Backend Framework
- React: Frontend Library
- Node.js: Runtime Environment
- Material-UI: UI Components
- JWT: Authentication

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
4. Start the servers:
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

### Quotes
- GET `/api/quotes` - Get all quotes (public)
- POST `/api/quotes` - Add new quote (protected)
- DELETE `/api/quotes/:id` - Delete quote (protected)

## Project Structure 