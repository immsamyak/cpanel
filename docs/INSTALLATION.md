# Installation Guide

## Prerequisites

- **Node.js** 20.x or higher
- **Docker** and **Docker Compose** (for containerized deployment)
- **PostgreSQL** 16+ (or use the Docker container)
- **Redis** 7+ (or use the Docker container)
- **Git**

## Option 1: Docker Deployment (Recommended)

### 1. Clone and Configure

```bash
git clone <repository-url> cPanel
cd cPanel
cp .env.example .env
```

### 2. Edit Environment Variables

Open `.env` and update:
- `JWT_SECRET` — Use a strong, unique secret
- `JWT_REFRESH_SECRET` — Different from JWT_SECRET
- `DB_PASSWORD` — Database password
- `AGENT_SECRET` — Shared secret for agent communication

### 3. Build and Start

```bash
docker compose up --build -d
```

### 4. Access

- **Dashboard**: http://localhost
- **API**: http://localhost/api
- **Swagger Docs**: http://localhost:3001/docs

### 5. Create Admin User

Register via the UI at http://localhost/register, then promote to admin:
```sql
docker exec -it cpanel-postgres psql -U cpanel -d cpanel_db \
  -c "UPDATE users SET role = 'admin' WHERE email = 'your@email.com';"
```

---

## Option 2: Development Setup

### 1. Start Infrastructure Services

```bash
docker compose up postgres redis -d
```

### 2. Install Dependencies

```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd agent && npm install && cd ..
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env — set DB_HOST=localhost, REDIS_HOST=localhost
```

### 4. Start Services

In separate terminals:

```bash
# Terminal 1: Backend API
cd backend && npm run start:dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Agent
cd agent && npm run start:dev
```

### 5. Access

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Swagger**: http://localhost:3001/docs
- **Agent**: http://localhost:3002

---

## Installing the Agent on a Remote Server

### 1. Copy agent files to the target server

```bash
scp -r agent/ user@server:/opt/cpanel-agent
```

### 2. Install and configure

```bash
ssh user@server
cd /opt/cpanel-agent
npm install
npm run build

# Set environment
export AGENT_SECRET=your-shared-secret
export AGENT_PORT=3002
```

### 3. Create systemd service

```bash
sudo tee /etc/systemd/system/cpanel-agent.service <<EOF
[Unit]
Description=ServerPanel Agent
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/cpanel-agent
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10
Environment=AGENT_SECRET=your-shared-secret
Environment=AGENT_PORT=3002

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable cpanel-agent
sudo systemctl start cpanel-agent
```

### 4. Register server in the dashboard

Go to **Servers → Add Server** and enter the server IP and agent port.

---

## SSL Configuration

For production with real SSL:

1. Point your domain's DNS to your server IP
2. Update `docker/nginx/nginx.conf` with your domain
3. Use Certbot: `certbot --nginx -d yourdomain.com`

## Backup Configuration

For S3-compatible backup storage, set these in `.env`:
```
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY=your-key
S3_SECRET_KEY=your-secret
S3_BUCKET=your-bucket
S3_REGION=us-east-1
```
