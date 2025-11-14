# Backend Construction Guideline - Task Management CRUD API

This guide will help you build a Node.js backend with PostgreSQL for task management, all managed with Docker Compose.

## Architecture Overview

```
sadbits/
├── frontend/ (your existing React app)
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
└── .env
```

---

## Step 1: Create Backend Directory Structure

```bash
# From your project root
mkdir -p backend/src/{config,controllers,models,routes,middleware}
```

---

## Step 2: Initialize Backend Package

```bash
cd backend
pnpm init
```

### Install Dependencies

```bash
# Core dependencies
pnpm add express cors dotenv pg

# TypeScript and dev dependencies
pnpm add -D typescript @types/node @types/express @types/cors @types/pg ts-node nodemon

# Optional: ORM (choose one)
pnpm add typeorm reflect-metadata  # OR
pnpm add prisma @prisma/client     # OR
pnpm add drizzle-orm drizzle-kit   # (recommended - modern, lightweight)
```

---

## Step 3: Configure TypeScript

Create `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Step 4: Setup Package.json Scripts

Update `backend/package.json`:

```json
{
  "name": "sadbits-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg"
  }
}
```

---

## Step 5: Database Configuration

Create `backend/src/config/database.ts`:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'sadbits_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

export default pool;
```

---

## Step 6: Create Task Model

Create `backend/src/models/task.model.ts`:

```typescript
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  due_date?: Date;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  due_date?: Date;
}
```

---

## Step 7: Create Task Controller

Create `backend/src/controllers/task.controller.ts`:

```typescript
import { Request, Response } from 'express';
import pool from '../config/database';
import { CreateTaskDTO, UpdateTaskDTO } from '../models/task.model';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status = 'todo', priority = 'medium', due_date }: CreateTaskDTO = req.body;

    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, status, priority, due_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdateTaskDTO = req.body;

    const fields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [id, ...Object.values(updates)];

    const result = await pool.query(
      `UPDATE tasks SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
```

---

## Step 8: Create Routes

Create `backend/src/routes/task.routes.ts`:

```typescript
import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller';

const router = Router();

router.get('/tasks', getAllTasks);
router.get('/tasks/:id', getTaskById);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

export default router;
```

---

## Step 9: Create Main Server File

Create `backend/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', taskRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## Step 10: Create Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build TypeScript
RUN pnpm build

EXPOSE 3001

CMD ["pnpm", "start"]
```

---

## Step 11: Create Docker Compose Configuration

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: sadbits-postgres
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-sadbits_db}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: sadbits-backend
    restart: always
    ports:
      - '3001:3001'
    environment:
      NODE_ENV: production
      PORT: 3001
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${DB_NAME:-sadbits_db}
      DB_USER: ${DB_USER:-postgres}
      DB_PASSWORD: ${DB_PASSWORD:-postgres}
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

---

## Step 12: Create Database Initialization Script

Create `backend/init.sql`:

```sql
-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for faster queries
CREATE INDEX idx_tasks_status ON tasks(status);

-- Create index on due_date
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Sample data (optional)
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
  ('Setup project', 'Initialize the project structure', 'done', 'high', NOW() + INTERVAL '7 days'),
  ('Build API', 'Create REST API endpoints', 'in_progress', 'high', NOW() + INTERVAL '14 days'),
  ('Write tests', 'Add unit and integration tests', 'todo', 'medium', NOW() + INTERVAL '21 days');
```

---

## Step 13: Update Root .env File

Update `.env` in project root:

```env
# Frontend
VITE_PAGE_TITLE="Albert's solo"
VITE_API_URL=http://localhost:3001/api

# Backend
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sadbits_db
DB_USER=postgres
DB_PASSWORD=postgres
```

---

## Step 14: Run the Application

### Development Mode (with hot reload)

```bash
# Start only database
docker-compose up postgres -d

# Run backend in dev mode (from backend directory)
cd backend
pnpm dev

# Run frontend (from root)
pnpm dev
```

### Production Mode (everything in Docker)

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

---

## Step 15: Test the API

### Using curl:

```bash
# Get all tasks
curl http://localhost:3001/api/tasks

# Get task by ID
curl http://localhost:3001/api/tasks/1

# Create task
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Test task","status":"todo","priority":"high"}'

# Update task
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'

# Delete task
curl -X DELETE http://localhost:3001/api/tasks/1
```

### Using Postman or Thunder Client (VSCode extension)

Import these endpoints:
- GET    `http://localhost:3001/api/tasks`
- GET    `http://localhost:3001/api/tasks/:id`
- POST   `http://localhost:3001/api/tasks`
- PUT    `http://localhost:3001/api/tasks/:id`
- DELETE `http://localhost:3001/api/tasks/:id`

---

## Step 16: Connect Frontend to Backend

Create `src/services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export const taskApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await fetch(`${API_URL}/tasks`);
    return response.json();
  },

  getById: async (id: number): Promise<Task> => {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    return response.json();
  },

  create: async (task: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return response.json();
  },

  update: async (id: number, task: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
```

---

## Step 17: Useful Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Restart specific service
docker-compose restart backend

# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d sadbits_db

# Access backend container shell
docker-compose exec backend sh

# Remove everything and start fresh
docker-compose down -v
docker-compose up --build
```

---

## Optional Enhancements

### 1. Add Validation Middleware

Create `backend/src/middleware/validation.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
  const { title } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }

  if (title.length > 255) {
    return res.status(400).json({ error: 'Title too long' });
  }

  next();
};
```

### 2. Add Error Handling Middleware

Create `backend/src/middleware/errorHandler.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
```

### 3. Add Logger

```bash
pnpm add winston
```

### 4. Add API Documentation

```bash
pnpm add swagger-ui-express swagger-jsdoc @types/swagger-ui-express @types/swagger-jsdoc
```

---

## Troubleshooting

### Database connection issues:
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U postgres -d sadbits_db -c "SELECT 1"
```

### Backend not starting:
```bash
# Check backend logs
docker-compose logs backend

# Rebuild backend
docker-compose build backend
docker-compose up backend
```

### Port conflicts:
```bash
# Check what's using port 5432
lsof -i :5432

# Check what's using port 3001
lsof -i :3001
```

---

## Next Steps

1. ✅ Set up authentication (JWT)
2. ✅ Add user management
3. ✅ Add task categories/tags
4. ✅ Add file attachments
5. ✅ Add real-time updates (WebSockets)
6. ✅ Add caching (Redis)
7. ✅ Add search functionality
8. ✅ Deploy to production

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

Good luck with your backend setup! 🚀
