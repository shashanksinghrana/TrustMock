# TrustMock

A full-stack monorepo with microservices architecture supporting Java, React, and Python.

## Quick Start

### Full Development Environment
```bash
# Backend
./gradlew runBackend
# http://localhost:8080/api/health

# Frontend (separate terminal)
cd apps/frontend
npm install && npm run dev
# http://localhost:5173
```

## Monorepo Structure
```
TrustMock/
├── services/
│   ├── backend/      # Spring Boot API (Java 21)
│   └── ai-service/   # Python AI/ML service (future)
├── apps/
│   └── frontend/     # React + TypeScript + Vite
├── docs/            # Documentation
└── shared/          # Shared utilities (future)
```

## Development Commands
```bash
./gradlew buildAll    # Build all services
./gradlew runBackend  # Run backend service
./gradlew clean       # Clean all services
```

## APIs
- POST /api/mock/upsert  { app, service, pin, payload, version }
- GET  /api/mock/latest?app=&service=&pin=
- POST /api/admin/toggle { app, service, enabled }
- GET  /api/admin/stats