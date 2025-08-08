# TrustMock Backend (Spring Boot 3, Java 21)

## Run
```bash
./gradlew bootRun
# http://localhost:8080/api/health
```

## APIs
- POST /api/mock/upsert  { app, service, pin, payload, version }
- GET  /api/mock/latest?app=&service=&pin=
- POST /api/admin/toggle { app, service, enabled }
- GET  /api/admin/stats
