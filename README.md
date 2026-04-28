# Project & Task Management System (TMS)

A full-stack task management application built with NestJS, React, TypeScript, PostgreSQL, and TanStack Query.

## Architecture Overview

### Backend (NestJS + PostgreSQL + Prisma)
- **Clean Architecture**: Controllers → Services → Prisma
- **Modules**: Auth, Users, Projects, Tasks
- **Authentication**: JWT-based with Passport
- **Validation**: Zod schemas
- **Database**: PostgreSQL with Prisma ORM

### Frontend (React + TypeScript + TanStack Query)
- **State Management**: Zustand (auth) + TanStack Query (server state)
- **Routing**: React Router v6
- **API Layer**: Axios with interceptors
- **Optimization**: Pagination, keepPreviousData, query caching

## Features

### Authentication
- User registration and login
- JWT token-based authentication
- Protected routes (frontend + backend)

### Project Management
- Create projects
- Add/remove project members
- View all user projects
- Role-based access (OWNER/MEMBER)

### Task Management
- Create tasks under projects
- Assign tasks to project members
- Update task status (TODO, IN_PROGRESS, DONE)
- Delete tasks
- Paginated task listing (10 per page)
- Filter tasks by status

### Business Rules
- Only project members can access project tasks
- Only assigned users can update task status
- Only project owners can manage members
- All inputs validated with Zod

## Tech Stack

### Backend
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod validation
- JWT authentication
- bcryptjs

### Frontend
- React 18
- TypeScript
- TanStack Query (React Query)
- React Router v6
- Zustand
- Axios
- Vite

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create `.env` file in `backend/` directory:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/tms_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

4. Setup database:
```bash
# Create database
createdb tms_db

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. Start backend server:
```bash
npm run start:dev
```

Backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create `.env` file in `frontend/` directory:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start frontend dev server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Database Schema

### User
- id (UUID)
- email (unique)
- name
- password (hashed)

### Project
- id (UUID)
- name
- description (optional)
- createdAt

### ProjectMember
- id (UUID)
- projectId (FK)
- userId (FK)
- role (OWNER/MEMBER)
- joinedAt

### Task
- id (UUID)
- title
- description (optional)
- status (TODO/IN_PROGRESS/DONE)
- projectId (FK)
- assigneeId (FK, optional)
- creatorId (FK)
- createdAt
- updatedAt

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Tasks
- `GET /api/projects/:projectId/tasks` - Get tasks (paginated, filterable)
- `POST /api/projects/:projectId/tasks` - Create task
- `PATCH /api/tasks/:taskId/status` - Update task status
- `PATCH /api/tasks/:taskId/assign` - Assign task
- `DELETE /api/tasks/:taskId` - Delete task

### Users
- `GET /api/users` - Get all users (for assignment)

## Optimization Features

### Backend
- **Pagination**: Tasks endpoint supports page/limit parameters
- **Efficient Queries**: Prisma select to fetch only needed fields
- **Indexed Queries**: Database indexes on foreign keys
- **Transaction Support**: Atomic operations for count + fetch

### Frontend
- **TanStack Query**: Automatic caching and background refetching
- **keepPreviousData**: Smooth pagination without loading flickers
- **Optimistic Updates**: Immediate UI feedback
- **Query Invalidation**: Smart cache invalidation on mutations
- **Stale Time**: 30s stale time to reduce unnecessary refetches

## Code Quality

### Backend
- Clean folder structure by feature modules
- Business logic in services, not controllers
- Reusable Zod validation pipe
- Global Prisma module
- JWT strategy for authentication
- Proper error handling

### Frontend
- Component-based architecture
- Reusable UI components (Spinner, ErrorMessage)
- Custom hooks potential
- Centralized API layer
- Type-safe with TypeScript
- Clean separation of concerns

## Development

### Backend Commands
```bash
npm run start:dev      # Start dev server
npm run build          # Build for production
npm run prisma:migrate # Run database migrations
npm run prisma:generate # Generate Prisma client
```

### Frontend Commands
```bash
npm run dev    # Start dev server
npm run build  # Build for production
npm run preview # Preview production build
```

## Testing the Application

1. Register a new user
2. Create a project (you become the owner)
3. Add members to the project
4. Create tasks and assign them to members
5. Update task status (only if you're assigned)
6. Filter tasks by status
7. Navigate through paginated results

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Frontend route protection
- Token stored in localStorage
- Auto-redirect on 401 errors
- CORS configuration

## Future Enhancements

- Task comments
- File attachments
- Real-time updates (WebSockets)
- Email notifications
- Task due dates
- Project templates
- Advanced filtering
- Search functionality
- User profiles
- Activity logs

## License

MIT
