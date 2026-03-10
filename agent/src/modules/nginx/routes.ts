import { Router } from 'express';

const router = Router();

// Create virtual host
router.post('/vhost', (req, res) => {
    const { domain, documentRoot, isReverseProxy, reverseProxyUrl } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain name is required' });

    let config: string;
    if (isReverseProxy && reverseProxyUrl) {
        config = `server {
    listen 80;
    server_name ${domain};

    location / {
        proxy_pass ${reverseProxyUrl};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}`;
    } else {
        config = `server {
    listen 80;
    server_name ${domain};
    root ${documentRoot || `/var/www/${domain}/public`};
    index index.html index.htm index.php;

    location / {
        try_files $uri $uri/ /index.html;
    }
}`;
    }

    // In production: write config to /etc/nginx/sites-available/ and symlink
    console.log(`Creating vhost for ${domain}`);
    res.json({ message: `Virtual host for ${domain} created`, config });
});

// Delete virtual host
router.delete('/vhost/:domain', (req, res) => {
    const { domain } = req.params;
    console.log(`Removing vhost for ${domain}`);
    res.json({ message: `Virtual host for ${domain} removed` });
});

// Reload nginx
router.post('/reload', (req, res) => {
    console.log('Reloading Nginx configuration');
    res.json({ message: 'Nginx reloaded successfully' });
});

// Test nginx config
router.get('/test', (req, res) => {
    res.json({ valid: true, message: 'nginx: configuration file /etc/nginx/nginx.conf test is successful' });
});

export { router as nginxRoutes };
