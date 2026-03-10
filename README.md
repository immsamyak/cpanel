# ServerPanel — Modern Server Management Platform

A modern, production-ready server management platform similar to cPanel, Plesk, or CloudPanel. Built with **NestJS**, **Next.js**, **TailwindCSS**, **PostgreSQL**, **Redis**, and **Docker**.

## 🏗️ Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Frontend       │◄───►│   Backend API    │◄───►│   Server Agent   │
│   (Next.js)      │     │   (NestJS)       │     │   (Express)      │
│   Port 3000      │     │   Port 3001      │     │   Port 3002      │
└──────────────────┘     └──────────┬───────┘     └──────────────────┘
                                    │
                         ┌──────────┴───────┐
                         │  PostgreSQL  Redis│
                         │  Port 5432  6379  │
                         └──────────────────┘
```

## ✨ Features

| Module | Capabilities |
|--------|-------------|
| **Authentication** | JWT tokens, refresh tokens, 2FA (TOTP), RBAC |
| **Server Management** | Register servers, monitor metrics, restart services |
| **Domain Management** | Create domains/subdomains, Nginx vhost config, reverse proxy |
| **SSL Certificates** | Let's Encrypt integration, auto-renewal, manual upload |
| **Database Management** | Create MySQL/PostgreSQL databases, user management |
| **File Manager** | Browse, upload, download, rename, delete, chmod |
| **Deployments** | Node.js, Laravel, static sites, Docker containers |
| **Backups** | Manual & scheduled backups, S3 storage, restore |
| **Monitoring** | CPU, RAM, disk, network graphs, Prometheus metrics |
| **Logs** | System, Nginx, application logs with terminal viewer |
| **Security** | Firewall rules, IP allow/block, Fail2ban integration |
| **Job Queue** | BullMQ workers for SSL renewal, backups, deployments |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)

### Development Setup

```bash
# Clone and install
cd cPanel
cp .env.example .env

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd agent && npm install && cd ..

# Start services (PostgreSQL + Redis)
docker compose up postgres redis -d

# Start backend
cd backend && npm run start:dev

# Start frontend (new terminal)
cd frontend && npm run dev

# Start agent (new terminal)
cd agent && npm run start:dev
```

### Docker Deployment

```bash
# Build and start everything
docker compose up --build -d

# Access the platform
open http://localhost
```

## 📁 Project Structure

```
cPanel/
├── backend/                  # NestJS API
│   └── src/
│       ├── entities/         # TypeORM entities (9 tables)
│       └── modules/          # Feature modules (13)
│           ├── auth/         # JWT, 2FA, guards, decorators
│           ├── users/        # User CRUD, RBAC
│           ├── servers/      # Server management, metrics
│           ├── domains/      # Domain & Nginx config
│           ├── ssl/          # Certificate management
│           ├── databases/    # MySQL/PostgreSQL management
│           ├── files/        # File operations proxy
│           ├── deployments/  # App deployment lifecycle
│           ├── backups/      # Backup create/restore
│           ├── monitoring/   # Metrics & Prometheus
│           ├── logs/         # Log streaming
│           ├── security/     # Firewall & Fail2ban
│           └── jobs/         # BullMQ job workers
├── frontend/                 # Next.js Dashboard
│   └── src/
│       ├── app/
│       │   ├── login/       # Auth pages
│       │   ├── register/
│       │   └── dashboard/   # 12 dashboard pages
│       └── lib/
│           └── api.ts       # API client with JWT interceptors
├── agent/                    # Server Agent
│   └── src/
│       ├── modules/          # System modules (7)
│       └── middleware/       # Token auth
├── docker/                   # Dockerfiles & Nginx
└── docker-compose.yml
```

## 🔒 API Documentation

After starting the backend, access the interactive Swagger docs at:
```
http://localhost:3001/docs
```

## 📖 Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [API Reference](docs/API.md)

## 🛠️ Tech Stack

- **Backend**: NestJS, TypeORM, PostgreSQL, BullMQ, Redis
- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Agent**: Express, TypeScript
- **Infrastructure**: Docker, Nginx, Let's Encrypt
- **Auth**: JWT, Passport, TOTP 2FA
- **Monitoring**: Prometheus-compatible metrics endpoint
# cpanel
# cpanel
# cpanel
# cpanel
# cpanel
# cpanel
# cpanel
