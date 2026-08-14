# AbleSpace Task Management System

A full-stack task and project management application.

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend
- NestJS
- TypeScript
- TypeORM
- SQLite
- Class Validator

### Authentication
- Guest Login
- Google OAuth

## Features

### Tasks
- View tasks
- Create tasks
- Edit tasks
- Delete tasks
- Task details page
- Update task priority, status and other details
- Search tasks
- Persistent task data using the backend database

### Projects
- View projects
- Create projects
- Edit projects
- Delete projects
- Project details page
- Update project information
- Persistent project data using the backend database

### User Profile
- Guest profile
- Google account profile
- Google profile picture
- Google email
- Google name
- Editable username
- Theme selection
- Color mode selection

### Theme
- Light theme
- Dark theme
- Theme preference persists after refresh

## Project Structure

```text
ablespace-task-management/
│
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   ├── projects/
│   │   ├── settings/
│   │   ├── tasks/
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── projects/
│   │   ├── settings/
│   │   └── tasks/
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   └── package.json
│
└── README.md