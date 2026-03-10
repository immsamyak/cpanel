import { Router } from 'express';

const router = Router();

// Request certificate via certbot
router.post('/request', (req, res) => {
    const { domain, email } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain is required' });

    console.log(`Requesting SSL certificate for ${domain}`);
    // In production: exec(`certbot certonly --nginx -d ${domain} --non-interactive --agree-tos -m ${email}`)
    res.json({
        message: `SSL certificate requested for ${domain}`,
        certificatePath: `/etc/letsencrypt/live/${domain}/fullchain.pem`,
        privateKeyPath: `/etc/letsencrypt/live/${domain}/privkey.pem`,
    });
});

// Renew certificate
router.post('/renew', (req, res) => {
    const { domain } = req.body;
    console.log(`Renewing SSL certificate for ${domain}`);
    // In production: exec(`certbot renew --cert-name ${domain}`)
    res.json({ message: `SSL certificate renewed for ${domain}` });
});

// Check certificate status
router.get('/status/:domain', (req, res) => {
    const { domain } = req.params;
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 60);

    res.json({
        domain,
        issuer: "Let's Encrypt",
        status: 'valid',
        issuedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        daysRemaining: 60,
    });
});

export { router as sslRoutes };
