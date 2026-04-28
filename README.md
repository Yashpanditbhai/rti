# RTI Management System

A full-stack web application for managing Right to Information (RTI) applications. Built with React, Node.js, Express, and MongoDB.

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS 4, React Router, Axios, Lucide Icons, React Hot Toast

**Backend:** Node.js, Express, MongoDB, Mongoose, Multer, Zod, Swagger

## Project Structure

```
rti-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Validation, error handling, file upload
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions (with Swagger docs)
│   ├── uploads/         # Uploaded files storage
│   ├── .env             # Environment variables
│   ├── server.js        # App entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios API layer
│   │   ├── components/  # Reusable UI components
│   │   │   ├── Layout/  # Sidebar, Header, Layout
│   │   │   ├── RTI/     # StatusBadge, FileUpload
│   │   │   └── ui/      # Pagination, ConfirmModal
│   │   └── pages/       # Page components
│   ├── vite.config.js
│   └── package.json
├── package.json         # Root scripts
└── README.md
```

## Prerequisites

- **Node.js** >= 18
- **MongoDB** running locally on port 27017 (or update `.env`)
- **npm** >= 9

## Quick Start

### 1. Install all dependencies

```bash
npm run install:all
```

### 2. Configure environment

Edit `backend/.env` if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rti_system
UPLOAD_DIR=uploads
```

### 3. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Run the application

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000) concurrently.

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/rti
- **Swagger Docs:** http://localhost:5000/api-docs

## API Endpoints

| Method | Endpoint       | Description                          |
|--------|---------------|--------------------------------------|
| POST   | /api/rti      | Create a new RTI application         |
| GET    | /api/rti      | Get all RTIs (pagination + filters)  |
| GET    | /api/rti/:id  | Get a single RTI by ID               |
| PUT    | /api/rti/:id  | Update an RTI application            |
| DELETE | /api/rti/:id  | Delete an RTI application            |

### Query Parameters (GET /api/rti)

| Param      | Type   | Description                          |
|-----------|--------|--------------------------------------|
| page      | number | Page number (default: 1)             |
| limit     | number | Items per page (default: 10)         |
| status    | string | Filter: Pending/Verified/Rejected/Draft |
| department| string | Filter by department                 |
| search    | string | Search by applicant name or case number |
| startDate | string | Filter by start date (YYYY-MM-DD)    |
| endDate   | string | Filter by end date (YYYY-MM-DD)      |

## Features

- Full CRUD for RTI applications
- Pagination, filtering, and search
- File upload (drag & drop) for documents
- Form validation (frontend + backend with Zod)
- Status management (Pending, Verified, Rejected, Draft)
- Auto-generated RTI case numbers
- Responsive admin UI with sidebar navigation
- Swagger API documentation
- Toast notifications for user feedback
