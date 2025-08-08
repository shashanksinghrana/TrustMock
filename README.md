# TrustMock

A full-stack mock service application with Spring Boot backend and React frontend.

## Quick Start

### Backend (Java/Spring Boot)
```bash
cd backend
./gradlew bootRun
# http://localhost:8080/api/health
```

### Frontend (React/TypeScript)
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

## Project Structure
```
TrustMock/
├── backend/          # Spring Boot API (Java 21)
├── frontend/         # React + TypeScript + Vite
└── docs/            # Documentation
```

## APIs
- POST /api/mock/upsert  { app, service, pin, payload, version }
- GET  /api/mock/latest?app=&service=&pin=
- POST /api/admin/toggle { app, service, enabled }
- GET  /api/admin/stats