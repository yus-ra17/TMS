# Quick Start Guide

## Prerequisites
- Node.js v18+
- PostgreSQL v14+
- Git

## Setup (5 minutes)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd TMS

# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb tms_db

# Or using psql
psql -U postgres
CREATE DATABASE tms_db;
\q
```

### 3. Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/tms_db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Run Migrations
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 5. Start Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

### 6. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## First Steps

1. **Register**: Create a new account at `/register`
2. **Create Project**: Click "+ New Project" on dashboard
3. **Add Members**: Click "Manage Members" and add users
4. **Create Tasks**: Click "+ New Task" and assign to members
5. **Update Status**: Assigned users can change task status
6. **Filter & Paginate**: Use status filters and pagination controls

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Ensure database exists: `psql -l | grep tms_db`

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`

### Prisma Client Not Generated
```bash
cd backend
npm run prisma:generate
```

### CORS Errors
- Verify `FRONTEND_URL` in `backend/.env` matches frontend URL
- Check browser console for exact error

## Development Tips

- Backend auto-reloads on file changes (ts-node-dev)
- Frontend hot-reloads (Vite HMR)
- Use React Query DevTools (automatically enabled in dev)
- Check backend logs for API errors
- Use browser DevTools Network tab to debug API calls

## Testing Workflow

1. Register 2-3 test users
2. Login as User A, create a project
3. Add User B as member
4. Create tasks and assign to User B
5. Login as User B, update task status
6. Test pagination with 10+ tasks
7. Test status filters (TODO, IN_PROGRESS, DONE)

## Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Need Help?

- Check README.md for detailed documentation
- Review OPTIMIZATION.md for performance details
- Check API endpoints in README.md
- Review Prisma schema in `backend/prisma/schema.prisma`
