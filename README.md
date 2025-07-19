# CollabFlow Backend

A collaboration tool for project management built with NestJS, TypeORM, and PostgreSQL.

## Features

- **User Management**: Role-based access control (Admin/User)
- **Project Management**: CRUD operations for projects
- **Task Management**: CRUD operations for tasks with status tracking
- **Dashboard**: Analytics and statistics
- **Authentication**: JWT-based authentication
- **Soft Delete**: All entities support soft deletion

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd collabflow_backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:


Edit the `.env` file with your database credentials and JWT secret.

4. Create the PostgreSQL database:
```sql
CREATE DATABASE collabflow;
```

5. Run the application:
```bash
npm run start:dev

npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Users (Admin only)
- `GET /users` - Get all users (paginated)
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user

### Projects
- `GET /projects` - Get all projects (paginated)
- `POST /projects` - Create a new project
- `GET /projects/:id` - Get project by ID with tasks
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Soft delete project

### Tasks
- `GET /tasks` - Get tasks (role-based: admin sees all, users see assigned)
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get task by ID
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Soft delete task
- `GET /tasks/project/:projectId` - Get all tasks for a project

### Dashboard
- `GET /dashboard/stats` - Get task statistics by status
- `GET /dashboard/tasks-over-time` - Get tasks created over time
- `GET /dashboard/project-stats` - Get project completion statistics

## Role-Based Access Control

### Admin
- Can create, read, update, delete users
- Can see all tasks across all users
- Can manage all projects and tasks
- Full access to all dashboard statistics

### User
- Can only see tasks assigned to them in the tasks page
- Can see all tasks in projects when viewing project details
- Can manage their assigned tasks
- Dashboard statistics filtered to their assigned tasks

## Task Status Flow

1. **Backlog** - Initial status for new tasks
2. **Todo** - Tasks ready to be worked on
3. **In Progress** - Tasks currently being worked on
4. **Review** - Tasks ready for review
5. **Done** - Completed tasks

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | password |
| `DB_NAME` | Database name | collabflow |
| `JWT_SECRET` | JWT signing secret | - |
| `NODE_ENV` | Environment | development |
| `PORT` | Application port | 3000 |

## Development

```bash
# Run in development mode
npm run start:dev

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

## Database Migrations

The application uses TypeORM's synchronize feature in development. For production, you should use migrations:

```bash
# Generate migration
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```
