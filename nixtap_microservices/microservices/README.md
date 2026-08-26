# NIXTAP — Microservices Architecture

## Services

| Service | Port | DB | Responsibility |
|---------|------|----|----------------|
| api-gateway | 8080 | — | JWT validation, routing |
| auth-service | 8081 | nixtap_auth_db | Register, login, JWT issuance |
| card-service | 8082 | nixtap_card_db | Cards, templates, social links |
| engagement-service | 8083 | nixtap_engagement_db | Leads, appointments, feedback |
| analytics-service | 8084 | nixtap_analytics_db | Views, shares, analytics |

## Quick Start (Local — without Docker)

### 1. Create all 4 databases
```bash
mysql -u root -p < database/01_auth_db.sql
mysql -u root -p < database/02_card_db.sql
mysql -u root -p < database/03_engagement_db.sql
mysql -u root -p < database/04_analytics_db.sql
```

### 2. Start each service in STS (in order)
```
1. auth-service      → Run As → Spring Boot App (port 8081)
2. card-service      → Run As → Spring Boot App (port 8082)
3. engagement-service → Run As → Spring Boot App (port 8083)
4. analytics-service  → Run As → Spring Boot App (port 8084)
5. api-gateway       → Run As → Spring Boot App (port 8080)
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
# Open: http://localhost:5173
```

Frontend hits port 8080 (API Gateway) — same as before, zero changes.

## Quick Start (Docker)

```bash
cd microservices
docker-compose up --build
```

All services + MySQL start automatically.

## API Gateway Routes

| Path | Forwards to |
|------|-------------|
| /api/v1/auth/** | auth-service:8081 |
| /api/v1/public/cards/** | card-service:8082 |
| /api/v1/cards/** | card-service:8082 |
| /api/v1/public/cards/*/leads | engagement-service:8083 |
| /api/v1/public/cards/*/appointments | engagement-service:8083 |
| /api/v1/public/cards/*/feedback | engagement-service:8083 |
| /api/v1/cards/*/leads/** | engagement-service:8083 |
| /api/v1/cards/*/appointments/** | engagement-service:8083 |
| /api/v1/cards/*/feedback/** | engagement-service:8083 |
| /api/v1/public/cards/*/views | analytics-service:8084 |
| /api/v1/public/cards/*/shares | analytics-service:8084 |
| /api/v1/cards/*/analytics/** | analytics-service:8084 |

## Security Design

- JWT is **issued** by auth-service only
- JWT is **validated** by api-gateway only
- Downstream services trust `X-User-Id` and `X-User-Role` headers
  injected by the gateway — they never see the raw JWT
- No shared DB — each service owns its data

## Inter-Service Communication

```
card-service needs to verify userId exists →
  GET http://auth-service:8081/api/v1/internal/users/{id}

engagement-service needs to verify cardId exists →
  GET http://card-service:8082/api/v1/internal/cards/{id}
```

These internal endpoints are NOT exposed through the gateway.
