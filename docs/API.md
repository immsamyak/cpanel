# API Reference

Base URL: `http://localhost:3001`

All protected endpoints require `Authorization: Bearer <token>` header.

---

## Authentication

### POST /auth/register
Register a new user account.
```json
{
  "email": "user@example.com",
  "password": "StrongPass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### POST /auth/login
Login with email and password.
```json
{ "email": "user@example.com", "password": "StrongPass123!" }
```
**Response**: `{ accessToken, refreshToken, user }` or `{ requiresTwoFactor: true, userId }`

### POST /auth/verify-2fa
```json
{ "userId": "uuid", "code": "123456" }
```

### POST /auth/enable-2fa 🔒
Returns QR code and secret for TOTP setup.

### POST /auth/confirm-2fa 🔒
```json
{ "code": "123456" }
```

### POST /auth/refresh
```json
{ "refreshToken": "..." }
```

---

## Users 🔒

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /users | List all users | Admin |
| GET | /users/me | Get current user | User |
| PATCH | /users/:id/role | Change user role | Admin |
| PATCH | /users/:id/toggle-active | Toggle active status | Admin |
| DELETE | /users/:id | Delete user | Admin |

---

## Servers 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /servers | Register a new server |
| GET | /servers | List all servers |
| GET | /servers/:id | Get server details |
| PATCH | /servers/:id | Update server |
| DELETE | /servers/:id | Remove server |
| GET | /servers/:id/metrics | Get metrics history |
| GET | /servers/:id/stats | Get latest stats |

---

## Domains 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /domains | Create domain |
| GET | /domains | List domains |
| GET | /domains/:id | Get domain details |
| PATCH | /domains/:id | Update domain |
| PATCH | /domains/:id/toggle | Toggle active/inactive |
| DELETE | /domains/:id | Delete domain |

---

## SSL Certificates 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /ssl/request | Request Let's Encrypt certificate |
| POST | /ssl/upload | Upload custom certificate |
| GET | /ssl | List certificates |
| GET | /ssl/:id | Get certificate details |
| POST | /ssl/:id/renew | Renew certificate |
| DELETE | /ssl/:id | Delete certificate |

---

## Databases 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /databases | Create database |
| GET | /databases | List databases |
| GET | /databases/:id | Get database details |
| PATCH | /databases/:id | Update database |
| DELETE | /databases/:id | Delete database |

---

## Deployments 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /deployments | Create deployment |
| GET | /deployments | List deployments |
| GET | /deployments/:id | Get deployment details |
| PATCH | /deployments/:id | Update deployment |
| POST | /deployments/:id/stop | Stop deployment |
| POST | /deployments/:id/restart | Restart deployment |
| DELETE | /deployments/:id | Delete deployment |

---

## Backups 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /backups | Create backup |
| GET | /backups | List backups |
| GET | /backups/:id | Get backup details |
| POST | /backups/:id/restore | Restore backup |
| DELETE | /backups/:id | Delete backup |

---

## Monitoring 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /monitoring/dashboard | Dashboard overview stats |
| GET | /monitoring/servers/:id/metrics | Metrics history |
| GET | /monitoring/servers/:id/realtime | Real-time metrics |
| GET | /monitoring/servers/:id/prometheus | Prometheus format |

---

## Logs 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /logs/:serverId/system | System logs |
| GET | /logs/:serverId/nginx/access | Nginx access logs |
| GET | /logs/:serverId/nginx/error | Nginx error logs |
| GET | /logs/:serverId/app/:appName | Application logs |

---

## Security 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /security/firewall | Create firewall rule |
| GET | /security/firewall | List firewall rules |
| PATCH | /security/firewall/:id/toggle | Toggle rule |
| DELETE | /security/firewall/:id | Delete rule |
| GET | /security/fail2ban/:serverId | Fail2ban status |

---

## Files 🔒

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /files/browse | Browse directory |
| GET | /files/read | Read file contents |
| POST | /files/write | Write file |
| POST | /files/mkdir | Create directory |
| DELETE | /files | Delete file/directory |
| POST | /files/rename | Rename |
| POST | /files/chmod | Change permissions |
