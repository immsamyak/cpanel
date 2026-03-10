import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add JWT
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Response interceptor for 401s
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    error.config.headers.Authorization = `Bearer ${data.accessToken}`;
                    return api(error.config);
                } catch {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } else {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth
export const authApi = {
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
    register: (data: any) => api.post('/auth/register', data),
    refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
};

// Servers
export const serversApi = {
    list: () => api.get('/servers'),
    get: (id: string) => api.get(`/servers/${id}`),
    create: (data: any) => api.post('/servers', data),
    update: (id: string, data: any) => api.patch(`/servers/${id}`, data),
    delete: (id: string) => api.delete(`/servers/${id}`),
    metrics: (id: string) => api.get(`/servers/${id}/metrics`),
    stats: (id: string) => api.get(`/servers/${id}/stats`),
};

// Domains
export const domainsApi = {
    list: () => api.get('/domains'),
    get: (id: string) => api.get(`/domains/${id}`),
    create: (data: any) => api.post('/domains', data),
    update: (id: string, data: any) => api.patch(`/domains/${id}`, data),
    toggle: (id: string) => api.patch(`/domains/${id}/toggle`),
    delete: (id: string) => api.delete(`/domains/${id}`),
};

// SSL
export const sslApi = {
    list: (serverId?: string) => api.get('/ssl', { params: { serverId } }),
    request: (data: any) => api.post('/ssl/request', data),
    renew: (id: string) => api.post(`/ssl/${id}/renew`),
    delete: (id: string) => api.delete(`/ssl/${id}`),
};

// Databases
export const databasesApi = {
    list: (serverId?: string) => api.get('/databases', { params: { serverId } }),
    create: (data: any) => api.post('/databases', data),
    delete: (id: string) => api.delete(`/databases/${id}`),
};

// Deployments
export const deploymentsApi = {
    list: () => api.get('/deployments'),
    get: (id: string) => api.get(`/deployments/${id}`),
    create: (data: any) => api.post('/deployments', data),
    stop: (id: string) => api.post(`/deployments/${id}/stop`),
    restart: (id: string) => api.post(`/deployments/${id}/restart`),
    delete: (id: string) => api.delete(`/deployments/${id}`),
};

// Backups
export const backupsApi = {
    list: () => api.get('/backups'),
    create: (data: any) => api.post('/backups', data),
    restore: (id: string) => api.post(`/backups/${id}/restore`),
    delete: (id: string) => api.delete(`/backups/${id}`),
};

// Monitoring
export const monitoringApi = {
    dashboard: () => api.get('/monitoring/dashboard'),
    serverMetrics: (id: string, hours?: number) => api.get(`/monitoring/servers/${id}/metrics`, { params: { hours } }),
    realtime: (id: string) => api.get(`/monitoring/servers/${id}/realtime`),
};

// Logs
export const logsApi = {
    system: (serverId: string) => api.get(`/logs/${serverId}/system`),
    nginxAccess: (serverId: string) => api.get(`/logs/${serverId}/nginx/access`),
    nginxError: (serverId: string) => api.get(`/logs/${serverId}/nginx/error`),
    app: (serverId: string, appName: string) => api.get(`/logs/${serverId}/app/${appName}`),
};

// Security
export const securityApi = {
    firewallRules: (serverId: string) => api.get('/security/firewall', { params: { serverId } }),
    createRule: (data: any) => api.post('/security/firewall', data),
    toggleRule: (id: string) => api.patch(`/security/firewall/${id}/toggle`),
    deleteRule: (id: string) => api.delete(`/security/firewall/${id}`),
    fail2ban: (serverId: string) => api.get(`/security/fail2ban/${serverId}`),
};

// Users
export const usersApi = {
    list: () => api.get('/users'),
    me: () => api.get('/users/me'),
    changeRole: (id: string, role: string) => api.patch(`/users/${id}/role`, { role }),
    toggleActive: (id: string) => api.patch(`/users/${id}/toggle-active`),
    delete: (id: string) => api.delete(`/users/${id}`),
};

export default api;
